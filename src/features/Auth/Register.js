import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerPaciente } from '../../services/authService';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    imgUrl: '',
    dataNascimento: '',
    senha: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await registerPaciente(form);
      navigate('/login');
    } catch {
      setError('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="bgGradient">
      <form className="authBox" onSubmit={handleSubmit}>
        <h2>Registrar-se</h2>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="imgUrl"
          placeholder="URL da Foto"
          value={form.imgUrl}
          onChange={handleChange}
          className="input"
        />
        <input
          type="date"
          name="dataNascimento"
          placeholder="Data de Nascimento"
          value={form.dataNascimento}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="input"
          required
        />
        <button type="submit" className="loginBtn">Registrar</button>
        {error && <p className="error">{error}</p>}
        <Link to="/login" className="registerLink">Voltar ao Login</Link>
      </form>
    </div>
  );
}
