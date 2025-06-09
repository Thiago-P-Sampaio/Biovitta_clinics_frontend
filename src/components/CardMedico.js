import React from 'react';
import './CardMedico.css';

export default function CardMedico({ medico, onView, onEdit, onDelete }) {
  return (
    <div
      className="cardMedico"
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyPress={e => e.key === 'Enter' && onView()}
    >
      <img
        src={medico.imgUrl || 'https://via.placeholder.com/150'}
        alt={`Foto de ${medico.nome}`}
      />
      <h3>{medico.nome}</h3>
      <p>{medico.email}</p>
      <p>Telefone: {medico.telefone}</p>
      <p>Especialidades: {medico.especialidades?.map(e => e.nome).join(', ')}</p>

      <div className="actions" onClick={e => e.stopPropagation()}>
        {/* Renderiza botão Editar somente se onEdit for função */}
        {typeof onEdit === 'function' && (
          <button
            onClick={() => onEdit(medico)}
            className="editButton"
            aria-label={`Editar médico ${medico.nome}`}
          >
            Editar
          </button>
        )}

        {/* Renderiza botão Excluir somente se onDelete for função */}
        {typeof onDelete === 'function' && (
          <button
            onClick={() => onDelete(medico)}
            className="deleteButton"
            aria-label={`Excluir médico ${medico.nome}`}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
