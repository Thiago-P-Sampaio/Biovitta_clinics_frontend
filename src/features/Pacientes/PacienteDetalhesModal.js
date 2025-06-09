import React from 'react';
import './PacienteDetalhesModal.css';
// Garanta que o Font Awesome esteja importado globalmente (ex: App.js ou index.js)
// import '@fortawesome/fontawesome-free/css/all.min.css';

export default function PacienteDetalhesModal({ isOpen, onClose, paciente }) {
  if (!isOpen || !paciente) return null;

  // Formata a data de nascimento para exibição
  const formattedDataNascimento = paciente.dataNascimento
    ? new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')
    : 'N/A';

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="modalCloseButton" onClick={onClose} aria-label="Fechar">
          <i className="fas fa-times"></i> {/* Ícone de fechar */}
        </button>

        <h2 className="modalTitle">Detalhes do Paciente</h2>
        
        <div className="pacienteDetailsHeader"> {/* Novo div para centralizar imagem e nome */}
          <img
            src={paciente.imgUrl || 'https://via.placeholder.com/150/6a1b9a/ffffff?text=Paciente'}
            alt={paciente.nome}
            className="pacienteDetailsImage" // Nova classe para a imagem
          />
          <h3 className="pacienteDetailsName">{paciente.nome}</h3> {/* Nova classe para o nome */}
        </div>

        <div className="pacienteDetailsBody"> {/* Novo div para o corpo dos detalhes */}
          <p className="pacienteDetailItem">
            <strong>ID:</strong> {paciente.pacienteId || paciente.id}
          </p>
          <p className="pacienteDetailItem">
            <i className="fas fa-envelope pacienteDetailIcon"></i> {/* Ícone de e-mail */}
            <strong>Email:</strong> {paciente.email}
          </p>
          <p className="pacienteDetailItem">
            <i className="fas fa-phone pacienteDetailIcon"></i> {/* Ícone de telefone */}
            <strong>Telefone:</strong> {paciente.telefone}
          </p>
          <p className="pacienteDetailItem">
            <i className="fas fa-calendar-alt pacienteDetailIcon"></i> {/* Ícone de calendário */}
            <strong>Nascimento:</strong> {formattedDataNascimento}
          </p>
        </div>

        <div className="modalActions">
          <button onClick={onClose} className="btnConfirmClose">Fechar</button> {/* Renomeei a classe do botão */}
        </div>
      </div>
    </div>
  );
}