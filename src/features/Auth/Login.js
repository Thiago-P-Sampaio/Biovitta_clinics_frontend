import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ usuario: '', senha: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(form.usuario, form.senha);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bgGradient">
      <form className="authBox" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="usuario"
          placeholder="Email"
          value={form.usuario}
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
        <button type="submit" className="loginBtn">Entrar</button>
        {error && <p className="error">{error}</p>}
        <Link to="/register" className="registerLink">Registrar-se</Link>
      </form>
    </div>
  );
}
