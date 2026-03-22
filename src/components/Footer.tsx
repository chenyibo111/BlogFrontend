import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 bg-surface-container-low border-t">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-on-surface-variant">
            © {currentYear} The Silent Curator. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            About
          </Link>
          <Link
            to="/archive"
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Archive
          </Link>
        </div>
      </div>
    </footer>
  );
}
