export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'presenter';
}

export const mockUsers: User[] = [
  // Admin user
  { id: 'admin', username: 'admin', password: 'admin123', role: 'admin' },

  // Presenter user
  { id: 'presenter', username: 'presenter', password: 'presenter123', role: 'presenter' }
];

export default mockUsers;
