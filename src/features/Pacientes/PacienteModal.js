import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './PacienteModal.css'; // Importa CSS global

// Esquema de validação DINÂMICO baseado no modo (edição ou criação)
const getValidationSchema = (isEdit) => {
  return Yup.object().shape({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    telefone: Yup.string().required('Telefone é obrigatório'),
    // imgUrl: opcional na edição, obrigatório na criação
    imgUrl: isEdit
      ? Yup.string().url('URL da foto inválida').nullable() // Pode ser nulo/vazio na edição
      : Yup.string().url('URL da foto inválida').required('Foto é obrigatória'),
    dataNascimento: Yup.string().required('Data de nascimento é obrigatória'),
    // Senha: obrigatória na criação, opcional na edição
    senha: isEdit
      ? Yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').nullable() // Pode ser nulo/vazio na edição
      : Yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  });
};

export default function PacienteModal({ isOpen, onClose, initialValues, onSubmit, isEdit }) { // Recebe isEdit
  if (!isOpen) return null;

  // Formata a data de nascimento para o formato "YYYY-MM-DD" exigido pelo input type="date"
  // A data de nascimento deve ser ajustada apenas se existir initialValues e dataNascimento
  const formattedInitialDataNascimento = initialValues?.dataNascimento
    ? new Date(initialValues.dataNascimento).toISOString().split('T')[0]
    : '';

  // Prepara os valores iniciais do formulário
  // Garante que a senha sempre comece vazia para não exibir o hash ou valor antigo
  const initialFormValues = initialValues
    ? {
        ...initialValues,
        dataNascimento: formattedInitialDataNascimento,
        senha: '', // Mantenha a senha vazia no initialValues para edições
      }
    : {
        nome: '',
        email: '',
        telefone: '',
        imgUrl: '',
        dataNascimento: '',
        senha: '',
      };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>{isEdit ? 'Editar Paciente' : 'Cadastrar Paciente'}</h2>
        
        {/* Você pode adicionar um botão de fechar (X) aqui como feito nos modais estilizados */}
        {/* <button className="modalCloseButton" onClick={onClose} aria-label="Fechar">
            <i className="fas fa-times"></i>
        </button> */}

        <Formik
          initialValues={initialFormValues}
          validationSchema={getValidationSchema(isEdit)} // Usa o esquema de validação condicional
          onSubmit={async (values, { setSubmitting, resetForm }) => {

            try {
              // Cria uma cópia dos valores para enviar
              const dataToSubmit = { ...values };

              // Se for edição e o campo de senha estiver vazio, remova-o do objeto
              // para que a API não tente atualizar a senha para vazio/nulo.
              if (isEdit && !dataToSubmit.senha) {
                delete dataToSubmit.senha;
              }

              // Se a imgUrl estiver vazia, defina como nulo para a API (se a API aceitar)
              if (!dataToSubmit.imgUrl) {
                dataToSubmit.imgUrl = null;
              }


              await onSubmit(dataToSubmit); 
              setSubmitting(false);
              resetForm();
              onClose(); 
            } catch (error) {
              console.error("Erro ao submeter formulário do paciente (no modal):", error); 
              setSubmitting(false);
             
              alert("Erro ao salvar paciente. Verifique os dados e o console.");
            }
          }}
          enableReinitialize={true} 
        >
          {({ isSubmitting, isValid, dirty, touched, errors }) => ( 
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

              {/* Campo de Senha: exibido e validado condicionalmente */}
              {!isEdit ? ( // Modo de adição: senha é obrigatória
                <>
                  <label>Senha</label>
                  <Field name="senha" type="password" />
                  <ErrorMessage name="senha" component="div" className="error" />
                </>
              ) : ( // Modo de edição: senha é opcional
                <>
                  <label>Senha (deixe em branco para não alterar)</label>
                  <Field name="senha" type="password" />
                  <ErrorMessage name="senha" component="div" className="error" />
                </>
              )}

              <div className="actions">
                <button type="button" onClick={onClose} className="cancel">
                  Cancelar
                </button>
                <button
                  type="submit"
                  // Desabilita se estiver submetendo, ou se for edição e não houver mudanças, ou se a validação falhou
                  disabled={isSubmitting || (isEdit && !dirty) || !isValid}
                  className="save"
                >
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