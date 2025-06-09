import React, { useEffect, useState } from 'react';
import './MedicoDetalhesModal.css';
// Garanta que o Font Awesome esteja importado globalmente no seu projeto (ex: App.js ou index.js)
// import '@fortawesome/fontawesome-free/css/all.min.css';

export default function MedicoDetalhesModal({ isOpen, onClose, medico }) {
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    async function fetchEspecialidades() {
      try {
        const res = await fetch(`http://localhost:8080/biovitta/api/medicos/${medico.crm}/especialidades`);
        const data = await res.json();
        setEspecialidades(Array.isArray(data.especialidadesLista) ? data.especialidadesLista : []);
      } catch (error) {
        console.error('Erro ao carregar especialidades do médico', error);
        setEspecialidades([]);
      }
    }
    if (medico) fetchEspecialidades();
  }, [medico]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="modalCloseButton" onClick={onClose} aria-label="Fechar">
          <i className="fas fa-times"></i> {/* Ícone de fechar */}
        </button>

        <h2 className="modalTitle">Detalhes do Médico</h2>
        
        <div className="medicoDetailsHeader"> {/* Novo div para centralizar imagem e nome */}
          <img
            src={medico.imgUrl || 'https://via.placeholder.com/150/6a1b9a/ffffff?text=Médico'}
            alt={medico.nome}
            className="medicoDetailsImage" // Nova classe para a imagem
          />
          <h3 className="medicoDetailsName">{medico.nome}</h3> {/* Nova classe para o nome */}
        </div>

        <div className="medicoDetailsBody"> {/* Novo div para o corpo dos detalhes */}
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
            <strong>Especialidades:</strong> {especialidades.map(e => e.nome).join(', ') || 'Nenhuma'}
          </p>
        </div>

        <div className="modalActions">
          <button onClick={onClose} className="btnConfirmClose">Fechar</button> {/* Renomeei a classe do botão */}
        </div>
      </div>
    </div>
  );
}