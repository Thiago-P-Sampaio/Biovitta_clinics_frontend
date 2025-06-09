import React, { useEffect, useState } from 'react';
import './ConsultaModal.css';

export default function ConsultaModal({ isOpen, onClose, onSubmit, initialData, medicos, isEdit }) {
  const [form, setForm] = useState({
    medicoId: '',
    dataConsulta: '',
  });
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    if (initialData) {
      const medicoSelecionado = medicos.find(m => m.nome === initialData.medico);
      setForm({
        medicoId: medicoSelecionado ? medicoSelecionado.crm : '',
        dataConsulta: initialData.dataConsulta ? initialData.dataConsulta.slice(0,16) : '',
      });
      setEspecialidades(medicoSelecionado?.especialidades || []);
    } else {
      setForm({
        medicoId: '',
        dataConsulta: '',
      });
      setEspecialidades([]);
    }
  }, [initialData, medicos]);

  function handleMedicoChange(e) {
    const medicoId = e.target.value;
    setForm(prev => ({ ...prev, medicoId }));

    const medico = medicos.find(m => m.crm === medicoId);
    setEspecialidades(medico?.especialidades || []);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.medicoId || !form.dataConsulta) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    onSubmit(form);
  }

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{isEdit ? 'Editar Consulta' : 'Adicionar Consulta'}</h2>
        <form onSubmit={handleSubmit} className="consultaForm">
          <label>Médico*</label>
          <select name="medicoId" value={form.medicoId} onChange={handleMedicoChange} required>
            <option value="">Selecione um médico</option>
            {medicos.map(m => (
              <option key={m.crm} value={m.crm}>{m.nome}</option>
            ))}
          </select>

          <label>Especialidades do Médico</label>
          <input type="text" readOnly value={especialidades.map(e => e.nome).join(', ')} />

          <label>Data e Hora da Consulta*</label>
          <input
            type="datetime-local"
            name="dataConsulta"
            value={form.dataConsulta}
            onChange={handleChange}
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
