import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './SearchBar.css'; // CSS global

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleChange = async e => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      onSearch([]);
      return;
    }

    try {
      const [pacientesResp, medicosResp] = await Promise.all([
        api.get(`/api/usuario/paciente/busca?nome=${value}`),
        api.get(`/api/usuario/medico/busca?nome=${value}`)
      ]);

      const pacientes = (pacientesResp.data || []).map(p => ({
        ...p,
        tipo: 'Paciente',
        key: `paciente-${p.pacienteId}`
      }));

      const medicos = (medicosResp.data || []).map(m => ({
        ...m,
        tipo: 'Médico',
        key: `medico-${m.crm}`
      }));

      const combinedResults = [...pacientes, ...medicos];
      setResults(combinedResults);
      onSearch(combinedResults);
    } catch {
      setResults([]);
      onSearch([]);
    }
  };

  const handleClick = item => {
    if (item.tipo === 'Paciente') {
      navigate(`/pacientes/${item.pacienteId}`);
    } else if (item.tipo === 'Médico') {
      navigate(`/medicos/${item.crm}`);
    }
    setQuery('');
    setResults([]);
  };

  return (
    <div className="searchContainer">
      <input
        type="text"
        placeholder="Buscar pacientes ou médicos..."
        value={query}
        onChange={handleChange}
        className="searchInput"
      />
      {results.length > 0 && (
        <div className="resultsGrid">
          {results.map(item => (
            <div
              key={item.key}
              className="card"
              onClick={() => handleClick(item)}
              role="button"
              tabIndex={0}
              onKeyPress={e => (e.key === 'Enter' ? handleClick(item) : null)}
            >
              <img
                src={item.imgUrl || 'https://via.placeholder.com/150'}
                alt={item.nome}
                className="cardImage"
              />
              <div className="cardContent">
                <h3>{item.nome}</h3>
                <p>{item.tipo}</p>
                <p>{item.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
