import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Removido Outlet
import { useAuth, AuthProvider } from './context/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Login from './features/Auth/Login';
import Register from './features/Auth/Register';
import Home from './pages/Home';
import Pacientes from './features/Pacientes/Pacientes';
import Medicos from './features/Medicos/Medicos';
import Consultas from './features/Consultas/Consultas';
import Relatorios from './features/Relatorios/Relatorios';

import Layout from './components/Layout'; // Layout é onde o Outlet deve ser usado

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  // Se não há token, redireciona para o login
  if (!token) return <Navigate to="/login" replace />;

  return children;
}

function RoleRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  // Se não há usuário logado, redireciona para o login
  if (!user) return <Navigate to="/login" replace />;

  // Se há usuário, redireciona para a home
  return <Navigate to="/home" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirecionamento inicial: se o usuário já estiver logado, vai para a home */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Rotas protegidas com layout. O componente Layout deve conter o <Outlet /> */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="home" element={<Home />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="medicos" element={<Medicos />} />
            <Route path="consultas" element={<Consultas />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>

          {/* Página 404 para rotas não encontradas */}
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
