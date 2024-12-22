import { useState } from 'react';
import { Button } from '../ui/Button';
import { getFunctions, httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';

interface ImportButtonProps {
  endpoint: string;
  label: string;
  countryCode?: string;
  source: 'places' | 'mymaps' | 'spreadsheet';
  data?: {
    url?: string;
  };
}

interface ImportResponse {
  count: number;
  message: string;
}

export const ImportButton = ({ endpoint, label, countryCode = 'NG', source, data }: ImportButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const functions = getFunctions();
      console.log(`Starting ${source} import...`);
      
      const importFn = httpsCallable<{
        countryCode?: string;
        source: string;
        url?: string;
      }, ImportResponse>(
        functions, 
        getEndpoint(source, endpoint)
      );
      
      const result = await importFn({ 
        countryCode, 
        source,
        ...data
      });
      
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

  const getEndpoint = (source: string, defaultEndpoint: string) => {
    switch (source) {
      case 'mymaps':
        return 'importExistingPlaces';
      case 'spreadsheet':
        return 'importFromSpreadsheetFn';
      default:
        return defaultEndpoint;
    }
  };

  const getButtonVariant = (source: string) => {
    switch (source) {
      case 'places':
        return 'primary';
      case 'mymaps':
        return 'secondary';
      case 'spreadsheet':
        return 'outline';
      default:
        return 'primary';
    }
  };

  return (
    <Button
      onClick={handleImport}
      disabled={isLoading}
      variant={getButtonVariant(source)}
      className="min-w-[200px]"
    >
      {isLoading ? 'Importing...' : label}
    </Button>
  );
};
