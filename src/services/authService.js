import axios from 'axios';

const api = axios.create({
  baseURL: 'https://biovitta.azurewebsites.net/biovitta',
});

export const login = async (usuario, senha) => {
  const response = await api.post('/auth/login', { usuario, senha });
  return response.data;
};

export const registerPaciente = async (dadosPaciente) => {
  const response = await api.post('/auth/register', dadosPaciente);
  return response.data;
};
