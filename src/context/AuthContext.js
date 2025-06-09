import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importação nomeada correta
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      setLoading(true);
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Decodifica o token para extrair o usuário (email) do campo 'sub'
          const decodedToken = jwtDecode(token);
          const usuario = decodedToken.sub;

          // Busca os dados completos do usuário, incluindo role
          const response = await api.get(`/auth/usuario/${encodeURIComponent(usuario)}`);
          const userData = {
            ...response.data,
            role: response.data.role?.toLowerCase() || '',
          };
          setUser(userData);

          console.log('Dados do usuário obtidos da API:', userData);
        } catch (error) {
          console.error('Erro ao validar token ou buscar dados do usuário:', error);
          setUser(null);
          setToken('');
          localStorage.removeItem('token');
        }
      } else {
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      }
      setLoading(false);
    }
    verifyToken();
  }, [token]);

  async function login(usuario, senha) {
    try {
      const response = await api.post('/auth/login', { usuario, senha });
      const { token: jwtToken } = response.data;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      navigate('/home');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro no login');
    }
  }

  async function logout() {
    try {
      setToken('');
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setToken('');
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
