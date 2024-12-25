import { useState } from 'react';
import { countries } from '../../data/countries';
import { useParishes } from '../../hooks/useParishes';

interface CountrySelectProps {
  onSelect: (countryCode: string) => void;
  value?: string;
}

export function CountrySelect({ onSelect, value }: CountrySelectProps) {
  const { parishes } = useParishes();
  const [selectedCountry, setSelectedCountry] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCountry(code);
    onSelect(code);
  };

  // Get count of parishes by country
  const countryParishCounts = parishes.reduce((acc, parish) => {
    const country = parish.address.country;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <select
      value={selectedCountry}
      onChange={handleChange}
      name="countrySelect"
      id="countrySelect"
      aria-label="Select a country"
      title="Country selection"
      className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
    >
      <option value="">Select a country</option>
      {countries.map(country => (
        <option key={country.code} value={country.code}>
          {country.name} ({countryParishCounts[country.code] || 0})
        </option>
      ))}
    </select>
  );
}
