import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Ou um loading simples
  }

  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    logout();
  };

  const canAccessMedicos = role === 'admin' || role === 'medico' || role === 'paciente';
  const canAccessRelatorios = role === 'admin' || role === 'medico'; // Pacientes NÃO acessam relatórios

  return (
    <Sidebar
      width="250px"
      rootStyles={{
        [`.pro-sidebar-inner`]: {
          backgroundColor: '#6a1b9a',
          color: '#fff',
          height: '100vh',
        },
        [`.pro-menu-item.active`]: {
          backgroundColor: '#7c4dff',
        },
        [`.pro-menu-item:hover`]: {
          backgroundColor: '#8e5eff',
        },
      }}
    >
      <Menu>
        <MenuItem
          active={location.pathname === '/home'}
          component={<Link to="/home" />}
        >
          Home
        </MenuItem>

        <MenuItem
          active={location.pathname === '/pacientes'}
          component={<Link to="/pacientes" />}
        >
          Pacientes
        </MenuItem>

        {canAccessMedicos && (
          <MenuItem
            active={location.pathname === '/medicos'}
            component={<Link to="/medicos" />}
          >
            Médicos
          </MenuItem>
        )}

        <MenuItem
          active={location.pathname === '/consultas'}
          component={<Link to="/consultas" />}
        >
          Consultas
        </MenuItem>

        {canAccessRelatorios && (
          <MenuItem
            active={location.pathname === '/relatorios'}
            component={<Link to="/relatorios" />}
          >
            Relatórios
          </MenuItem>
        )}

        <MenuItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          Sair
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
