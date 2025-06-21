import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  useEffect,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { usuariosMock } from '../_mock/usuarios-mock';

/* implements para usar mock de usuario */
type Usuario = {
  email: string;
  tipo: 'CLIENTE' | 'FUNCIONARIO';
  id?: number;
  cpf?: string;
  token?: string;
};


type AuthContextType = {
  isAuthenticated: boolean
  /* implements para usar mock de usuario */
  usuario?: Usuario;
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  /* const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('auth') === 'true') */
  /* implements para usar mock de usuario */
  const [usuario, setUsuario] = useState<Usuario | undefined>(() => {
    const stored = sessionStorage.getItem('usuarioLogado');
    return stored ? JSON.parse(stored) : undefined;
  });

  const isAuthenticated = !!usuario;

  /* useEffect(() => {
    localStorage.setItem('auth', isAuthenticated ? 'true' : 'false')
  }, [isAuthenticated]) */
  /* implements para usar mock de usuario */
  useEffect(() => {
    if (usuario) {
      sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem('usuarioLogado');
    }
  }, [usuario]);

  /* const login = useCallback((email: string, password: string) => {
    if (email && password) {
      setIsAuthenticated(true)
      navigate('/tela-inicial-cliente')
    }
  }, [navigate]) */
  const login = useCallback((email: string, password: string) => {
    const user = usuariosMock.find(
      (u) => u.email === email && u.senha === password
    );
  
    if (user) {
      setUsuario({ 
        email: user.email, 
        tipo: user.tipo, 
        id: user.id, 
        cpf: user.cpf 
      });
  
      if (user.tipo === 'FUNCIONARIO') {
        navigate('/tela-inicial-funcionario');
      } else {
        navigate('/tela-inicial-cliente');
      }
    } else {
      alert('Usuário ou senha inválidos');
    }
  }, [navigate]);

  /* const logout = useCallback(() => {
    setIsAuthenticated(false)
    localStorage.removeItem('auth')
    navigate('/login')
  }, [navigate]) */
  /* implements para usar mock de usuario */
  const logout = useCallback(() => {
    setUsuario(undefined);
    sessionStorage.removeItem('usuarioLogado');
    navigate('/login');
  }, [navigate]);

  /* const contextValue = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout]
  ) */
  /* implements para usar mock de usuario */
  const contextValue = useMemo(
    () => ({ isAuthenticated, usuario, login, logout }),
    [isAuthenticated, usuario, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider')
  return context
}
