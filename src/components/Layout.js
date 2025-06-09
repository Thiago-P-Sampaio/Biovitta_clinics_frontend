import React from 'react';
import AppSidebar from './Sidebar';
import SearchBar from './SearchBar';
import { Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="container">
      <AppSidebar />
      <main className="content">
        <SearchBar />
        <Outlet /> {/* Renderiza Home, Pacientes, Médicos, etc */}
      </main>
    </div>
  );
}
