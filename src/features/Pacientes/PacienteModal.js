import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import  './PacienteModal.css'; // Importa CSS global

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome obrigatório'),
  email: Yup.string().email('Email inválido').required('Email obrigatório'),
  telefone: Yup.string().required('Telefone obrigatório'),
  imgUrl: Yup.string().url('URL inválida').required('Foto obrigatória'),
  dataNascimento: Yup.string().required('Data de nascimento obrigatória'),
  senha: Yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
});

export default function PacienteModal({ isOpen, onClose, initialValues, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>{initialValues ? 'Editar Paciente' : 'Cadastrar Paciente'}</h2>
        <Formik
          initialValues={initialValues || {
            nome: '',
            email: '',
            telefone: '',
            imgUrl: '',
            dataNascimento: '',
            senha: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await onSubmit(values);
            setSubmitting(false);
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              <label>Nome</label>
              <Field name="nome" />
              <ErrorMessage name="nome" component="div" className="error" />

              <label>Email</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error" />

              <label>Telefone</label>
              <Field name="telefone" />
              <ErrorMessage name="telefone" component="div" className="error" />

              <label>URL da Foto</label>
              <Field name="imgUrl" />
              <ErrorMessage name="imgUrl" component="div" className="error" />

              <label>Data de Nascimento</label>
              <Field name="dataNascimento" type="date" />
              <ErrorMessage name="dataNascimento" component="div" className="error" />

              <label>Senha</label>
              <Field name="senha" type="password" />
              <ErrorMessage name="senha" component="div" className="error" />

              <div className="actions">
                <button type="button" onClick={onClose} className="cancel">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="save">
                  Salvar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
