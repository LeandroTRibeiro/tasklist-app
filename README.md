<h1 align="center">devtasks</h1>
<p align="center">O caderno de tarefas: um PWA que funciona offline e sincroniza entre aparelhos</p>

<p align="center">
 <a href="#demo">Demo</a> •
 <a href="#objetivo">Objetivo</a> •
 <a href="#tecnologias">Tecnologias</a> •
 <a href="#implantacao">Implantação</a> •
 <a href="#funcionalidades">Funcionalidades</a> • 
 <a href="#licenca">Licença</a> • 
 <a href="#autor">Autor</a>
</p>

<h2 id="demo">🕹️ Demo</h2>

[![Netlify Status](https://api.netlify.com/api/v1/badges/cff2323a-f213-4823-a101-0d192876fd4d/deploy-status)](https://app.netlify.com/sites/inspiring-syrniki-2b818f/deploys)
<br><a href="https://dev-tasks.netlify.app" target="_blank">Teste minha aplicação aqui!</a>

<h2 id="objetivo">📖 Objetivo</h2>
<p>Uma lista de tarefas com cara de caderno, que abre sem internet, é instalável como app e mantém as tarefas de cada pessoa separadas, sem precisar de login. Começou como um CRUD de estudo e foi refeita em 2026 com animações em GSAP.</p>

<h2 id="tecnologias">🛠 Tecnologias</h2>

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (service worker e manifesto)
- [GSAP](https://gsap.com/) com [@gsap/react](https://gsap.com/resources/React), Flip e DrawSVG
- Fontes Young Serif, Figtree e Caveat, incluídas no projeto

> Veja o arquivo [package.json](https://github.com/LeandroTRibeiro/tasklist-app/blob/main/package.json)

<h2 id="implantacao">📦 Implantação</h2>

Este projeto é dividido em duas partes:

1. Backend <a href="https://github.com/LeandroTRibeiro/api-tasklist" target="_blank">Veja o repositório aqui!</a>
2. Frontend (este repositório)

💡 O app funciona sozinho no aparelho; a API só é usada para sincronizar. Em desenvolvimento ele procura a API em `http://localhost:2000` e, no build de produção, em `https://api-tasklist.onrender.com`. Para outro endereço, defina `VITE_API_URL`.

🧭 Rodando o app

```bash
# clone o repositório
$ git clone https://github.com/LeandroTRibeiro/tasklist-app
$ cd tasklist-app

# instale as dependências
$ npm install

# desenvolvimento
$ npm run dev

# build de produção (gera a pasta dist com o service worker)
$ npm run build && npm run preview
```

<h2 id="funcionalidades">⚙️ Funcionalidades</h2>

Após o usuário entrar na aplicação:
- [x] Criar uma tarefa com ou sem descrição da mesma
- [x] Editar uma tarefa
- [x] Deletar uma tarefa
- [x] Marcar uma tarefa como feita
- [x] Pesquisar tarefas, pelo título ou parte dele
- [x] Ordenar as tarefas por mais antigas ou recentes
- [x] Mudar o tema da aplicação
	
<h2 id="licenca">📝 Licença</h2>

Este projeto está sobre a licença MIT 
> Veja o arquivo [LINCENSE](https://github.com/LeandroTRibeiro/tasklist-app/blob/main/LICENSE)

<h2 id="autor">✒️ Autor</h2>

<a href="https://github.com/LeandroTRibeiro">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/111009157?s=400&u=ccf989df0bb9cf41495186f2bc0564c1b03b0d4e&v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Leandro Thiago Ribeiro </b></sub></a>👋
 <br />
 
[![GitHub Badge](https://img.shields.io/badge/-LeandroTRibeiro-black?style=flat-square&logo=GitHub&logoColor=white&link=https://github.com/LeandroTRibeiro)](https://github.com/LeandroTRibeiro)
[![Linkedin Badge](https://img.shields.io/badge/-LeandroRibeiro-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/ribeiro-leandro/)](https://www.linkedin.com/in/ribeiro-leandro/) 
[![Gmail Badge](https://img.shields.io/badge/-leandrothiago_ribeiro@hotmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:leandrothiago_ribeiro@hotmail.com)](mailto:leandrothiago_ribeiro@hotmail.com)

