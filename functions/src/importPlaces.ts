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

export async function importPlacesFromGoogle(countryCode: string = 'NG') {
  const client = new Client({});
  let importCount = 0;
  const parishesRef = admin.database().ref('parishes');
  
  try {
    const config = functions.config();
    const apiKey = config.google?.maps_key;
    
    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    const countryName = getCountryName(countryCode);
    // Use multiple search terms to find more parishes
    const searchTerms = [
      `"Celestial Church of Christ" in ${countryName}`,
      `"CCC Parish" in ${countryName}`,
      `"Celestial Parish" in ${countryName}`,
      `"Eglise du Christianisme Celeste" in ${countryName}`, // French name
    ];

    let places: GooglePlace[] = [];
    for (const query of searchTerms) {
      console.log(`Searching with query: ${query}`);
      const response = await client.textSearch({
        params: {
          query,
          key: process.env.GOOGLE_MAPS_API_KEY || '',
          type: PlaceType.church,
          language: Language.en,
          region: countryCode.toLowerCase()
        }
      });
      places = [...places, ...response.data.results as GooglePlace[]];
    }

    // Remove duplicates based on place_id
    const uniquePlaces = Array.from(new Map(places.map(place => [place.place_id, place])).values());

    const validPlaces = uniquePlaces.filter(
      place => place.name?.toLowerCase().includes('celestial church')
    );

    for (const place of validPlaces) {
      if (!place.place_id || !place.name || !place.formatted_address || !place.geometry?.location) {
        console.log('Skipping invalid place:', place);
        continue;
      }

      if (!isPlaceInCountry(place.formatted_address || '', countryCode)) {
        console.log(`Skipping place not in ${countryCode}:`, place.formatted_address);
        continue;
      }

      const details = await client.placeDetails({
        params: {
          place_id: place.place_id,
          key: apiKey,
          fields: ['formatted_phone_number', 'website', 'opening_hours']
        }
      });

      const addressParts = place.formatted_address.split(',').map((part: string) => part.trim());
      const parish: Omit<Parish, 'id'> = {
        name: place.name,
        address: {
          street: addressParts[0] || '',
          city: addressParts[1] || '',
          province: addressParts[2] || '',
          country: countryCode,
          postalCode: ''
        },
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        phone: details.data.result.formatted_phone_number || '',
        email: '',
        website: details.data.result.website || '',
        leaderName: '',
        description: place.formatted_address,
        photos: place.photos?.map((p: { photo_reference: string }) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${apiKey}`
        ) || [],
        openingHours: details.data.result.opening_hours?.weekday_text?.reduce((acc, curr) => {
          const [day, hours] = curr.split(': ');
          return { ...acc, [day.toLowerCase()]: hours };
        }, {} as Record<string, string>) || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importSource: 'google_places' as const,
        sourceId: place.place_id
      };

      // Check if parish already exists by sourceId
      const existingParish = (await parishesRef
        .orderByChild('sourceId')
        .equalTo(place.place_id)
        .once('value')).val();

      if (!existingParish) {
        await parishesRef.push(parish);
        importCount++;
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
      'AF': 'Afghanistan',
      'AX': 'Åland Islands',
      'AL': 'Albania',
      'DZ': 'Algeria',
      'AS': 'American Samoa',
      'AD': 'Andorra',
      'AO': 'Angola',
      'AI': 'Anguilla',
      'AQ': 'Antarctica',
      'AG': 'Antigua and Barbuda',
      'AR': 'Argentina',
      'AM': 'Armenia',
      'AW': 'Aruba',
      'AU': 'Australia',
      'AT': 'Austria',
      'AZ': 'Azerbaijan',
      'BS': 'Bahamas',
      'BH': 'Bahrain',
      'BD': 'Bangladesh',
      'BB': 'Barbados',
      'BY': 'Belarus',
      'BE': 'Belgium',
      'BZ': 'Belize',
      'BJ': 'Benin',
      'BM': 'Bermuda',
      'BT': 'Bhutan',
      'BO': 'Bolivia',
      'BQ': 'Bonaire, Sint Eustatius and Saba',
      'BA': 'Bosnia and Herzegovina',
      'BW': 'Botswana',
      'BV': 'Bouvet Island',
      'BR': 'Brazil',
      'IO': 'British Indian Ocean Territory',
      'BN': 'Brunei Darussalam',
      'BG': 'Bulgaria',
      'BF': 'Burkina Faso',
      'BI': 'Burundi',
      'CV': 'Cabo Verde',
      'KH': 'Cambodia',
      'CM': 'Cameroon',
      'CA': 'Canada',
      'KY': 'Cayman Islands',
      'CF': 'Central African Republic',
      'TD': 'Chad',
      'CL': 'Chile',
      'CN': 'China',
      'CX': 'Christmas Island',
      'CC': 'Cocos (Keeling) Islands',
      'CO': 'Colombia',
      'KM': 'Comoros',
      'CG': 'Congo',
      'CD': 'Congo, Democratic Republic of the',
      'CK': 'Cook Islands',
      'CR': 'Costa Rica',
      'CI': 'Côte d\'Ivoire',
      'HR': 'Croatia',
      'CU': 'Cuba',
      'CW': 'Curaçao',
      'CY': 'Cyprus',
      'CZ': 'Czech Republic',
      'DK': 'Denmark',
      'DJ': 'Djibouti',
      'DM': 'Dominica',
      'DO': 'Dominican Republic',
      'EC': 'Ecuador',
      'EG': 'Egypt',
      'SV': 'El Salvador',
      'GQ': 'Equatorial Guinea',
      'ER': 'Eritrea',
      'EE': 'Estonia',
      'SZ': 'Eswatini',
      'ET': 'Ethiopia',
      'FK': 'Falkland Islands (Malvinas)',
      'FO': 'Faroe Islands',
      'FJ': 'Fiji',
      'FI': 'Finland',
      'FR': 'France',
      'GF': 'French Guiana',
      'PF': 'French Polynesia',
      'TF': 'French Southern Territories',
      'GA': 'Gabon',
      'GM': 'Gambia',
      'GE': 'Georgia',
      'DE': 'Germany',
      'GH': 'Ghana',
      'GI': 'Gibraltar',
      'GR': 'Greece',
      'GL': 'Greenland',
      'GD': 'Grenada',
      'GP': 'Guadeloupe',
      'GU': 'Guam',
      'GT': 'Guatemala',
      'GG': 'Guernsey',
      'GN': 'Guinea',
      'GW': 'Guinea-Bissau',
      'GY': 'Guyana',
      'HT': 'Haiti',
      'HM': 'Heard Island and McDonald Islands',
      'VA': 'Holy See',
      'HN': 'Honduras',
      'HK': 'Hong Kong',
      'HU': 'Hungary',
      'IS': 'Iceland',
      'IN': 'India',
      'ID': 'Indonesia',
      'IR': 'Iran',
      'IQ': 'Iraq',
      'IE': 'Ireland',
      'IM': 'Isle of Man',
      'IL': 'Israel',
      'IT': 'Italy',
      'JM': 'Jamaica',
      'JP': 'Japan',
      'JE': 'Jersey',
      'JO': 'Jordan',
      'KZ': 'Kazakhstan',
      'KE': 'Kenya',
      'KI': 'Kiribati',
      'KP': 'North Korea',
      'KR': 'South Korea',
      'KW': 'Kuwait',
      'KG': 'Kyrgyzstan',
      'LA': 'Lao People\'s Democratic Republic',
      'LV': 'Latvia',
      'LB': 'Lebanon',
      'LS': 'Lesotho',
      'LR': 'Liberia',
      'LY': 'Libya',
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
      'FM': 'Micronesia',
      'MD': 'Moldova',
      'MC': 'Monaco',
      'MN': 'Mongolia',
      'ME': 'Montenegro',
      'MS': 'Montserrat',
      'MA': 'Morocco',
      'MZ': 'Mozambique',
      'MM': 'Myanmar',
      'NA': 'Namibia',
      'NR': 'Nauru',
      'NP': 'Nepal',
      'NL': 'Netherlands',
      'NC': 'New Caledonia',
      'NZ': 'New Zealand',
      'NI': 'Nicaragua',
      'NE': 'Niger',
      'NG': 'Nigeria',
      'NU': 'Niue',
      'NF': 'Norfolk Island',
      'MK': 'North Macedonia',
      'MP': 'Northern Mariana Islands',
      'NO': 'Norway',
      'OM': 'Oman',
      'PK': 'Pakistan',
      'PW': 'Palau',
      'PS': 'Palestine, State of',
      'PA': 'Panama',
      'PG': 'Papua New Guinea',
      'PY': 'Paraguay',
      'PE': 'Peru',
      'PH': 'Philippines',
      'PN': 'Pitcairn',
      'PL': 'Poland',
      'PT': 'Portugal',
      'PR': 'Puerto Rico',
      'QA': 'Qatar',
      'RE': 'Réunion',
      'RO': 'Romania',
      'RU': 'Russian Federation',
      'RW': 'Rwanda',
      'BL': 'Saint Barthélemy',
      'SH': 'Saint Helena, Ascension and Tristan da Cunha',
      'KN': 'Saint Kitts and Nevis',
      'LC': 'Saint Lucia',
      'MF': 'Saint Martin (French part)',
      'PM': 'Saint Pierre and Miquelon',
      'VC': 'Saint Vincent and the Grenadines',
      'WS': 'Samoa',
      'SM': 'San Marino',
      'ST': 'Sao Tome and Principe',
      'SA': 'Saudi Arabia',
      'SN': 'Senegal',
      'RS': 'Serbia',
      'SC': 'Seychelles',
      'SL': 'Sierra Leone',
      'SG': 'Singapore',
      'SX': 'Sint Maarten (Dutch part)',
      'SK': 'Slovakia',
      'SI': 'Slovenia',
      'SB': 'Solomon Islands',
      'SO': 'Somalia',
      'ZA': 'South Africa',
      'GS': 'South Georgia and the South Sandwich Islands',
      'SS': 'South Sudan',
      'ES': 'Spain',
      'LK': 'Sri Lanka',
      'SD': 'Sudan',
      'SR': 'Suriname',
      'SJ': 'Svalbard and Jan Mayen',
      'SE': 'Sweden',
      'CH': 'Switzerland',
      'SY': 'Syrian Arab Republic',
      'TW': 'Taiwan',
      'TJ': 'Tajikistan',
      'TZ': 'Tanzania, United Republic of',
      'TH': 'Thailand',
      'TL': 'Timor-Leste',
      'TG': 'Togo',
      'TK': 'Tokelau',
      'TO': 'Tonga',
      'TT': 'Trinidad and Tobago',
      'TN': 'Tunisia',
      'TR': 'Turkey',
      'TM': 'Turkmenistan',
      'TC': 'Turks and Caicos Islands',
      'TV': 'Tuvalu',
      'UG': 'Uganda',
      'UA': 'Ukraine',
      'AE': 'United Arab Emirates',
      'GB': 'United Kingdom',
      'US': 'United States of America',
      'UM': 'United States Minor Outlying Islands',
      'UY': 'Uruguay',
      'UZ': 'Uzbekistan',
      'VU': 'Vanuatu',
      'VE': 'Venezuela (Bolivarian Republic of)',
      'VN': 'Viet Nam',
      'VG': 'Virgin Islands (British)',
      'VI': 'Virgin Islands (U.S.)',
      'WF': 'Wallis and Futuna',
      'EH': 'Western Sahara',
      'YE': 'Yemen',
      'ZM': 'Zambia',
      'ZW': 'Zimbabwe',
    };
  return countries[countryCode] || countryCode;
}

function isPlaceInCountry(address: string, countryCode: string): boolean {
  const countryName = getCountryName(countryCode);
  return address.toLowerCase().includes(countryName.toLowerCase());
}
