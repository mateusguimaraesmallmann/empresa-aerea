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
import { loginUsuario, TokenResponse } from 'src/api/cliente/auth.api';

// Tipo de usuário
type Usuario = {
  email: string;
  tipo: 'CLIENTE' | 'FUNCIONARIO';
  id?: number | string;
  token?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  usuario?: Usuario;
  login: (email: string, password: string) => Promise<void>;
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
      localStorage.removeItem('token'); // limpa o token ao sair
    }
  }, [usuario]);

  // Lógica de login real (via API)
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response: TokenResponse = await loginUsuario({
          login: email,
          senha: password,
        });

        // Salva o token no localStorage para o interceptor do Axios pegar
        localStorage.setItem('token', response.access_token);

        const usuarioLogado: Usuario = {
          email: response.usuario.email,
          tipo: response.tipo as 'CLIENTE' | 'FUNCIONARIO',
          id: response.usuario.id,
          token: response.access_token,
        };

        setUsuario(usuarioLogado);

        if (response.tipo === 'FUNCIONARIO') {
          navigate('/tela-inicial-funcionario');
        } else {
          navigate('/tela-inicial-cliente');
        }
      } catch (error: any) {
        alert('Usuário ou senha inválidos');
        setUsuario(undefined);
        localStorage.removeItem('token');
      }
    },
    [navigate]
  );

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
