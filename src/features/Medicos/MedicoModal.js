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
    especialidades: '' // Alterado para string
  });

  // O fetch de especialidades e o estado `especialidades` não são mais necessários aqui.
  // Você pode remover o `useEffect` que faz o fetch e a declaração de `especialidades`

  useEffect(() => {
    if (initialData) {
      setForm({
        crm: initialData.crm,
        nome: initialData.nome,
        email: initialData.email,
        telefone: initialData.telefone,
        imgUrl: initialData.imgUrl,
        senha: '', // Senha sempre vazia para segurança ao editar
        especialidades: initialData.especialidades || '' // Assume que initialData.especialidades já é uma string
      });
    } else {
      setForm({
        crm: '',
        nome: '',
        email: '',
        telefone: '',
        imgUrl: '',
        senha: '',
        especialidades: ''
      });
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // A função handleEspecialidadesChange não é mais necessária

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.crm || !form.nome || !form.email || !form.telefone || (!isEdit && !form.senha) || !form.especialidades) {
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
          {/* Campo de input tipo texto para as especialidades */}
          <input
            type="text"
            name="especialidades"
            value={form.especialidades}
            onChange={handleChange}
            placeholder="Ex: Cardiologista, Pediatra, Dermatologista"
            required
          />

          <div className="modalActions">
            <button type="button" onClick={onClose} className="btnCancel">Cancelar</button>
            <button type="submit" className="btnSave">{isEdit ? 'Salvar' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}