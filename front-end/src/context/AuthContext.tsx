import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from 'src/api/auth.api';

type Usuario = {
  email: string;
  nome: string;
  cpf: string;
  tipo: 'CLIENTE' | 'FUNCIONARIO';
};

type AuthContextType = {
  isAuthenticated: boolean;
  usuario?: Usuario;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario | undefined>(() => {
    const stored = sessionStorage.getItem('usuarioLogado');
    return stored ? JSON.parse(stored) : undefined;
  });

  const isAuthenticated = !!usuario;

  useEffect(() => {
    if (usuario) {
      sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem('usuarioLogado');
      localStorage.removeItem('token');
    }
  }, [usuario]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const tokenData = await loginUsuario({ login: email, password });

      // Preenche manualmente o email vindo das credenciais
      setUsuario({
        email,
        nome: tokenData.usuario.nome,
        cpf: tokenData.usuario.cpf,
        tipo: tokenData.tipo,
      });

      localStorage.setItem('token', tokenData.access_token);

      if (tokenData.tipo === 'FUNCIONARIO') {
        navigate('/tela-inicial-funcionario');
      } else {
        navigate('/tela-inicial-cliente');
      }
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setUsuario(undefined);
    sessionStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const contextValue = useMemo(
    () => ({ isAuthenticated, usuario, login, logout }),
    [isAuthenticated, usuario, login, logout]
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


