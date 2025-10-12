import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'Admin' | 'Presenter' | 'Viewer' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  username: string;
  setUsername: (username: string) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [username, setUsername] = useState<string>('');

  const logout = () => {
    setRole(null);
    setUsername('');
  };

  return (
    <RoleContext.Provider value={{ role, setRole, username, setUsername, logout }}>
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
