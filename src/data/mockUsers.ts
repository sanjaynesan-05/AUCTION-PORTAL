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
  { id: 'admin', username: 'admin', password: 'admin123', role: 'admin' },

  // Presenter user
  { id: 'presenter', username: 'presenter', password: 'presenter123', role: 'presenter' },

  // Team-specific viewer accounts
  {
    id: 'viewer-csk',
    username: 'csk_viewer',
    password: 'csk@2024',
    role: 'viewer',
    teamId: 1,
    teamName: 'Chennai Super Kings'
  },
  {
    id: 'viewer-mi',
    username: 'mi_viewer',
    password: 'mi@2024',
    role: 'viewer',
    teamId: 2,
    teamName: 'Mumbai Indians'
  },
  {
    id: 'viewer-rcb',
    username: 'rcb_viewer',
    password: 'rcb@2024',
    role: 'viewer',
    teamId: 3,
    teamName: 'Royal Challengers Bangalore'
  },
  {
    id: 'viewer-kkr',
    username: 'kkr_viewer',
    password: 'kkr@2024',
    role: 'viewer',
    teamId: 4,
    teamName: 'Kolkata Knight Riders'
  },
  {
    id: 'viewer-dc',
    username: 'dc_viewer',
    password: 'dc@2024',
    role: 'viewer',
    teamId: 5,
    teamName: 'Delhi Capitals'
  },
  {
    id: 'viewer-rr',
    username: 'rr_viewer',
    password: 'rr@2024',
    role: 'viewer',
    teamId: 6,
    teamName: 'Rajasthan Royals'
  },
  {
    id: 'viewer-pbks',
    username: 'pbks_viewer',
    password: 'pbks@2024',
    role: 'viewer',
    teamId: 7,
    teamName: 'Punjab Kings'
  },
  {
    id: 'viewer-srh',
    username: 'srh_viewer',
    password: 'srh@2024',
    role: 'viewer',
    teamId: 8,
    teamName: 'Sunrisers Hyderabad'
  },
  {
    id: 'viewer-gt',
    username: 'gt_viewer',
    password: 'gt@2024',
    role: 'viewer',
    teamId: 9,
    teamName: 'Gujarat Titans'
  },
  {
    id: 'viewer-lsg',
    username: 'lsg_viewer',
    password: 'lsg@2024',
    role: 'viewer',
    teamId: 10,
    teamName: 'Lucknow Super Giants'
  }
];

export default mockUsers;
