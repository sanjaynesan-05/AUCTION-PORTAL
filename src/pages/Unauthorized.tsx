import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500 rounded-full mb-6 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-red-200 mb-8 text-lg">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-red-900 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition shadow-lg"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}
