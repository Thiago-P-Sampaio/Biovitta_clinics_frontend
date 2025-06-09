import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Não precisamos mais do useNavigate
// import api from '../services/api'; // Não precisamos mais do api aqui
import './SearchBar.css';

// A SearchBar agora apenas passa a query para o componente pai
export default function SearchBar({ onSearchChange }) { // Renomeado a prop para onSearchChange
  const [query, setQuery] = useState('');

  const handleChange = async e => {
    const value = e.target.value;
    setQuery(value);
    // Chama a função passada pelo componente pai com o valor da busca
    onSearchChange(value);
  };

  return (
    <div className="searchContainer">
      <input
        type="text"
        placeholder="Buscar..." // Placeholder mais genérico
        value={query}
        onChange={handleChange}
        className="searchInput"
      />
      {/* REMOVIDO: A div resultsGrid e toda a lógica de exibição de sugestões foram removidas daqui.
          Agora a SearchBar apenas fornece a query para o componente pai filtrar. */}
    </div>
  );
}