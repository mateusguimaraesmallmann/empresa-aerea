import {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode,
  } from 'react';
  import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = useCallback((email: string, password: string) => {
    if (email && password) {
      setIsAuthenticated(true);
      navigate('/');
    }
     }, [navigate]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    navigate('/sign-in');
     }, [navigate]);


     const contextValue = useMemo(
        () => ({ isAuthenticated, login, logout }),
        [isAuthenticated, login, logout]
      );
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
  

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider');
  return context;
}
