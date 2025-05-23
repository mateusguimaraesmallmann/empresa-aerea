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

type AuthContextType = {
  isAuthenticated: boolean
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('auth') === 'true')

  useEffect(() => {
    localStorage.setItem('auth', isAuthenticated ? 'true' : 'false')
  }, [isAuthenticated])

  const login = useCallback((email: string, password: string) => {
    if (email && password) {
      setIsAuthenticated(true)
      navigate('/tela-inicial-cliente')
    }
  }, [navigate])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    localStorage.removeItem('auth')
    navigate('/login')
  }, [navigate])

  const contextValue = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout]
  )

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
