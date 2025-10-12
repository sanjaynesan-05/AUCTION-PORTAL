import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { RoleProvider } from './context/RoleContext';

function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <AppRoutes />
      </RoleProvider>
    </BrowserRouter>
  );
}

export default App;
