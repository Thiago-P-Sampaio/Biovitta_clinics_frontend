import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();

  const displayName = user?.usuario || user?.sub || '';
  const role = user?.role?.toLowerCase();

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
        Bem-vindo{displayName ? `, ${displayName}` : ''}
      </h1>
      <p style={{ marginTop: 16, color: '#666', fontSize: '1.1rem' }}>
        Use o menu lateral para acessar pacientes, consultas, médicos e relatórios.
      </p>
      <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        <AtalhoCard title="Pacientes" link="/pacientes" />
        {(role === 'admin' || role === 'medico' || role === 'paciente') && (
          <AtalhoCard title="Médicos" link="/medicos" />
        )}
        <AtalhoCard title="Consultas" link="/consultas" />
        {(role === 'admin' || role === 'medico') && (
          <AtalhoCard title="Relatórios" link="/relatorios" />
        )}
      </div>
    </div>
  );
}

function AtalhoCard({ title, link }) {
  return (
    <Link
      to={link}
      style={{
        display: 'block',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: 24,
        minWidth: 180,
        textDecoration: 'none',
        color: '#6a1b9a',
        fontWeight: 600,
        textAlign: 'center',
        transition: 'box-shadow 0.2s',
      }}
      onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)')}
      onMouseOut={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)')}
    >
      {title}
    </Link>
  );
}
