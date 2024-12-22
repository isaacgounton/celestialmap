import { useState } from 'react';
import { Button } from '../ui/Button';
import { getFunctions, httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';

interface ImportButtonProps {
  endpoint: string;
  label: string;
}

interface ImportResponse {
  count: number;
  message: string;
}

export const ImportButton = ({ endpoint, label }: ImportButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const functions = getFunctions();
      const importFn = httpsCallable<unknown, ImportResponse>(functions, endpoint);
      const result = await importFn();
      
      toast.success(`Successfully imported ${result.data.count} items`);
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Import failed. Please try again.');
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
