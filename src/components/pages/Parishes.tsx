
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ParishList } from '../parish/ParishList';
import { useParishes } from '../../hooks/useParishes';
import { Parish } from '../../types/Parish';

export function Parishes() {
  const navigate = useNavigate();
  const { parishes, loading } = useParishes();

  const handleParishSelect = (parish: Parish) => {
    navigate(`/parish/${parish.id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Parishes</h1>
      <ParishList
        parishes={parishes}
        onParishSelect={handleParishSelect}
        loading={loading}
      />
    </div>
  );
}