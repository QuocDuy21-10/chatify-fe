export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  online?: boolean;
  lastSeen?: Date | string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}
