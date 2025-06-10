import React, { useEffect, useState, useCallback } from 'react'; // Importe useCallback
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ConsultaModal from './ConsultaModal.js';
import './Consultas.css';

export default function Consultas() {
  const { user } = useAuth();

  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [nomePaciente, setNomePaciente] = useState(null);

  // Normaliza strings para comparação segura
  const normalizeString = useCallback((str) => {
    return str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() || '';
  }, []);

  // Função para buscar médicos
  const fetchMedicos = useCallback(async () => {
    try {
      const response = await api.get('/api/medicos/get/all');
      setMedicos(response.data);
    } catch (error) {
      console.error('Erro ao carregar médicos', error);
    }
  }, []); // Sem dependências, pois não usa variáveis do escopo

  // Função para buscar pacientes
  const fetchPacientes = useCallback(async () => {
    try {
      const response = await api.get('/api/usuario/paciente/get/all');
      setPacientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes', error);
    }
  }, []); // Sem dependências

  // Função para buscar o nome do paciente logado
  const fetchPacienteNome = useCallback(async () => {
    if (user.role === 'paciente') {
      try {
        const response = await api.get(`/auth/buscar/${encodeURIComponent(user.usuario)}`);
        setNomePaciente(response.data.nome);
      } catch (error) {
        console.error('Erro ao buscar nome do paciente:', error);
        setNomePaciente(null);
      }
    } else {
      setNomePaciente(null);
    }
  }, [user]); // Depende de 'user'

  // Função para buscar consultas
  const fetchConsultas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/consulta/get/all');
      let dados = response.data;

      if (user.role === 'paciente' && nomePaciente) {
        const nomePacienteNormalizado = normalizeString(nomePaciente);
        dados = dados.filter(c => normalizeString(c.paciente) === nomePacienteNormalizado);
      } else if (user.role === 'medico' && user.medicoId) {
        const crmMedicoNormalizado = normalizeString(user.medicoId);
        dados = dados.filter(c => normalizeString(c.medicoId) === crmMedicoNormalizado);
      }

      setConsultas(dados);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      setError('Erro ao carregar consultas.');
    } finally {
      setLoading(false);
    }
  }, [user, nomePaciente, normalizeString]); // Depende de 'user', 'nomePaciente' e 'normalizeString'

  // Efeito para buscar dados iniciais (médicos, pacientes, nome do paciente logado)
  useEffect(() => {
    fetchMedicos();
    if (user.role === 'admin' || user.role === 'medico') {
      fetchPacientes();
    }
    fetchPacienteNome(); // Linha 34:6
  }, [user.role, fetchMedicos, fetchPacientes, fetchPacienteNome]); // Dependências: user.role e as funções memoizadas

  // Efeito para buscar consultas (roda após nomePaciente ser definido ou role mudar)
  useEffect(() => {
    if (user.role !== 'paciente' || nomePaciente) {
      fetchConsultas(); // Linha 42:6
    }
  }, [nomePaciente, user.role, fetchConsultas]); // Dependências: nomePaciente, user.role e a função memoizada

  function handleAdd() {
    setSelectedConsulta(null);
    setIsEdit(false);
    setModalOpen(true);
  }

  function handleEdit(consulta) {
    setSelectedConsulta(consulta);
    setIsEdit(true);
    setModalOpen(true);
  }

  async function handleDelete(consulta) {
    if (!window.confirm(`Deseja realmente excluir a consulta nº ${consulta.consultaId}?`)) return;
    try {
      await api.delete(`/api/consulta/dell/${consulta.consultaId}`);
      setConsultas(prev => prev.filter(c => c.consultaId !== consulta.consultaId));
      alert('Consulta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir consulta:', error);
      alert('Erro ao excluir consulta.');
    }
  }

  async function handleSubmit(data) {
    try {
      const dataToSend = {
        dataConsulta: data.dataConsulta,
        medicoId: data.medicoId,
        pacienteId: user.role === 'paciente' ? user.pacienteId : data.pacienteId,
      };

      console.log("Dados da consulta a enviar:", dataToSend);

      if (isEdit) {
        dataToSend.consultaId = selectedConsulta.consultaId;
        await api.put(`/api/consulta/edit/${dataToSend.consultaId}`, dataToSend);
        alert('Consulta atualizada com sucesso!');
      } else {
        await api.post('/api/consulta/add', dataToSend);
        alert('Consulta adicionada com sucesso!');
      }
      fetchConsultas();
      setModalOpen(false);
      setSelectedConsulta(null);
    } catch (error) {
      console.error('Erro ao salvar consulta:', error.response?.data || error.message || error);
      alert('Erro ao salvar consulta.');
    }
  }

  if (loading) return <p>Carregando consultas...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="consultas-container">
      <h1>Consultas</h1>
      <button className="btn-add" onClick={handleAdd}>+ Adicionar Consulta</button>

      <table className="consultas-table">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data da Consulta</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {consultas.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma consulta encontrada.</td>
            </tr>
          ) : (
            consultas.map(consulta => (
              <tr key={consulta.consultaId}>
                <td>{consulta.consultaId}</td>
                <td>{consulta.paciente}</td>
                <td>{consulta.medico}</td>
                <td>{new Date(consulta.dataConsulta).toLocaleString()}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(consulta)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(consulta)}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalOpen && (
        <ConsultaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedConsulta}
          medicos={medicos}
          pacientes={pacientes}
          userRole={user.role}
        />
      )}
    </div>
  );
}
