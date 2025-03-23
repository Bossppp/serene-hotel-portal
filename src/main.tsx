
import { createRoot } from 'react-dom/client';
import App from './pages/_app.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(<App Component={require('./App').default} pageProps={{}} />);
