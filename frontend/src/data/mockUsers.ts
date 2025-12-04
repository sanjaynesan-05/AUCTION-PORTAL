export interface User {
  id: string;
  username: string;
  password?: string; // Should NOT be exposed in frontend in production
  role: 'admin' | 'presenter' | 'viewer';
  teamId?: number;
  teamName?: string;
}

// IMPORTANT: Mock credentials are for development/testing ONLY
// Do NOT hardcode credentials in production code
// Load from environment variables or secure credential management system

export const mockUsers: User[] = [
  // Admin user - CREDENTIALS MUST BE PROVIDED SECURELY
  { id: 'admin', username: 'admin', role: 'admin' },

  // Presenter user - CREDENTIALS MUST BE PROVIDED SECURELY
  { id: 'presenter', username: 'presenter', role: 'presenter' },

  // Team-specific viewer accounts (10 IPL Teams)
  // CREDENTIALS MUST BE PROVIDED SECURELY IN PRODUCTION
  {
    id: 'team-csk',
    username: 'csk',
    role: 'viewer',
    teamId: 1,
    teamName: 'Chennai Super Kings'
  },
  {
    id: 'team-mi',
    username: 'mi',
    role: 'viewer',
    teamId: 2,
    teamName: 'Mumbai Indians'
  },
  {
    id: 'team-rcb',
    username: 'rcb',
    role: 'viewer',
    teamId: 3,
    teamName: 'Royal Challengers Bangalore'
  },
  {
    id: 'team-kkr',
    username: 'kkr',
    role: 'viewer',
    teamId: 4,
    teamName: 'Kolkata Knight Riders'
  },
  {
    id: 'team-dc',
    username: 'dc',
    role: 'viewer',
    teamId: 5,
    teamName: 'Delhi Capitals'
  },
  {
    id: 'team-rr',
    username: 'rr',
    role: 'viewer',
    teamId: 6,
    teamName: 'Rajasthan Royals'
  },
  {
    id: 'team-pbks',
    username: 'pbks',
    role: 'viewer',
    teamId: 7,
    teamName: 'Punjab Kings'
  },
  {
    id: 'team-srh',
    username: 'srh',
    role: 'viewer',
    teamId: 8,
    teamName: 'Sunrisers Hyderabad'
  },
  {
    id: 'team-gt',
    username: 'gt',
    role: 'viewer',
    teamId: 9,
    teamName: 'Gujarat Titans'
  },
  {
    id: 'team-lsg',
    username: 'lsg',
    role: 'viewer',
    teamId: 10,
    teamName: 'Lucknow Super Giants'
  }
];

export default mockUsers;
