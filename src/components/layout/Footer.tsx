import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-800">CelestialMap</h3>
          <p className="text-sm text-gray-600">Finding parishes worldwide</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/map" className="text-gray-600 hover:text-primary">
            Find Parishes
          </Link>
          <Link to="/marketplace" className="text-gray-600 hover:text-primary">
            Marketplace
          </Link>
          <a 
            href="mailto:support@celestialmap.com"
            className="text-gray-600 hover:text-primary"
          >
            Contact
          </a>
        </div>

        <div className="text-sm text-gray-500">
          © {currentYear} CelestialMap. All rights reserved.
        </div>
      </div>
    </footer>
  );
}