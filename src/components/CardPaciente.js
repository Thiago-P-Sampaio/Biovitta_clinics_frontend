import React from 'react';
import './CardPaciente.css';
// Garanta que o Font Awesome esteja importado globalmente (ex: App.js ou index.js)
// import '@fortawesome/fontawesome-free/css/all.min.css';

export default function CardPaciente({ paciente, onView, onEdit, onDelete }) {
  // Formata a data de nascimento para exibição
  const formattedDataNascimento = paciente.dataNascimento
    ? new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')
    : 'N/A';

  return (
    <div
      className="cardPaciente"
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyPress={e => e.key === 'Enter' && onView()}
    >
      {/* NOVO: Container para a imagem que vai de ponta a ponta */}
      <div className="cardPaciente-image-container">
        <img
          src={paciente.imgUrl || 'https://via.placeholder.com/150/6a1b9a/ffffff?text=Paciente'} // Placeholder com cor relevante
          alt={`Foto de ${paciente.nome}`}
          className="cardPaciente-img" // Classe específica para a imagem
        />
      </div>

      {/* INFORMAÇÕES DO PACIENTE */}
      <h3 className="cardPaciente-name">{paciente.nome}</h3> {/* Classe para o nome */}
      <p className="cardPaciente-detail">
        <i className="fas fa-envelope cardPaciente-icon"></i> {/* Ícone de e-mail */}
        {paciente.email}
      </p>
      <p className="cardPaciente-detail">
        <i className="fas fa-phone cardPaciente-icon"></i> {/* Ícone de telefone */}
        Telefone: {paciente.telefone}
      </p>
      <p className="cardPaciente-detail">
        <i className="fas fa-calendar-alt cardPaciente-icon"></i> {/* Ícone de calendário */}
        Nascimento: {formattedDataNascimento}
      </p>

      {/* BOTÕES DE AÇÃO */}
      <div className="cardPaciente-actions" onClick={e => e.stopPropagation()}>
        {onEdit && ( // Apenas renderiza se onEdit for passado
          <button
            onClick={() => onEdit(paciente)}
            className="cardPaciente-button cardPaciente-editButton"
            aria-label={`Editar paciente ${paciente.nome}`}
          >
            Editar
          </button>
        )}
        {onDelete && ( // Apenas renderiza se onDelete for passado
          <button
            onClick={() => onDelete(paciente)}
            className="cardPaciente-button cardPaciente-deleteButton"
            aria-label={`Excluir paciente ${paciente.nome}`}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}