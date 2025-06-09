import React from 'react';
import './PacienteDetalhesModal.css';

export default function PacienteDetalhesModal({ isOpen, onClose, paciente }) {
  if (!isOpen || !paciente) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Detalhes do Paciente</h2>
        <img
          src={paciente.imgUrl || 'https://via.placeholder.com/150'}
          alt={paciente.nome}
          className="pacienteImage"
        />
        <p><strong>Nome:</strong> {paciente.nome}</p>
        <p><strong>Email:</strong> {paciente.email}</p>
        <p><strong>Telefone:</strong> {paciente.telefone}</p>
        <p><strong>Data de Nascimento:</strong> {new Date(paciente.dataNascimento).toLocaleDateString()}</p>
        <button onClick={onClose} className="btnClose">Fechar</button>
      </div>
    </div>
  );
}
