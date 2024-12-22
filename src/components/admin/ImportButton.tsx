import { useState } from 'react';
import { Button } from '../ui/Button';
import { getFunctions, httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';

interface ImportButtonProps {
  endpoint: string;
  label: string;
  countryCode?: string;
}

interface ImportResponse {
  count: number;
  message: string;
}

export const ImportButton = ({ endpoint, label, countryCode = 'NG' }: ImportButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const functions = getFunctions();
      console.log('Starting import with countryCode:', countryCode);
      
      const importFn = httpsCallable<{countryCode?: string}, ImportResponse>(functions, endpoint);
      const result = await importFn({ countryCode });
      
      console.log('Import result:', result);
      toast.success(`Successfully imported ${result.data.count} items`);
    } catch (error: any) {
      console.error('Import failed:', error);
      const message = error.details?.message || error.message || 'Unknown error occurred';
      toast.error(`Import failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleImport}
      disabled={isLoading}
      variant="primary"
    >
      {isLoading ? 'Importing...' : label}
    </Button>
  );
};
