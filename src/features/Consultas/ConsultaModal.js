import React, { useEffect, useState } from 'react';
import './ConsultaModal.css';

// Adicionado 'pacientes' e 'userRole' como props
export default function ConsultaModal({ isOpen, onClose, onSubmit, initialData, medicos, pacientes, isEdit, userRole }) {
  const [form, setForm] = useState({
    medicoId: '',
    pacienteId: '', // Adicionado pacienteId ao estado do formulário
    dataConsulta: '',
  });
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    if (initialData) {
      // Para edição, preenche medicoId e pacienteId com base nos nomes
      const medicoSelecionado = medicos.find(m => m.nome === initialData.medico);
      const pacienteSelecionado = pacientes.find(p => p.nome === initialData.paciente);

      setForm({
        medicoId: medicoSelecionado ? medicoSelecionado.crm : '',
        pacienteId: pacienteSelecionado ? pacienteSelecionado.pacienteId : '', // Preenche pacienteId
        dataConsulta: initialData.dataConsulta ? initialData.dataConsulta.slice(0, 16) : '',
      });
      setEspecialidades(medicoSelecionado?.especialidades || []);
    } else {
      // Para adição, reseta o formulário
      setForm({
        medicoId: '',
        pacienteId: '',
        dataConsulta: '',
      });
      setEspecialidades([]);
    }
  }, [initialData, medicos, pacientes]); // Adiciona pacientes como dependência

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
    // Validação condicional:
    // Se for paciente, apenas medicoId e dataConsulta são obrigatórios.
    // Se for ADMIN ou Médico, todos os 3 (pacienteId, medicoId, dataConsulta) são obrigatórios.
    if (!form.medicoId || !form.dataConsulta || ((userRole === 'admin' || userRole === 'medico') && !form.pacienteId)) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onSubmit(form);
  }

  if (!isOpen) return null;

  const isAdminOrMedico = userRole === 'admin' || userRole === 'medico';

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{isEdit ? 'Editar Consulta' : 'Adicionar Consulta'}</h2>
        <form onSubmit={handleSubmit} className="consultaForm">

          {/* Campo de seleção de paciente - visível para ADMINs e Médicos */}
          {isAdminOrMedico && (
            <>
              <label>Paciente*</label>
              <select
                name="pacienteId"
                value={form.pacienteId}
                onChange={handleChange}
                required={isAdminOrMedico} // É obrigatório para ADMIN/Médico
              >
                <option value="">Selecione um paciente</option>
                {pacientes.map(p => (
                  <option key={p.pacienteId} value={p.pacienteId}>{p.nome}</option>
                ))}
              </select>
            </>
          )}

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