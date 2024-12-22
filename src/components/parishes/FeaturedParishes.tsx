import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Parish } from '../../types/Parish';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '../../lib/firebase';

interface FeaturedParishesProps {
  country?: string;
}

export const FeaturedParishes: React.FC<FeaturedParishesProps> = ({ country }) => {
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedParishes = async () => {
      try {
        const parishesRef = ref(db, 'parishes');
        const featuredQuery = query(parishesRef, 
          orderByChild('featured'), 
          equalTo(true)
        );
        
        const snapshot = await get(featuredQuery);
        if (snapshot.exists()) {
          const parishData = snapshot.val();
          const featuredParishes = Object.entries(parishData)
            .map(([id, data]: [string, any]) => ({
              id,
              ...data
            }))
            .filter(parish => !country || parish.address.country === country)
            .sort((a, b) => new Date(b.featuredAt).getTime() - new Date(a.featuredAt).getTime())
            .slice(0, 4);
          
          setParishes(featuredParishes);
        }
      } catch (error) {
        console.error('Error loading featured parishes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedParishes();
  }, [country]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (parishes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
      <h2 className="text-lg font-semibold mb-3">
        Featured Parishes {country ? `in ${country}` : ''}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {parishes.map((parish) => (
          <Link 
            key={parish.id} 
            to={`/parish/${parish.id}`}
            className="block hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <div className="cursor-pointer">
              <h3 className="font-medium truncate">{parish.name}</h3>
              <p className="text-sm text-gray-600 truncate">{parish.address.city}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
