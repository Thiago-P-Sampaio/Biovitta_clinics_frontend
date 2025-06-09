import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Pacientes.css';
import PacienteModal from './PacienteModal';
import PacienteDetalhesModal from './PacienteDetalhesModal.js';
import CardPaciente from '../../components/CardPaciente';
import { useAuth } from '../../context/AuthContext';

export default function Pacientes() {
  const { user } = useAuth();

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchPacientes();
  }, []);

  async function fetchPacientes() {
    try {
      setLoading(true);
      if (user.role === 'paciente') {
        // Paciente só vê ele mesmo
        const response = await api.get(`/auth/buscar/${encodeURIComponent(user.usuario)}`);
        setPacientes([response.data]);
      } else {
        // Admin e médico veem todos
        const response = await api.get('/api/usuario/paciente/get/all');
        setPacientes(response.data);
      }
      setError('');
    } catch {
      setError('Erro ao carregar pacientes.');
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    if (user.role !== 'admin') return; // Apenas admin pode adicionar
    setSelectedPaciente(null);
    setIsEdit(false);
    setModalOpen(true);
  }

  function handleEdit(paciente) {
    if (user.role !== 'admin') return; // Apenas admin pode editar
    setSelectedPaciente(paciente);
    setIsEdit(true);
    setModalOpen(true);
  }

  function handleView(paciente) {
    setSelectedPaciente(paciente);
    setDetalhesModalOpen(true);
  }

  async function handleDelete(paciente) {
    if (user.role !== 'admin') return; // Apenas admin pode excluir
    if (!window.confirm(`Deseja realmente excluir ${paciente.nome}?`)) return;
    try {
      await api.delete(`/api/usuario/paciente/dell/${paciente.pacienteId || paciente.id}`);
      setPacientes(prev => prev.filter(p => p.pacienteId !== paciente.pacienteId));
    } catch {
      alert('Erro ao excluir paciente.');
    }
  }

  async function handleSubmit(data) {
    if (user.role !== 'admin') return; // Apenas admin pode salvar
    try {
      if (isEdit) {
        await api.put(`/api/usuario/paciente/edit/${selectedPaciente.pacienteId || selectedPaciente.id}`, data);
      } else {
        await api.post('/api/usuario/paciente/add', data);
      }
      fetchPacientes();
      setModalOpen(false);
      setSelectedPaciente(null);
    } catch {
      alert('Erro ao salvar paciente.');
    }
  }

  if (loading) return <p>Carregando pacientes...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="pacientes-container">
      <h1>Pacientes</h1>

      {/* Botão adicionar só para admin */}
      {user.role === 'admin' && (
        <button className="btn-add" onClick={handleAdd}>
          + Adicionar Paciente
        </button>
      )}

      <div className="pacientes-grid">
        {pacientes.map(paciente => (
          <CardPaciente
            key={paciente.pacienteId || paciente.id}
            paciente={paciente}
            onEdit={user.role === 'admin' ? () => handleEdit(paciente) : undefined}
            onDelete={user.role === 'admin' ? () => handleDelete(paciente) : undefined}
            onView={() => handleView(paciente)}
          />
        ))}
      </div>

      <PacienteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPaciente(null);
        }}
        initialValues={selectedPaciente}
        onSubmit={handleSubmit}
        isEdit={isEdit}
      />

      {detalhesModalOpen && selectedPaciente && (
        <PacienteDetalhesModal
          isOpen={detalhesModalOpen}
          onClose={() => setDetalhesModalOpen(false)}
          paciente={selectedPaciente}
        />
      )}
    </div>
  );
}
