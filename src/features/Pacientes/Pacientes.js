import React, { useEffect, useState } from 'react';
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
  const [filteredPacientes, setFilteredPacientes] = useState([]); // Estado para pacientes filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Novo estado para a query de busca

  const [modalOpen, setModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [isEdit, setIsEdit] = useState(false); // Estado para controlar se é edição ou adição

  // Efeito para carregar os pacientes inicialmente e sempre que o usuário mudar
  useEffect(() => {
    fetchPacientes();
  }, [user]);

  // Efeito para filtrar pacientes sempre que a lista original ou a query de busca mudar
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (lowerCaseQuery.length > 0) { // Alterado para lowerCaseQuery.length
      const filtered = pacientes.filter(paciente =>
        (paciente.nome && paciente.nome.toLowerCase().includes(lowerCaseQuery)) ||
        (paciente.email && paciente.email.toLowerCase().includes(lowerCaseQuery)) ||
        (paciente.telefone && paciente.telefone.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredPacientes(filtered);
    } else {
      setFilteredPacientes(pacientes); // Se a busca estiver vazia, exibe todos os pacientes
    }
  }, [pacientes, searchQuery]); // Dependências: `pacientes` e `searchQuery`

  async function fetchPacientes() {
    try {
      setLoading(true);
      let response;
      if (user.role === 'paciente') {
        // Paciente só vê ele mesmo
        response = await api.get(`/auth/buscar/${encodeURIComponent(user.usuario)}`);
        setPacientes([response.data]);
        setFilteredPacientes([response.data]); // Atualiza o estado filtrado também
      } else {
        // Admin e médico veem todos
        response = await api.get('/api/usuario/paciente/get/all');
        setPacientes(response.data);
        setFilteredPacientes(response.data); // Atualiza o estado filtrado também
      }
      setError('');
    } catch (err) {
      console.error("Erro ao carregar pacientes: ", err);
      setError('Erro ao carregar pacientes.');
      setPacientes([]); // Garante que a lista esteja vazia em caso de erro
      setFilteredPacientes([]);
    } finally {
      setLoading(false);
    }
  }

  // Função para lidar com a mudança na SearchBar (atualiza o estado da query de busca)
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  function handleAdd() {
    if (user.role !== 'admin') return; // Apenas admin pode adicionar
    setSelectedPaciente(null); // Limpa o paciente selecionado para adicionar
    setIsEdit(false); // Define como false para indicar adição
    setModalOpen(true);
  }

  function handleEdit(paciente) {
    if (user.role !== 'admin') return; // Apenas admin pode editar
    setSelectedPaciente(paciente); // Define o paciente a ser editado
    setIsEdit(true); // Define como true para indicar edição
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
      fetchPacientes(); // Recarrega a lista após exclusão
      alert('Paciente excluído com sucesso!');
    } catch (err) {
      console.error("Erro ao excluir paciente: ", err.response?.data || err.message || err);
      alert('Erro ao excluir paciente. Verifique o console para mais detalhes.');
    }
  }

  async function handleSubmit(data) {
    if (user.role !== 'admin') return; // Apenas admin pode salvar
    try {
      if (isEdit) {
        // Log dos dados que estão sendo enviados para o PUT
        console.log("Enviando PUT para /api/usuario/paciente/edit/", selectedPaciente.pacienteId || selectedPaciente.id, "com dados:", data);
        await api.put(`/api/usuario/paciente/edit/${selectedPaciente.pacienteId || selectedPaciente.id}`, data);
        alert('Paciente atualizado com sucesso!');
      } else {
        // Log dos dados que estão sendo enviados para o POST
        console.log("Enviando POST para /api/usuario/paciente/add com dados:", data);
        await api.post('/api/usuario/paciente/add', data);
        alert('Paciente adicionado com sucesso!');
      }
      fetchPacientes(); // Recarrega a lista após adição/edição
      setModalOpen(false);
      setSelectedPaciente(null);
    } catch (err) {
      console.error("Erro ao salvar paciente: ", err.response?.data || err.message || err); // Log do erro completo da API
      alert('Erro ao salvar paciente. Verifique o console para mais detalhes.');
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

      {/* Passa a função handleSearchChange para a SearchBar */}
      <SearchBar onSearchChange={handleSearchChange} />

      <div className="pacientes-grid">
        {/* Condição para exibir mensagem de "Nenhum paciente encontrado" */}
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