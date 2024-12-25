import { 
  Client, 
  PlaceType1 as PlaceType,
  Language,
  Place,
  AddressGeometry,
  PlacePhoto 
} from '@googlemaps/google-maps-services-js';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Parish } from './types/Parish';

interface GooglePlace extends Omit<Place, 'geometry' | 'photos'> {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: AddressGeometry;
  photos?: Array<PlacePhoto>;
}

interface CountryConfig {
  name: string;
  language: Language;
  searchTerms: string[];
  validationTerms: string[]; // Now required, not optional
}

// Base search terms for any country
const baseSearchTerms = [
  'Celestial Church of Christ',
  'CCC Parish',
  'Eglise du Christianisme Celeste',
  'ECC Paroisse',
];

// Default validation terms
const defaultValidationTerms = [
  'celestial church',
  'christianisme celeste',
  'ccc',
  'ecc',
];

const countryConfigs: Record<string, Partial<CountryConfig>> = {
  'BJ': {
    name: 'Benin',
    language: Language.fr,
    searchTerms: [
      'Eglise du Christianisme Celeste Benin',
      'ECC Paroisse Benin',
      'Christianisme Celeste Porto-Novo',
    ],
    validationTerms: [
      'christianisme celeste',
      'ecc paroisse',
      'eglise celeste'
    ]
  },
  'FR': {
    name: 'France',
    language: Language.fr,
    searchTerms: [
      'Eglise du Christianisme Celeste',
      'Eglise Celeste France',
      'Christianisme Celeste Paris',
    ]
  },
  'NG': {
    name: 'Nigeria',
    language: Language.en,
    searchTerms: [
      'Celestial Church of Christ',
      'Celestial Church Parish Nigeria',
      'Celestial Parish Lagos',
    ]
  },
  // Add more countries as needed
};

function getCountryConfig(countryCode: string): CountryConfig {
  const defaultConfig = {
    name: getCountryName(countryCode),
    language: Language.en,
    searchTerms: baseSearchTerms,
    validationTerms: defaultValidationTerms
  };

  const specificConfig = countryConfigs[countryCode];
  if (!specificConfig) {
    console.log(`No specific configuration for ${countryCode}, using defaults`);
    return defaultConfig;
  }

  return {
    ...defaultConfig,
    ...specificConfig,
    // Merge search terms if exists
    searchTerms: [
      ...baseSearchTerms,
      ...(specificConfig.searchTerms || [])
    ],
    // Merge validation terms if exists
    validationTerms: [
      ...defaultValidationTerms,
      ...(specificConfig.validationTerms || [])
    ]
  };
}

function buildSearchQuery(term: string, countryName: string): string {
  // Exact match with quotes and explicit country name
  return `"${term}" "${countryName}"`;
}

function isCelestialParish(place: GooglePlace, config: CountryConfig): boolean {
  const nameLower = place.name.toLowerCase();
  const addressLower = place.formatted_address.toLowerCase();
  
  return config.validationTerms.some(term => 
    nameLower.includes(term) || addressLower.includes(term)
  );
}

export async function importPlacesFromGoogle(countryCode: string = 'NG') {
  const client = new Client({});
  const config = getCountryConfig(countryCode);
  
  if (!config) {
    throw new Error(`Country ${countryCode} not configured`);
  }

  let importCount = 0;
  const parishesRef = admin.database().ref('parishes');
  
  try {
    const functionsConfig = functions.config();
    const apiKey = functionsConfig.google?.maps_key;
    
    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    const searchQueries = config.searchTerms.map(term => 
      buildSearchQuery(term, config.name)
    );

    let allPlaces: GooglePlace[] = [];
    for (const query of searchQueries) {
      console.log(`Searching with query: ${query}, language: ${config.language}`);
      try {
        const response = await client.textSearch({
          params: {
            query,
            key: apiKey,
            type: PlaceType.church,
            language: config.language,
            region: countryCode.toLowerCase()
          }
        });

        if (response.data.results) {
          allPlaces.push(...response.data.results as GooglePlace[]);
        } else {
          console.warn(`No results found for query: ${query}`);
        }
      } catch (error) {
        console.error(`Error searching for query: ${query}`, error);
      }
    }

    // Remove duplicates based on place_id
    const uniquePlaces = allPlaces.filter((place, index, self) =>
      index === self.findIndex((p) => p.place_id === place.place_id)
    );

    for (const place of uniquePlaces) {
      try {
        // Add validation to ensure it's a Celestial Church parish
        if (!isCelestialParish(place, config)) {
          console.log(`Skipping non-Celestial Church: ${place.name}`);
          continue;
        }

        if (!place.formatted_address.toLowerCase().includes(config.name.toLowerCase())) {
          console.log(`Skipping ${place.name} - not in ${config.name}`);
          continue;
        }

        const details = await client.placeDetails({
          params: {
            place_id: place.place_id,
            key: apiKey,
            fields: ['formatted_phone_number', 'website', 'opening_hours', 'international_phone_number', 'photos']
          }
        });

        const addressParts = place.formatted_address.split(',').map(part => part.trim());
        const parishData: Omit<Parish, 'id'> = {
          name: place.name,
          address: {
            street: addressParts[0] || '',
            city: addressParts[1] || '',
            province: addressParts[2] || '',
            country: countryCode,
            postalCode: '' // Extract postal code if needed
          },
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          phone: details.data.result.international_phone_number || details.data.result.formatted_phone_number || '',
          email: '', // Extract email if available
          website: details.data.result.website || '',
          leaderName: '', // Extract leader name if available
          description: place.formatted_address,
          photos: details.data.result.photos?.map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
          ) || [],
          openingHours: details.data.result.opening_hours?.weekday_text?.reduce((acc, curr) => {
            const [day, hours] = curr.split(': ');
            return { ...acc, [day.toLowerCase()]: hours };
          }, {} as Record<string, string>) || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          importSource: 'google_places',
          sourceId: place.place_id
        };

        // Check if parish already exists by sourceId
        const existingParishSnapshot = await parishesRef.orderByChild('sourceId').equalTo(place.place_id).once('value');
        const existingParish = existingParishSnapshot.val();

        if (!existingParish) {
          await parishesRef.push(parishData);
          importCount++;
          console.log(`Imported new parish: ${place.name}`);
        } else {
          // Update existing parish if needed
          const existingParishId = Object.keys(existingParish)[0];
          await parishesRef.child(existingParishId).update(parishData);
          console.log(`Updated parish: ${place.name}`);
        }
      } catch (error) {
        console.error(`Error processing place: ${place.name}`, error);
      }
    }

    return { count: importCount, message: `Imported ${importCount} new parishes` };
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}

