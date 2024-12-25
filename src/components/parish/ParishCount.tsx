interface ParishCountProps {
  count: number;
  countryName?: string;
  className?: string;
}

export function ParishCount({ count, countryName, className = '' }: ParishCountProps) {
  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      {countryName ? (
        <span>{count} {count === 1 ? 'parish' : 'parishes'} in {countryName}</span>
      ) : (
        <span>{count} {count === 1 ? 'parish' : 'parishes'} available</span>
      )}
    </div>
  );
}
