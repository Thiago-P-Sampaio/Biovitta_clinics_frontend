import React, { useEffect, useState } from 'react';
import './MedicoDetalhesModal.css';

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
        <h2>Detalhes do Médico</h2>
        <img src={medico.imgUrl || 'https://via.placeholder.com/150'} alt={medico.nome} className="medicoImage" />
        <p><strong>Nome:</strong> {medico.nome}</p>
        <p><strong>CRM:</strong> {medico.crm}</p>
        <p><strong>Email:</strong> {medico.email}</p>
        <p><strong>Telefone:</strong> {medico.telefone}</p>
        <p><strong>Especialidades:</strong> {especialidades.map(e => e.nome).join(', ')}</p>
        <button onClick={onClose} className="btnClose">Fechar</button>
      </div>
    </div>
  );
}
