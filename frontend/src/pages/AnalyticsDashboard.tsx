import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';

interface AnalyticsData {
  totalRevenue: number;
  totalPlayersSold: number;
  priceByRole?: { [key: string]: number };
  topExpensivePlayers?: Array<{
    name: string;
    role: string;
    price: number;
  }>;
  teamStats?: { [key: string]: any };
}

const AnalyticsDashboard: React.FC = () => {
  const [overviewData, setOverviewData] = useState<AnalyticsData | null>(null);
  const [playerData, setPlayerData] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'teams'>('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const [overview, players, teams] = await Promise.all([
        apiService.get('/analytics/overview'),
        apiService.get('/analytics/players'),
        apiService.get('/analytics/teams'),
      ]);

      setOverviewData(overview.data);
      setPlayerData(players.data);
      setTeamData(teams.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">🏏 Auction Analytics</h1>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'players', label: 'Players', icon: '🏏' },
              { id: 'teams', label: 'Teams', icon: '👥' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && overviewData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value={`₹${overviewData.totalRevenue.toLocaleString()}`}
              icon="💰"
              color="green"
            />
            <MetricCard
              title="Players Sold"
              value={overviewData.totalPlayersSold.toString()}
              icon="🏏"
              color="blue"
            />
            <MetricCard
              title="Active Teams"
              value={teamData?.totalTeamsActive?.toString() || '0'}
              icon="👥"
              color="purple"
            />
            <MetricCard
              title="Avg Efficiency"
              value={`${overviewData.totalPlayersSold > 0 ? ((overviewData.totalPlayersSold / 193) * 100).toFixed(1) : 0}%`}
              icon="📈"
              color="orange"
            />
          </div>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && playerData && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Average Price by Role</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(playerData.priceByRole || {}).map(([role, avgPrice]) => (
                  <div key={role} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">{role}</div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{(avgPrice as number / 100000).toFixed(1)}L
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Top 10 Most Expensive Players</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Rank</th>
                      <th className="text-left p-2">Player</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-right p-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerData.topExpensivePlayers?.slice(0, 10).map((player: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2 font-medium">{player.name}</td>
                        <td className="p-2">{player.role}</td>
                        <td className="p-2 text-right font-bold text-green-600">
                          ₹{(player.price / 100000).toFixed(1)}L
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && teamData && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Team Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(teamData.teamStats || {}).map(([teamName, stats]: [string, any]) => (
                  <div key={teamName} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3">{teamName}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Spent:</span>
                        <span className="font-bold text-green-600">
                          ₹{(stats.totalSpent / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Players Acquired:</span>
                        <span className="font-bold">{stats.playersAcquired}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Price:</span>
                        <span className="font-bold">
                          ₹{(stats.totalSpent / stats.playersAcquired / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;