import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { RoleProvider } from './context/RoleContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RoleProvider>
          <AppRoutes />
        </RoleProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
