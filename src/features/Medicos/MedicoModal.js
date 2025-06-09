import React, { useEffect, useState } from 'react';
import './MedicoModal.css';

export default function MedicoModal({ isOpen, onClose, onSubmit, initialData, isEdit }) {
  const [form, setForm] = useState({
    crm: '',
    nome: '',
    email: '',
    telefone: '',
    imgUrl: '',
    senha: '',
    especialidadesIds: []
  });

  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        crm: initialData.crm,
        nome: initialData.nome,
        email: initialData.email,
        telefone: initialData.telefone,
        imgUrl: initialData.imgUrl,
        senha: '',
        especialidadesIds: initialData.especialidades?.map(e => e.especialidade_id) || []
      });
    } else {
      setForm({
        crm: '',
        nome: '',
        email: '',
        telefone: '',
        imgUrl: '',
        senha: '',
        especialidadesIds: []
      });
    }
  }, [initialData]);

  useEffect(() => {
    async function fetchEspecialidades() {
      try {
        const res = await fetch('http://localhost:8080/biovitta/api/especialidades/get/all');
        const data = await res.json();
        setEspecialidades(data);
      } catch (error) {
        console.error('Erro ao carregar especialidades', error);
      }
    }
    fetchEspecialidades();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleEspecialidadesChange(e) {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selectedIds.push(Number(options[i].value));
    }
    setForm(prev => ({ ...prev, especialidadesIds: selectedIds }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.crm || !form.nome || !form.email || !form.telefone || (!isEdit && !form.senha)) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    onSubmit(form);
  }

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{isEdit ? 'Editar Médico' : 'Adicionar Médico'}</h2>
        <form onSubmit={handleSubmit} className="medicoForm">
          <label>CRM*</label>
          <input name="crm" value={form.crm} onChange={handleChange} disabled={isEdit} required />

          <label>Nome*</label>
          <input name="nome" value={form.nome} onChange={handleChange} required />

          <label>Email*</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Telefone*</label>
          <input name="telefone" value={form.telefone} onChange={handleChange} required />

          <label>URL da Foto</label>
          <input name="imgUrl" value={form.imgUrl} onChange={handleChange} />

          {!isEdit && (
            <>
              <label>Senha*</label>
              <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
            </>
          )}

          <label>Especialidades*</label>
          <select multiple value={form.especialidadesIds} onChange={handleEspecialidadesChange} required>
            {especialidades.map(e => (
              <option key={e.especialidade_id} value={e.especialidade_id}>
                {e.nome}
              </option>
            ))}
          </select>

          <div className="modalActions">
            <button type="button" onClick={onClose} className="btnCancel">Cancelar</button>
            <button type="submit" className="btnSave">{isEdit ? 'Salvar' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
