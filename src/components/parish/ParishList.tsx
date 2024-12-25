import { useState } from 'react';
import { Parish } from "../../types/Parish";
import { ParishListItem } from "./ParishListItem";
import { ParishForm } from "./ParishForm";
import { useLocation } from '../../contexts/LocationContext';
import { useAdmin } from '../../hooks/useAdmin';
import { db } from '../../lib/firebase';
import { ref, remove, update } from 'firebase/database';
import toast from 'react-hot-toast';

interface ParishListProps {
  parishes: Parish[];
  onParishSelect: (parish: Parish) => void;
  loading?: boolean;
}

export function ParishList({ parishes, onParishSelect, loading = false }: ParishListProps) {
  const [editingParish, setEditingParish] = useState<Parish | null>(null);
  const { selectedCountry } = useLocation();
  const { isAdmin } = useAdmin();

  const handleEdit = (parish: Parish) => {
    setEditingParish(parish);
  };

  const handleUpdate = async (updatedData: Partial<Parish>) => {
    try {
      if (!editingParish?.id) return;

      const parishRef = ref(db, `parishes/${editingParish.id}`);
      await update(parishRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Parish updated successfully');
      setEditingParish(null);
    } catch (error) {
      console.error('Error updating parish:', error);
      toast.error('Failed to update parish');
    }
  };

  const handleDelete = async (parishId: string) => {
    try {
      const parishRef = ref(db, `parishes/${parishId}`);
      await remove(parishRef);
      toast.success('Parish deleted successfully');
    } catch (error) {
      console.error('Error deleting parish:', error);
      toast.error('Failed to delete parish');
    }
  };

  const filteredParishes = parishes.filter(
    parish => parish.address.country === selectedCountry
  );

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredParishes.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">
          No parishes found in {selectedCountry}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-auto">
        <div className="p-4 space-y-4">
          {filteredParishes.map((parish) => (
            <ParishListItem
              key={parish.id}
              parish={parish}
              onClick={() => onParishSelect(parish)}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <ParishForm
        parish={editingParish || undefined}
        isOpen={!!editingParish}
        onClose={() => setEditingParish(null)}
        onSubmit={handleUpdate}
      />
    </>
  );
}