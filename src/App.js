import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';

import Login from './features/Auth/Login';
import Register from './features/Auth/Register';
import Home from './pages/Home';
import Pacientes from './features/Pacientes/Pacientes';
import Medicos from './features/Medicos/Medicos';
import Consultas from './features/Consultas/Consultas';
import Relatorios from './features/Relatorios/Relatorios';

import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { token, user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!token) return <Navigate to="/login" replace />;

  return children;
}

function RoleRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/login" replace />;

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

          {/* Redirecionamento inicial */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Rotas protegidas com layout */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="home" element={<Home />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="medicos" element={<Medicos />} />
            <Route path="consultas" element={<Consultas />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
