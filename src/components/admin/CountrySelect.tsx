import { useState } from 'react';
import { countries } from '../../data/countries';

interface CountrySelectProps {
  onSelect: (countryCode: string) => void;
}

export function CountrySelect({ onSelect }: CountrySelectProps) {
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCountry(code);
    onSelect(code);
  };

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
          {country.name}
        </option>
      ))}
    </select>
  );
}
