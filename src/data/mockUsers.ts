export interface User {
  id: number;
  username: string;
  password: string;
  role: 'Admin' | 'Presenter' | 'Viewer';
}

export const mockUsers: User[] = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin' },
  { id: 2, username: 'presenter', password: 'present123', role: 'Presenter' },
  { id: 3, username: 'viewer', password: 'view123', role: 'Viewer' },
];

export default mockUsers;
