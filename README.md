# 📚 Gerador de Documentação DoeSangue

Este diretório contém ferramentas para gerar documentação HTML e PDF do projeto DoeSangue.

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ instalado
- NPM ou Yarn

### Instalação
```bash
cd docs
npm install
```

### Gerar apenas HTML
```bash
npm run generate
```

### Gerar apenas PDF (requer HTML já gerado)
```bash
npm run generate-pdf
```

### Gerar HTML e PDF
```bash
npm run generate-all
```

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
