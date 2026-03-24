import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function TopNavBar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-16">
        <Link 
          to="/" 
          className="text-xl font-serif font-bold text-primary"
        >
          The Silent Curator
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Home
          </Link>
          <Link
            to="/archive"
            className={`text-sm font-medium transition-colors ${
              isActive('/archive')
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Archive
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors ${
              isActive('/about')
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            About
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Write Button - Only shown when logged in */}
          {isAuthenticated && (
            <Link
              to="/write"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              aria-label="Write a new post"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">edit</span>
              Write
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-outline-variant/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-3 py-2 border-b border-outline-variant/10">
                  <p className="text-sm font-medium text-on-surface truncate">{user?.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                </div>
                <Link
                  to="/write"
                  className="block px-3 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  Write Post
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-3 py-2 text-sm text-error hover:bg-surface-container transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col py-2">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-medium ${
                isActive('/')
                  ? 'text-primary bg-primary/5'
                  : 'text-on-surface-variant'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/archive"
              className={`px-4 py-2 text-sm font-medium ${
                isActive('/archive')
                  ? 'text-primary bg-primary/5'
                  : 'text-on-surface-variant'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Archive
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 text-sm font-medium ${
                isActive('/about')
                  ? 'text-primary bg-primary/5'
                  : 'text-on-surface-variant'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/write"
                  className="px-4 py-2 text-sm font-medium text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Write Post
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-error text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
