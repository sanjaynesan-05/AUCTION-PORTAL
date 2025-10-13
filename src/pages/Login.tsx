import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { mockUsers } from '../data/mockUsers';
import { mockTeams } from '../data/mockTeams';
import { Crown, ArrowRight, Trophy, Zap, Shield } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useRole();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Find user by credentials only
      const user = mockUsers.find(u =>
        u.username === credentials.username &&
        u.password === credentials.password
      );

      if (user) {
        login(user);
        navigate(`/${user.role}`);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'presenter' | 'viewer', teamId?: number) => {
    let user;
    if (role === 'viewer' && teamId) {
      user = mockUsers.find(u => u.role === 'viewer' && u.teamId === teamId);
    } else {
      user = mockUsers.find(u => u.role === role && !u.teamId);
    }

    if (user) {
      login(user);
      navigate(`/${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Side - Branding */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  IPL Auction
                  <span className="text-yellow-400 block text-lg font-normal">Portal 2025</span>
                </h1>
              </div>
              <p className="text-xl text-gray-300 mb-8">
                Experience the thrill of cricket's biggest auction. Real-time bidding, live updates, and professional-grade auction management.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Real-time Updates
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Secure Authentication
                </div>
                <div className="flex items-center text-gray-300">
                  <Trophy className="w-5 h-5 mr-2 text-orange-400" />
                  Professional UI
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-300">Sign in to access the auction portal</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Login Options */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-400">Quick Access</span>
                  </div>
                </div>

                {/* Admin & Presenter */}
                <div className="mt-6 grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => handleQuickLogin('admin')}
                    className="flex flex-col items-center p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    <Crown className="w-6 h-6 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-300 font-medium">Admin</span>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('presenter')}
                    className="flex flex-col items-center p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    <Trophy className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-300 font-medium">Presenter</span>
                  </button>
                </div>

                {/* Team Viewers */}
                <div className="grid grid-cols-2 gap-2">
                  {mockUsers.filter(u => u.role === 'viewer').map(team => {
                    const teamData = mockTeams.find(t => t.id === team.teamId);
                    return (
                      <button
                        key={team.teamId}
                        onClick={() => handleQuickLogin('viewer', team.teamId)}
                        className="flex flex-col items-center p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all group text-center"
                        style={{
                          background: teamData ? `linear-gradient(135deg, ${teamData.primaryColor}20, ${teamData.secondaryColor}20)` : undefined,
                          borderColor: teamData ? `${teamData.primaryColor}40` : undefined
                        }}
                      >
                        {teamData && (
                          <img
                            src={teamData.logo}
                            alt={teamData.name}
                            className="w-6 h-6 mb-2 object-contain group-hover:scale-110 transition-transform"
                          />
                        )}
                        <span className="text-xs text-gray-300 font-medium">{team.teamName?.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <div><strong>Admin:</strong> admin / admin123</div>
                <div><strong>Presenter:</strong> presenter / presenter123</div>
                <div className="mt-2"><strong>Teams:</strong></div>
                <div>CSK: csk_viewer / csk@2024</div>
                <div>MI: mi_viewer / mi@2024</div>
                <div>RCB: rcb_viewer / rcb@2024</div>
                <div>KKR: kkr_viewer / kkr@2024</div>
                <div>DC: dc_viewer / dc@2024</div>
                <div>RR: rr_viewer / rr@2024</div>
                <div>PBKS: pbks_viewer / pbks@2024</div>
                <div>SRH: srh_viewer / srh@2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}