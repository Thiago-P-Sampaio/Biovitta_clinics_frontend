import React from 'react'; // Não precisa mais de useEffect e useState aqui
import './MedicoDetalhesModal.css';

export default function MedicoDetalhesModal({ isOpen, onClose, medico }) {
  // Não precisamos mais do estado `especialidades` e do useEffect para o fetch.
  // A propriedade `medico.especialidades` já será uma string.

  if (!isOpen) return null;

  // Garante que medico.especialidades é uma string ou uma string vazia para exibição.
  const especialidadesExibicao = medico.especialidades ? medico.especialidades : 'Nenhuma';

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="modalCloseButton" onClick={onClose} aria-label="Fechar">
          <i className="fas fa-times"></i> {/* Ícone de fechar */}
        </button>

        <h2 className="modalTitle">Detalhes do Médico</h2>
        
        <div className="medicoDetailsHeader">
          <img
            src={medico.imgUrl || 'https://via.placeholder.com/150/6a1b9a/ffffff?text=Médico'}
            alt={medico.nome}
            className="medicoDetailsImage"
          />
          <h3 className="medicoDetailsName">{medico.nome}</h3>
        </div>

        <div className="medicoDetailsBody">
          <p className="medicoDetailItem">
            <strong>CRM:</strong> {medico.crm}
          </p>
          <p className="medicoDetailItem">
            <i className="fas fa-envelope medicoDetailIcon"></i> {/* Ícone de e-mail */}
            <strong>Email:</strong> {medico.email}
          </p>
          <p className="medicoDetailItem">
            <i className="fas fa-phone medicoDetailIcon"></i> {/* Ícone de telefone */}
            <strong>Telefone:</strong> {medico.telefone}
          </p>
          <p className="medicoDetailItem">
            <i className="fas fa-tags medicoDetailIcon"></i> {/* Ícone de tags/especialidades */}
            <strong>Especialidades:</strong> {especialidadesExibicao} {/* Exibe a string diretamente */}
          </p>
        </div>

        <div className="modalActions">
          <button onClick={onClose} className="btnConfirmClose">Fechar</button>
        </div>
      </div>
    </div>
  );
}