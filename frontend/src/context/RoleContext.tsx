import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../data/mockUsers';

interface RoleContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  username: string;
  role: 'admin' | 'presenter' | 'viewer' | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <RoleContext.Provider value={{
      user,
      login,
      logout,
      username: user?.username || '',
      role: user?.role || null
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
