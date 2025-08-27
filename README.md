# 🩸 Doe Sangue - Documentação Oficial

> Documentação completa do sistema de doação de sangue, uma API REST desenvolvida em Spring Boot para conectar doadores e hemocentros.

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-brightgreen?style=for-the-badge&logo=github)](https://nisze.github.io/doe-sangue-doc/)
[![Documentação](https://img.shields.io/badge/Docs-Online-blue?style=for-the-badge&logo=readthedocs)](https://nisze.github.io/doe-sangue-doc/)

## 📋 Sobre o Projeto

O **Doe Sangue** é um sistema que facilita a conexão entre doadores de sangue e hemocentros, permitindo o gerenciamento eficiente de doações e estoque sanguíneo.

## 📚 Documentação

### 🌐 Versão Online
Acesse a documentação formatada em: **https://nisze.github.io/doe-sangue-doc/**

### � Documentos Disponíveis

1. **[Documentação das Entidades](DOCUMENTACAO-ENTIDADES.md)** - Detalhes das entidades do sistema
2. **[Arquitetura do Sistema](architecture.md)** - Visão geral da arquitetura
3. **[Controller Doador](DOADOR-CONTROLLER-DOCUMENTACAO.md)** - Documentação específica do controller
4. **[Guia de Boas Práticas](GUIA-CONTROLLER-BOAS-PRATICAS.md)** - Padrões e convenções
5. **[Documentação Swagger](SWAGGER-DOCUMENTACAO.md)** - Configuração da API docs
6. **[Implementação Swagger](SWAGGER-RESUMO-IMPLEMENTACAO.md)** - Resumo da implementação
7. **[Plano de Ação](PLANO-ACAO-SEMANAL.md)** - Cronograma de desenvolvimento
8. **[Roadmap](ROADMAP-PROXIMOS-PASSOS.md)** - Próximas funcionalidades

## 🚀 Como Gerar HTML Localmente

```bash
# Instalar dependências
npm install

# Gerar documentação HTML
node generate-html-fixed.js
```

Os arquivos HTML serão gerados na pasta `html/` com design responsivo e navegação.

## 🛠️ Tecnologias

- **Backend**: Spring Boot 3.5.5
- **Banco**: SQL Server
- **Segurança**: Spring Security + JWT
- **Documentação**: SpringDoc OpenAPI 3.0
- **Build**: Maven
- **Deploy**: GitHub Actions + GitHub Pages

## 📁 Estrutura do Repositório

```
📦 doe-sangue-doc
├── 📄 *.md                    # Documentações em Markdown
├── 📂 html/                   # Versões HTML geradas
├── 📂 .github/workflows/      # GitHub Actions
├── 🔧 generate-html-fixed.js  # Gerador HTML
├── 📦 package.json           # Dependências Node.js
└── 📖 README.md              # Este arquivo
```

## 🔄 Deploy Automático

A documentação é automaticamente atualizada no GitHub Pages sempre que há mudanças na branch `main`.

## 📞 Contato

Desenvolvido para a disciplina de Análise e Desenvolvimento de Sistemas.

---
*Salvando vidas através da tecnologia* ❤️

## 📁 Estrutura de Saída

```
docs/
├── html/                          # Documentação em HTML
│   ├── index.html                # Página inicial
│   ├── architecture.html         # Arquitetura do sistema
│   ├── DOCUMENTACAO-ENTIDADES.html
│   ├── DOADOR-CONTROLLER-DOCUMENTACAO.html
│   ├── SWAGGER-DOCUMENTACAO.html
│   └── ...
├── pdf/                           # Documentação em PDF
│   ├── index.pdf
│   ├── architecture.pdf
│   └── ...
└── generate-html-fixed.js         # Gerador HTML
└── generate-pdf.js               # Gerador PDF
```

## 🌐 Visualização

### HTML
Abra o arquivo `html/index.html` em qualquer navegador para navegar pela documentação.

### PDF
Os PDFs estão na pasta `pdf/` e podem ser abertos em qualquer leitor de PDF.

## ✨ Recursos da Documentação HTML

- **Design responsivo** - Funciona em desktop e mobile
- **Navegação integrada** - Links entre documentos
- **Formatação rica** - Tabelas, códigos, listas
- **Tema profissional** - Gradientes e cores consistentes
- **Busca por página** - Ctrl+F funciona perfeitamente

## 🛠️ Customização

Para personalizar o layout ou estilo:

1. Edite o template HTML em `generate-html-fixed.js`
2. Modifique as seções CSS conforme necessário
3. Execute novamente `npm run generate`

## 📞 Suporte

Para dúvidas sobre a documentação, consulte:
- Arquivo principal: `index.html`
- Documentação da API: `SWAGGER-DOCUMENTACAO.html`
- Guia do desenvolvedor: `DOADOR-CONTROLLER-DOCUMENTACAO.html`
