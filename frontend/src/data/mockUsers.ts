export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'presenter' | 'viewer';
  teamId?: number;
  teamName?: string;
}

export const mockUsers: User[] = [
  // Admin user
  { id: 'admin', username: 'admin', password: 'admin@123', role: 'admin' },

  // Presenter user
  { id: 'presenter', username: 'presenter', password: 'presenter@123', role: 'presenter' },

  // Team-specific viewer accounts (10 IPL Teams)
  {
    id: 'team-csk',
    username: 'csk',
    password: 'csk@123',
    role: 'viewer',
    teamId: 1,
    teamName: 'Chennai Super Kings'
  },
  {
    id: 'team-mi',
    username: 'mi',
    password: 'mi@123',
    role: 'viewer',
    teamId: 2,
    teamName: 'Mumbai Indians'
  },
  {
    id: 'team-rcb',
    username: 'rcb',
    password: 'rcb@123',
    role: 'viewer',
    teamId: 3,
    teamName: 'Royal Challengers Bangalore'
  },
  {
    id: 'team-kkr',
    username: 'kkr',
    password: 'kkr@123',
    role: 'viewer',
    teamId: 4,
    teamName: 'Kolkata Knight Riders'
  },
  {
    id: 'team-dc',
    username: 'dc',
    password: 'dc@123',
    role: 'viewer',
    teamId: 5,
    teamName: 'Delhi Capitals'
  },
  {
    id: 'team-rr',
    username: 'rr',
    password: 'rr@123',
    role: 'viewer',
    teamId: 6,
    teamName: 'Rajasthan Royals'
  },
  {
    id: 'team-pbks',
    username: 'pbks',
    password: 'pbks@123',
    role: 'viewer',
    teamId: 7,
    teamName: 'Punjab Kings'
  },
  {
    id: 'team-srh',
    username: 'srh',
    password: 'srh@123',
    role: 'viewer',
    teamId: 8,
    teamName: 'Sunrisers Hyderabad'
  },
  {
    id: 'team-gt',
    username: 'gt',
    password: 'gt@123',
    role: 'viewer',
    teamId: 9,
    teamName: 'Gujarat Titans'
  },
  {
    id: 'team-lsg',
    username: 'lsg',
    password: 'lsg@123',
    role: 'viewer',
    teamId: 10,
    teamName: 'Lucknow Super Giants'
  }
];

export default mockUsers;
