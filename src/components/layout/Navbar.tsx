
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Hotel, Calendar, Home } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary transition-colors hover:text-primary/90">
          Serenity Hotels
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/hotels" 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/hotels' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Hotels
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/admin') 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Admin
                </Link>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logout()}
                className="ml-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-slide-down">
          <div className="container px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-accent"
              onClick={closeMenu}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link 
              to="/hotels" 
              className="flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-accent"
              onClick={closeMenu}
            >
              <Hotel className="w-4 h-4 mr-2" />
              Hotels
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                  onClick={closeMenu}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                    onClick={closeMenu}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-accent w-full text-left"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  className="px-4 py-3 text-center rounded-md text-sm font-medium bg-accent text-accent-foreground"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-3 text-center rounded-md text-sm font-medium bg-primary text-primary-foreground"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
