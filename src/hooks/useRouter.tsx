
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Creates a hook similar to Next.js useRouter but using react-router-dom
export function useRouter() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  return {
    // Path parameters
    query: params,
    // Current pathname
    pathname: location.pathname,
    // Navigation methods
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    // Route information
    asPath: location.pathname + location.search,
    // To simulate Next.js router events
    events: {
      on: () => {},
      off: () => {},
    },
  };
}

export default useRouter;
