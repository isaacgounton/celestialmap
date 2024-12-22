interface MapControlsProps {
  onRefresh: () => void;
  onSearch: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  loading?: boolean;
}

export function MapControls({
  onRefresh,
  onSearch,
  onZoomIn,
  onZoomOut,
  loading = false
}: MapControlsProps) {
  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
      <div className="bg-white rounded-lg shadow-md p-2 space-y-2">
        <button 
          className="p-2 hover:bg-gray-100 rounded"
          onClick={onZoomIn}
          aria-label="Zoom in"
        >
          +
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded"
          onClick={onZoomOut}
          aria-label="Zoom out"
        >
          −
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh location"
        >
          📍
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded"
          onClick={onSearch}
          disabled={loading}
          aria-label="Search nearby"
        >
          🔍
        </button>
      </div>
    </div>
  );
}