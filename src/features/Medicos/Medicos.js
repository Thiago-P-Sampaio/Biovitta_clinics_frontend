import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import CardMedico from '../../components/CardMedico';
import MedicoModal from './MedicoModal';
import MedicoDetalhesModal from './MedicoDetalhesModal';
import { useAuth } from '../../context/AuthContext';
import './Medicos.css';

export default function Medicos() {
  const { user } = useAuth();

  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchMedicos();
  }, []);

  // Permite acesso apenas para admin e medico
  if (!user || !['admin', 'medico', 'paciente'].includes(user.role)) {
    return <p>Acesso negado. Você não tem permissão para acessar esta página.</p>;
  }

  async function fetchMedicos() {
    try {
      setLoading(true);
      const response = await api.get('/api/medicos/get/all');
      setMedicos(response.data);
      setError('');
    } catch {
      setError('Erro ao carregar médicos.');
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    if (user.role !== 'admin') return; // Só admin pode adicionar
    setSelectedMedico(null);
    setIsEdit(false);
    setModalOpen(true);
  }

  function handleEdit(medico) {
    if (user.role !== 'admin') return; // Só admin pode editar
    setSelectedMedico(medico);
    setIsEdit(true);
    setModalOpen(true);
  }

  function handleView(medico) {
    setSelectedMedico(medico);
    setDetalhesModalOpen(true);
  }

  async function handleDelete(medico) {
    if (user.role !== 'admin') return; // Só admin pode excluir
    if (!window.confirm(`Deseja realmente excluir ${medico.nome}?`)) return;
    try {
      await api.delete(`/api/medicos/dell/${medico.crm}`);
      setMedicos(prev => prev.filter(m => m.crm !== medico.crm));
    } catch {
      alert('Erro ao excluir médico.');
    }
  }

  async function handleSubmit(data) {
    if (user.role !== 'admin') return; // Só admin pode salvar
    try {
      if (isEdit) {
        await api.put(`/api/medicos/edit/${data.crm}`, data);
      } else {
        await api.post('/api/usuario/medico/add', data);
      }
      fetchMedicos();
      setModalOpen(false);
      setSelectedMedico(null);
    } catch {
      alert('Erro ao salvar médico.');
    }
  }

  if (loading) return <p>Carregando médicos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="medicos-container">
      <h1>Médicos</h1>

      {/* Botão adicionar só para admin */}
      {user.role === 'admin' && (
        <button className="btn-add" onClick={handleAdd}>+ Adicionar Médico</button>
      )}

      <div className="medicos-grid">
        {medicos.map(medico => (
          <CardMedico
            key={medico.crm}
            medico={medico}
            onView={() => handleView(medico)}
            onEdit={user.role === 'admin' ? () => handleEdit(medico) : undefined}
            onDelete={user.role === 'admin' ? () => handleDelete(medico) : undefined}
          />
        ))}
      </div>

      {modalOpen && (
        <MedicoModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedMedico}
          isEdit={isEdit}
        />
      )}

      {detalhesModalOpen && selectedMedico && (
        <MedicoDetalhesModal
          isOpen={detalhesModalOpen}
          onClose={() => setDetalhesModalOpen(false)}
          medico={selectedMedico}
        />
      )}
    </div>
  );
}
