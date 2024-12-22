import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface ImportButtonProps {
  endpoint: string;
  label: string;
}

export const ImportButton: React.FC<ImportButtonProps> = ({ endpoint, label }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Import result:', data);
      alert(`Successfully imported ${data.imported} places`);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleImport}
      disabled={isLoading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      {isLoading ? 'Importing...' : label}
    </Button>
  );
};
