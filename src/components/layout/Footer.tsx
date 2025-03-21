
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold mb-4">Serenity Hotels</h3>
            <p className="text-muted-foreground">
              Making your stay memorable with exceptional service and comfort.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <address className="not-italic text-muted-foreground">
              <p>123 Serenity Lane</p>
              <p>Peaceful District</p>
              <p>Tranquil Province, 10110</p>
              <p className="mt-2">Tel: +66 123 456 789</p>
              <p>Email: info@serenityhotels.com</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Serenity Hotels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
