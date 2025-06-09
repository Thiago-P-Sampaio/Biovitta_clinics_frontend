import React from 'react';
import './CardPaciente.css';

export default function CardPaciente({ paciente, onView, onEdit, onDelete }) {
  return (
    <div
      className="cardPaciente"
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyPress={e => e.key === 'Enter' && onView()}
    >
      <img
        src={paciente.imgUrl || 'https://via.placeholder.com/150'}
        alt={`Foto de ${paciente.nome}`}
      />
      <h3>{paciente.nome}</h3>
      <p>{paciente.email}</p>
      <p>Telefone: {paciente.telefone}</p>
      <p>Nascimento: {new Date(paciente.dataNascimento).toLocaleDateString()}</p>
      <div className="actions" onClick={e => e.stopPropagation()}>
        {onEdit && (
          <button onClick={() => onEdit(paciente)} className="editButton" aria-label={`Editar paciente ${paciente.nome}`}>
            Editar
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(paciente)} className="deleteButton" aria-label={`Excluir paciente ${paciente.nome}`}>
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
