import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Ajuste o caminho conforme seu projeto
import { useAuth } from '../../context/AuthContext';

export default function Relatorios() {
  const { user } = useAuth();
  const [dataHoraAtual, setDataHoraAtual] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString();
    const horaFormatada = agora.toLocaleTimeString();
    setDataHoraAtual(`${dataFormatada} ${horaFormatada}`);
  }, []);

  // Bloqueia acesso se não for admin
  if (!user || user.role.toLowerCase() !== 'admin') {
    return (
      <div style={styles.container}>
        <h2>Acesso negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  async function baixarRelatorio() {
    setLoading(true);
    setError('');
    try {
      // Faz a requisição esperando um blob (arquivo)
      const response = await api.get('api/relatorios/consultas', {
        responseType: 'blob',
      });

      // Cria um link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Tenta extrair o nome do arquivo do header Content-Disposition
      let filename = 'relatorio_consultas.pdf'; // nome padrão
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Remove o link depois do download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError('Erro ao baixar relatório. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1>Relatórios</h1>
      <p><strong>Usuário:</strong> {user.usuario}</p>
      <p style={styles.welcome}>Seja bem-vindo(a) à área de relatórios!</p>
      <p><strong>Data e horário atual:</strong> {dataHoraAtual}</p>

      <button style={styles.button} onClick={baixarRelatorio} disabled={loading}>
        {loading ? 'Baixando...' : 'Baixar Relatório de Consultas'}
      </button>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '40px auto',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },
  welcome: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '20px 0',
    color: '#6a1b9a',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#6a1b9a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  error: {
    marginTop: 20,
    color: 'red',
    fontWeight: 'bold',
  },
};