function getCountryName(countryCode: string): string {
    const countries: Record<string, string> = {
      'AO': 'Angola',
      'AR': 'Argentina',
      'AU': 'Australia',
      'AT': 'Austria',
      'BE': 'Belgium',
      'BZ': 'Belize',
      'BJ': 'Benin',
      'BW': 'Botswana',
      'BR': 'Brazil',
      'BF': 'Burkina Faso',
      'BI': 'Burundi',
      'CM': 'Cameroon',
      'CA': 'Canada',
      'CF': 'Central African Republic',
      'TD': 'Chad',
      'CL': 'Chile',
      'CX': 'Christmas Island',
      'KM': 'Comoros',
      'CG': 'Congo',
      'CD': 'Congo, Democratic Republic of the',
      'CI': 'Côte d\'Ivoire',
      'CU': 'Cuba',
      'DK': 'Denmark',
      'DJ': 'Djibouti',
      'DM': 'Dominica',
      'DO': 'Dominican Republic',
      'EC': 'Ecuador',
      'GQ': 'Equatorial Guinea',
      'ER': 'Eritrea',
      'ET': 'Ethiopia',
      'FI': 'Finland',
      'FR': 'France',
      'GF': 'French Guiana',
      'PF': 'French Polynesia',
      'TF': 'French Southern Territories',
      'GA': 'Gabon',
      'GM': 'Gambia',
      'DE': 'Germany',
      'GH': 'Ghana',
      'GR': 'Greece',
      'GL': 'Greenland',
      'GD': 'Grenada',
      'GP': 'Guadeloupe',
      'GN': 'Guinea',
      'GW': 'Guinea-Bissau',
      'GY': 'Guyana',
      'HT': 'Haiti',
      'VA': 'Holy See',
      'HK': 'Hong Kong',
      'IE': 'Ireland',
      'IL': 'Israel',
      'IT': 'Italy',
      'JM': 'Jamaica',
      'JE': 'Jersey',
      'JO': 'Jordan',
      'KE': 'Kenya',
      'LS': 'Lesotho',
      'LR': 'Liberia',
      'LI': 'Liechtenstein',
      'LT': 'Lithuania',
      'LU': 'Luxembourg',
      'MO': 'Macao',
      'MG': 'Madagascar',
      'MW': 'Malawi',
      'MY': 'Malaysia',
      'MV': 'Maldives',
      'ML': 'Mali',
      'MT': 'Malta',
      'MH': 'Marshall Islands',
      'MQ': 'Martinique',
      'MR': 'Mauritania',
      'MU': 'Mauritius',
      'YT': 'Mayotte',
      'MX': 'Mexico',
      'MC': 'Monaco',
      'MN': 'Mongolia',
      'ME': 'Montenegro',
      'MA': 'Morocco',
      'MZ': 'Mozambique',
      'MM': 'Myanmar',
      'NA': 'Namibia',
      'NR': 'Nauru',
      'NP': 'Nepal',
      'NL': 'Netherlands',
      'NC': 'New Caledonia',
      'NZ': 'New Zealand',
      'NE': 'Niger',
      'NG': 'Nigeria',
      'NF': 'Norfolk Island',
      'MK': 'North Macedonia',
      'NO': 'Norway',
      'PT': 'Portugal',
      'PR': 'Puerto Rico',
      'RE': 'Réunion',
      'RO': 'Romania',
      'RU': 'Russian Federation',
      'RW': 'Rwanda',
      'WS': 'Samoa',
      'SM': 'San Marino',
      'ST': 'Sao Tome and Principe',
      'SN': 'Senegal',
      'RS': 'Serbia',
      'SC': 'Seychelles',
      'SL': 'Sierra Leone',
      'SG': 'Singapore',
      'SB': 'Solomon Islands',
      'ZA': 'South Africa',
      'ES': 'Spain',
      'SE': 'Sweden',
      'CH': 'Switzerland',
      'TZ': 'Tanzania, United Republic of',
      'TL': 'Timor-Leste',
      'TG': 'Togo',
      'TT': 'Trinidad and Tobago',
      'UG': 'Uganda',
      'GB': 'United Kingdom',
      'US': 'United States of America',
      'UM': 'United States Minor Outlying Islands',
      'UY': 'Uruguay',
      'VU': 'Vanuatu',
      'VE': 'Venezuela (Bolivarian Republic of)',
      'VG': 'Virgin Islands (British)',
      'VI': 'Virgin Islands (U.S.)',
      'WF': 'Wallis and Futuna',
      'ZM': 'Zambia',
      'ZW': 'Zimbabwe',
    };
  return countries[countryCode] || countryCode;
}
