import React from 'react';
import AppSidebar from './Sidebar';

import { Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="container">
      <AppSidebar />
      <main className="content">

        <Outlet /> {/* Renderiza Home, Pacientes, Médicos, etc */}
      </main>
    </div>
  );
}
