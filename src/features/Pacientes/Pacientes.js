import React, { useEffect, useState, useCallback } from 'react'; // Importe useCallback
import api from '../../services/api';
import './Pacientes.css';
import PacienteModal from './PacienteModal';
import PacienteDetalhesModal from './PacienteDetalhesModal.js';
import CardPaciente from '../../components/CardPaciente';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar'; // Importe a SearchBar

export default function Pacientes() {
  const { user } = useAuth();

  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Use useCallback para memorizar a função fetchPacientes
  const fetchPacientes = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      if (user.role === 'paciente') {
        response = await api.get(`/auth/buscar/${encodeURIComponent(user.usuario)}`);
        setPacientes([response.data]);
        setFilteredPacientes([response.data]);
      } else {
        response = await api.get('/api/usuario/paciente/get/all');
        setPacientes(response.data);
        setFilteredPacientes(response.data);
      }
      setError('');
    } catch (err) {
      console.error("Erro ao carregar pacientes: ", err);
      setError('Erro ao carregar pacientes.');
      setPacientes([]);
      setFilteredPacientes([]);
    } finally {
      setLoading(false);
    }
  }, [user]); // fetchPacientes depende de 'user'

  // Efeito para carregar os pacientes inicialmente e sempre que o usuário mudar
  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]); // Inclua fetchPacientes no array de dependências

  // Efeito para filtrar pacientes sempre que a lista original ou a query de busca mudar
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (lowerCaseQuery.length > 0) {
      const filtered = pacientes.filter(paciente =>
        (paciente.nome && paciente.nome.toLowerCase().includes(lowerCaseQuery)) ||
        (paciente.email && paciente.email.toLowerCase().includes(lowerCaseQuery)) ||
        (paciente.telefone && paciente.telefone.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredPacientes(filtered);
    } else {
      setFilteredPacientes(pacientes);
    }
  }, [pacientes, searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  function handleAdd() {
    if (user.role !== 'admin') return;
    setSelectedPaciente(null);
    setIsEdit(false);
    setModalOpen(true);
  }

  function handleEdit(paciente) {
    if (user.role !== 'admin') return;
    setSelectedPaciente(paciente);
    setIsEdit(true);
    setModalOpen(true);
  }

  function handleView(paciente) {
    setSelectedPaciente(paciente);
    setDetalhesModalOpen(true);
  }

  async function handleDelete(paciente) {
    if (user.role !== 'admin') return;
    // Substitua window.confirm por um modal personalizado para evitar alerts em iframes
    if (!window.confirm(`Deseja realmente excluir ${paciente.nome}?`)) return;
    try {
      await api.delete(`/api/usuario/paciente/dell/${paciente.pacienteId || paciente.id}`);
      fetchPacientes(); // Recarrega a lista após exclusão
      alert('Paciente excluído com sucesso!'); // Substitua alert por um modal personalizado
    } catch (err) {
      console.error("Erro ao excluir paciente: ", err.response?.data || err.message || err);
      alert('Erro ao excluir paciente. Verifique o console para mais detalhes.'); // Substitua alert
    }
  }

  async function handleSubmit(data) {
    if (user.role !== 'admin') return;
    try {
      if (isEdit) {
        console.log("Enviando PUT para /api/usuario/paciente/edit/", selectedPaciente.pacienteId || selectedPaciente.id, "com dados:", data);
        await api.put(`/api/usuario/paciente/edit/${selectedPaciente.pacienteId || selectedPaciente.id}`, data);
        alert('Paciente atualizado com sucesso!'); // Substitua alert
      } else {
        console.log("Enviando POST para /api/usuario/paciente/add com dados:", data);
        await api.post('/api/usuario/paciente/add', data);
        alert('Paciente adicionado com sucesso!'); // Substitua alert
      }
      fetchPacientes(); // Recarrega a lista após adição/edição
      setModalOpen(false);
      setSelectedPaciente(null);
    } catch (err) {
      console.error("Erro ao salvar paciente: ", err.response?.data || err.message || err);
      alert('Erro ao salvar paciente. Verifique o console para mais detalhes.'); // Substitua alert
    }
  }

  if (loading) return <p>Carregando pacientes...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="pacientes-container">
      <h1>Pacientes</h1>

      {user.role === 'admin' && (
        <button className="btn-add" onClick={handleAdd}>
          + Adicionar Paciente
        </button>
      )}

      <SearchBar onSearchChange={handleSearchChange} />

      <div className="pacientes-grid">
        {filteredPacientes.length === 0 && searchQuery.length > 0 ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#666' }}>Nenhum paciente encontrado com esta busca.</p>
        ) : filteredPacientes.length === 0 && !loading && !error ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#666' }}>Nenhum paciente cadastrado.</p>
        ) : (
          filteredPacientes.map(paciente => (
            <CardPaciente
              key={paciente.pacienteId || paciente.id}
              paciente={paciente}
              onEdit={user.role === 'admin' ? () => handleEdit(paciente) : undefined}
              onDelete={user.role === 'admin' ? () => handleDelete(paciente) : undefined}
              onView={() => handleView(paciente)}
            />
          ))
        )}
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
