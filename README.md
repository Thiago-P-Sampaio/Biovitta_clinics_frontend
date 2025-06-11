# Biovitta - Frontend da Aplicação de Gestão de Clínicas

Este repositório contém o código-fonte do frontend da aplicação Biovitta, desenvolvida para ser uma interface intuitiva e eficiente para a gestão de clínicas. Ele permite que usuários (pacientes, médicos e administradores) interajam com o sistema de forma fluida, acessando funcionalidades como agendamento de consultas, visualização de dados de pacientes e médicos, e geração de relatórios.

## Tecnologias Utilizadas

O projeto frontend Biovitta foi construído com as seguintes tecnologias e bibliotecas:

  * **React**: Biblioteca JavaScript para a construção de interfaces de usuário.
  * **NPM (Node Package Manager)**: Gerenciador de pacotes para JavaScript.
  * **Axios**: Cliente HTTP baseado em Promises para fazer requisições à API.
  * **Formik**: Biblioteca para construção de formulários no React, facilitando a validação e o gerenciamento de estados.
  * **Yup**: Biblioteca de validação de schemas, utilizada em conjunto com Formik para validar dados de formulários.
  * **JWT-decode**: Para decodificar JSON Web Tokens.
  * **React Router DOM**: Para roteamento declarativo no React.
  * **Styled Components**: Para estilização de componentes React utilizando CSS-in-JS.
  * **React Icons**: Biblioteca de ícones populares.
  * **React Modal**: Para a criação de modais acessíveis.
  * **React Pro Sidebar**: Para a criação de sidebars responsivas.
  * **Date-fns**: Biblioteca utilitária para manipulação de datas.
  * **Font Awesome Free**: Para ícones adicionais.
  * **Testing Library (DOM, Jest-DOM, React, User-Event)**: Conjunto de ferramentas para facilitar testes de componentes React.

  ###

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="40" alt="git logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="40" alt="github logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" height="40" alt="npm logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/netlify/00C7B7" height="40" alt="netlify logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height="40" alt="vscode logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
</div>

###

## Como Clonar e Iniciar o Projeto

Siga os passos abaixo para ter o projeto frontend rodando em sua máquina local:

1.  **Clonar o Repositório:**

    ```bash
    git clone https://github.com/Thiago-P-Sampaio/Biovitta_clinics_frontend.git
    ```

2.  **Navegar até a Pasta do Projeto:**

    ```bash
    cd Biovitta_clinics_frontend
    ```

3.  **Instalar as Dependências:**

    ```bash
    npm install
    ```

4.  **Iniciar a Aplicação:**

    ```bash
    npm start
    ```

Após a execução do comando `npm start`, a aplicação será iniciada em modo de desenvolvimento e estará acessível em `http://localhost:3000` (ou outra porta disponível, caso a 3000 esteja em uso).

## Estrutura de Pastas

A estrutura de pastas do projeto foi organizada para promover a modularidade e facilitar a manutenção:

```
public
src
├── assets
├── components
├── context
├── features
│   ├── Auth
│   ├── Consultas
│   ├── Medicos
│   ├── Pacientes
│   └── Relatorios
├── hooks
├── pages
├── services
├── styles
├── utils
├── App.css
├── App.js
├── App.test.js
├── index.css
├── index.js
├── logo.svg
├── reportWebVitais.js
└── setupTests.js
.gitignore
package-lock.json
package.json
README.md
```

  * **`assets`**: Contém arquivos estáticos como imagens, ícones, etc.
  * **`components`**: Componentes React reutilizáveis em toda a aplicação.
  * **`context`**: Contextos React para gerenciamento de estado global.
  * **`features`**: Módulos que encapsulam funcionalidades específicas da aplicação (ex: `Auth`, `Consultas`, `Medicos`, `Pacientes`, `Relatorios`). Cada módulo pode conter seus próprios componentes, hooks, e lógica.
  * **`hooks`**: Custom Hooks React para reutilizar lógicas com estado.
  * **`pages`**: Componentes que representam as páginas da aplicação.
  * **`services`**: Lógica para interagir com a API backend.
  * **`styles`**: Arquivos de estilos globais ou temas.
  * **`utils`**: Funções utilitárias e helpers.
  * **`App.js`**: Componente raiz da aplicação.
  * **`index.js`**: Ponto de entrada da aplicação React.
---
## api.js: `src > services >  api.js >`
```JavaScript
import axios from 'axios';
// alterar para contexto de sua aplicação(SEU IP LOCAL): 
// exemplo: http://192.168.1.170:8080/biovitta
const api = axios.create({
  baseURL: 'https://biovitta.azurewebsites.net/biovitta',
});
// Alterar nos outros arquivos que não importam essa 'const'
export default api;
```

## Deploy

O frontend da aplicação Biovitta está atualmente em deploy no Netlify:

  * **Frontend (Netlify):** [https://biovitta.netlify.app/login](https://biovitta.netlify.app/login)
  * **Backend (Azure for Students):** [https://biovitta.azurewebsites.net/](https://biovitta.azurewebsites.net/)
  ---
###


  <table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/Thiago-P-Sampaio/Biovitta_clinics_backend.git">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="100px;" alt="Foto"/><br>
        <sub>
          <b>Repositório Back-end</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Thiago-P-Sampaio/Biovitta_clinics_app.git">
        <img src="https://cdn.simpleicons.org/android/3DDC84" width="100px;" alt="Foto"/><br>
        <sub>
          <b>Repositório REACT-MOBILE</b>
        </sub>
      </a>
    </td>
    </tr>
    </table>