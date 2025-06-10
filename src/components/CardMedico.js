import React from 'react';
import './CardMedico.css';
// Garanta que o Font Awesome esteja importado globalmente (ex: App.js ou index.js)
// import '@fortawesome/fontawesome-free/css/all.min.css';

export default function CardMedico({ medico, onView, onEdit, onDelete }) {
  // A propriedade medico.especialidades já é uma string, então exibimos ela diretamente.
  // Não precisamos de .map, slice ou join.
  const displayedEspecialidades = medico.especialidades || 'Nenhuma';

  // Não precisamos mais de `remainingEspecialidadesCount` pois não há mais uma lista.

  return (
    <div
      className="cardMedico"
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyPress={e => e.key === 'Enter' && onView()}
    >
      {/* NOVO: Container para a imagem que vai de ponta a ponta */}
      <div className="cardMedico-image-container">
        <img
          src={medico.imgUrl || 'https://via.placeholder.com/150/6a1b9a/ffffff?text=Médico'}
          alt={`Foto de ${medico.nome}`}
          className="cardMedico-img"
        />
      </div>

      {/* INFORMAÇÕES DO MÉDICO */}
      <h3 className="cardMedico-name">{medico.nome}</h3>
      <p className="cardMedico-detail">
        <i className="fas fa-envelope cardMedico-icon"></i>
        {medico.email}
      </p>
      <p className="cardMedico-detail">
        <i className="fas fa-phone cardMedico-icon"></i>
        Telefone: {medico.telefone}
      </p>
      {/* Exibindo a string de especialidades diretamente */}
      <p className="cardMedico-specialties">
        <i className="fas fa-tags cardMedico-icon"></i>
        <span className="cardMedico-label">Especialidades:</span> {displayedEspecialidades}
      </p>

      {/* BOTÕES DE AÇÃO */}
      <div className="cardMedico-actions" onClick={e => e.stopPropagation()}>
        {typeof onEdit === 'function' && (
          <button
            onClick={() => onEdit(medico)}
            className="cardMedico-button cardMedico-editButton"
            aria-label={`Editar médico ${medico.nome}`}
          >
            Editar
          </button>
        )}

        {typeof onDelete === 'function' && (
          <button
            onClick={() => onDelete(medico)}
            className="cardMedico-button cardMedico-deleteButton"
            aria-label={`Excluir médico ${medico.nome}`}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}