import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import CardMedico from '../../components/CardMedico';
import MedicoModal from './MedicoModal';
import MedicoDetalhesModal from './MedicoDetalhesModal';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar'; // Importe a SearchBar
import './Medicos.css';

export default function Medicos() {
  const { user } = useAuth();

  const [medicos, setMedicos] = useState([]);
  const [filteredMedicos, setFilteredMedicos] = useState([]); // Estado para médicos filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Novo estado para a query de busca

  const [modalOpen, setModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Efeito para carregar os médicos inicialmente e sempre que o usuário mudar
  useEffect(() => {
    fetchMedicos();
  }, [user]);

  // Efeito para filtrar médicos sempre que a lista original ou a query de busca mudar
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (searchQuery.length > 0) {
      const filtered = medicos.filter(medico =>
        (medico.nome && medico.nome.toLowerCase().includes(lowerCaseQuery)) ||
        (medico.email && medico.email.toLowerCase().includes(lowerCaseQuery)) ||
        (medico.crm && medico.crm.toLowerCase().includes(lowerCaseQuery)) ||
        (medico.telefone && medico.telefone.toLowerCase().includes(lowerCaseQuery)) ||
        (medico.especialidades?.some(e => e.nome.toLowerCase().includes(lowerCaseQuery)))
      );
      setFilteredMedicos(filtered);
    } else {
      setFilteredMedicos(medicos); // Se a busca estiver vazia, exibe todos os médicos
    }
  }, [medicos, searchQuery]); // Dependências: `medicos` e `searchQuery`


  // Permite acesso apenas para admin, medico e paciente
  if (!user || !['admin', 'medico', 'paciente'].includes(user.role)) {
    return <p>Acesso negado. Você não tem permissão para acessar esta página.</p>;
  }

  async function fetchMedicos() {
    try {
      setLoading(true);
      const response = await api.get('/api/medicos/get/all');
      setMedicos(response.data);
      setError('');
    } catch (err) {
      console.error("Erro ao carregar médicos: ", err);
      setError('Erro ao carregar médicos.');
      setMedicos([]); // Garante que a lista esteja vazia em caso de erro
    } finally {
      setLoading(false);
    }
  }

  // Função para lidar com a mudança na SearchBar (atualiza o estado da query de busca)
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

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
      fetchMedicos(); // Recarrega a lista após exclusão
    } catch (err) {
      console.error("Erro ao excluir médico: ", err);
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
      fetchMedicos(); // Recarrega a lista após adição/edição
      setModalOpen(false);
      setSelectedMedico(null);
    } catch (err) {
      console.error("Erro ao salvar médico: ", err);
      alert('Erro ao salvar médico.');
    }
  }

  if (loading) return <p>Carregando médicos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="medicos-container">
      <h1>Médicos</h1>

      {user.role === 'admin' && (
        <button className="btn-add" onClick={handleAdd}>+ Adicionar Médico</button>
      )}

      {/* Passa a função handleSearchChange para a SearchBar */}
      <SearchBar onSearchChange={handleSearchChange} />

      <div className="medicos-grid">
        {/* Condição para exibir mensagem de "Nenhum médico encontrado" */}
        {filteredMedicos.length === 0 && searchQuery.length > 0 ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#666' }}>Nenhum médico encontrado com esta busca.</p>
        ) : filteredMedicos.length === 0 && !loading && !error ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#666' }}>Nenhum médico cadastrado.</p>
        ) : (
          filteredMedicos.map(medico => (
            <CardMedico
              key={medico.crm}
              medico={medico}
              onView={() => handleView(medico)}
              onEdit={user.role === 'admin' ? () => handleEdit(medico) : undefined}
              onDelete={user.role === 'admin' ? () => handleDelete(medico) : undefined}
            />
          ))
        )}
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