import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { mockUsers } from '../data/mockUsers';
import { mockTeams } from '../data/mockTeams';
import { Crown, ArrowRight, Trophy, Users, LogIn, Sparkles } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'quick'>('login');
  const { login } = useRole();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = mockUsers.find(u =>
        u.username === credentials.username &&
        u.password === credentials.password
      );

      if (user) {
        login(user);
        // Navigate to appropriate dashboard based on role
        const dashboardRoute = user.role === 'admin' ? '/admin' :
                              user.role === 'presenter' ? '/presenter' : '/viewer';
        navigate(dashboardRoute);
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
      // Navigate to appropriate dashboard based on role
      const dashboardRoute = user.role === 'admin' ? '/admin' :
                            user.role === 'presenter' ? '/presenter' : '/viewer';
      navigate(dashboardRoute);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-2">
              IPL Auction
              <span className="text-yellow-400 block text-xl lg:text-2xl font-light mt-2">Portal 2025</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the thrill of cricket's biggest auction with real-time bidding and professional management
            </p>
          </div>

          {/* Main Login Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8 lg:p-12">

              {/* Tab Navigation */}
              <div className="flex rounded-xl bg-white/5 p-1 mb-8">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'login'
                      ? 'bg-yellow-400 text-black shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn className="w-4 h-4 inline mr-2" />
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('quick')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'quick'
                      ? 'bg-yellow-400 text-black shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Quick Access
                </button>
              </div>

              {/* Login Form Tab */}
              {activeTab === 'login' && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Enter your credentials to access the portal</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={credentials.username}
                          onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-lg"
                          placeholder="Enter your username"
                          required
                          aria-label="Username"
                          aria-describedby={error ? "login-error" : undefined}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={credentials.password}
                          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-lg"
                          placeholder="Enter your password"
                          required
                          aria-label="Password"
                          aria-describedby={error ? "login-error" : undefined}
                        />
                      </div>
                    </div>

                    {error && (
                      <div
                        id="login-error"
                        className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm text-center"
                        role="alert"
                        aria-live="polite"
                      >
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Sign In <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Quick Access Tab */}
              {activeTab === 'quick' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Quick Access</h2>
                    <p className="text-gray-400">Choose your role to get started instantly</p>
                  </div>

                  {/* Admin & Presenter */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleQuickLogin('admin')}
                      className="group relative overflow-hidden bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-6 hover:from-yellow-400/30 hover:to-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Crown className="w-6 h-6 text-black" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-white">Admin</h3>
                          <p className="text-sm text-gray-300">Full system control</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    </button>

                    <button
                      onClick={() => handleQuickLogin('presenter')}
                      className="group relative overflow-hidden bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-6 hover:from-blue-400/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-white">Presenter</h3>
                          <p className="text-sm text-gray-300">Live auction control</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    </button>
                  </div>

                  {/* Team Viewers */}
                  <div>
                    <div className="flex items-center justify-center mb-6">
                      <Users className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-400 font-medium">Team Viewers</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {mockUsers.filter(u => u.role === 'viewer').map(team => {
                        const teamData = mockTeams.find(t => t.id === team.teamId);
                        return (
                          <button
                            key={team.teamId}
                            onClick={() => handleQuickLogin('viewer', team.teamId)}
                            className="group relative overflow-hidden bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            style={{
                              background: teamData ? `linear-gradient(135deg, ${teamData.primaryColor}15, ${teamData.secondaryColor}15)` : undefined,
                              borderColor: teamData ? `${teamData.primaryColor}30` : undefined
                            }}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              {teamData && (
                                <img
                                  src={teamData.logo}
                                  alt={teamData.name}
                                  className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                                />
                              )}
                              <span className="text-xs text-gray-300 font-medium text-center">{team.teamName?.split(' ')[0]}</span>
                            </div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"
                                 style={{ backgroundColor: teamData?.primaryColor }}></div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Professional IPL Auction Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
