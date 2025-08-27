# 📚 Tutorial: Deploy de Documentação no GitHub Pages

**Objetivo:** Criar documentação HTML automaticamente gerada e hospedada no GitHub Pages

---

## 🎯 O que você vai conseguir:

- **Documentação profissional** em HTML com design responsivo
- **Deploy automático** sempre que fizer push no repositório
- **URL pública** para compartilhar a documentação
- **Geração de PDF** através do navegador

---

## 📋 Passo 1: Estrutura de Pastas

Crie esta estrutura no seu repositório:

```
seu-repositorio/
├── docs/
│   ├── README.md                    # Documentação principal
│   ├── arquitetura.md              # Arquitetura do sistema
│   ├── guia-desenvolvimento.md     # Guia para desenvolvedores
│   ├── package.json                # Dependências Node.js
│   └── generate-html.js            # Gerador HTML
├── .github/workflows/
│   └── deploy-docs.yml             # GitHub Actions
└── (outros arquivos do projeto)
```

---

## 📝 Passo 2: Criar package.json

Arquivo: `docs/package.json`

```json
{
  "name": "documentacao",
  "version": "1.0.0",
  "description": "Gerador de documentação HTML",
  "scripts": {
    "generate": "node generate-html.js"
  },
  "dependencies": {
    "marked": "^9.1.2",
    "fs-extra": "^11.1.1"
  }
}
```

---

## 🛠️ Passo 3: Criar o Gerador HTML

Arquivo: `docs/generate-html.js`

```javascript
const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Template HTML com estilo profissional
const HTML_TEMPLATE = \`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Documentação</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 10px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            margin: -20px -20px 30px -20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .nav {
            background: #2c3e50;
            padding: 15px 0;
            margin: -20px -20px 20px -20px;
            border-radius: 0 0 8px 8px;
        }
        
        .nav ul {
            list-style: none;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            padding: 0;
            margin: 0;
        }
        
        .nav li { margin: 0 15px; }
        
        .nav a {
            color: #ecf0f1;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            transition: background 0.3s;
        }
        
        .nav a:hover { background: #34495e; }
        
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        h2 {
            font-size: 2em;
            color: #3498db;
            margin-top: 30px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        
        h3 {
            font-size: 1.5em;
            color: #e74c3c;
            margin-top: 25px;
        }
        
        code {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', monospace;
            color: #e74c3c;
            border: 1px solid #e9ecef;
        }
        
        pre {
            background: #2d3748;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border-left: 4px solid #3498db;
        }
        
        pre code {
            background: none;
            color: #fff;
            border: none;
            padding: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
        }
        
        tr:hover { background: #f8f9fa; }
        
        blockquote {
            border-left: 4px solid #3498db;
            padding: 15px 20px;
            margin: 20px 0;
            background: #f8f9fa;
            border-radius: 0 8px 8px 0;
            font-style: italic;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            margin-top: 40px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 0.9em;
        }
        
        @media (max-width: 768px) {
            .container { margin: 10px; padding: 15px; }
            .header h1 { font-size: 2em; }
            .nav ul { flex-direction: column; align-items: center; }
            .nav li { margin: 5px 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 {title}</h1>
            <div class="subtitle">Documentação do Projeto</div>
            <div class="meta">Gerado em {date}</div>
        </div>
        
        <nav class="nav">
            <ul>
                <li><a href="index.html">🏠 Início</a></li>
                <li><a href="README.html">📖 README</a></li>
                <li><a href="arquitetura.html">🏗️ Arquitetura</a></li>
                <li><a href="guia-desenvolvimento.html">💻 Desenvolvimento</a></li>
            </ul>
        </nav>
        
        <div class="content">
            {content}
        </div>
        
        <div class="footer">
            <p>📋 Documentação gerada automaticamente</p>
            <p>💻 Desenvolvido com ❤️</p>
        </div>
    </div>
</body>
</html>
\`;

function extractTitleFromMarkdown(content) {
    const lines = content.split('\\n');
    for (const line of lines) {
        if (line.startsWith('# ')) {
            return line.substring(2).trim();
        }
    }
    return "Documentação";
}

async function convertMdToHtml(mdFilePath, outputDir) {
    try {
        const mdContent = await fs.readFile(mdFilePath, 'utf-8');
        const title = extractTitleFromMarkdown(mdContent);
        const htmlContent = marked(mdContent);
        
        const finalHtml = HTML_TEMPLATE
            .replace(/{title}/g, title)
            .replace(/{content}/g, htmlContent)
            .replace(/{date}/g, new Date().toLocaleString('pt-BR'));
        
        const fileName = path.basename(mdFilePath, '.md') + '.html';
        const outputFile = path.join(outputDir, fileName);
        await fs.writeFile(outputFile, finalHtml, 'utf-8');
        
        return outputFile;
    } catch (error) {
        console.error(\`Erro ao converter \${mdFilePath}: \${error.message}\`);
        return null;
    }
}

async function createIndexPage(outputDir) {
    const indexContent = \`
    <h2>📚 Documentação Disponível</h2>
    
    <blockquote>
        <strong>🎯 Bem-vindo à documentação do projeto!</strong><br>
        Navegue pelas seções usando o menu superior.
    </blockquote>
    
    <h3>📖 Seções Disponíveis</h3>
    <ul>
        <li><a href="README.html"><strong>README</strong></a> - Informações gerais do projeto</li>
        <li><a href="arquitetura.html"><strong>Arquitetura</strong></a> - Estrutura e design do sistema</li>
        <li><a href="guia-desenvolvimento.html"><strong>Guia de Desenvolvimento</strong></a> - Como contribuir</li>
    </ul>
    
    <h3>📄 Como gerar PDF</h3>
    <ol>
        <li>Abra qualquer página da documentação</li>
        <li>Pressione <code>Ctrl + P</code></li>
        <li>Selecione "Salvar como PDF"</li>
        <li>Marque "Gráficos de fundo"</li>
        <li>Clique em "Salvar"</li>
    </ol>
    \`;
    
    const finalHtml = HTML_TEMPLATE
        .replace(/{title}/g, "Documentação do Projeto")
        .replace(/{content}/g, indexContent)
        .replace(/{date}/g, new Date().toLocaleString('pt-BR'));
    
    const indexFile = path.join(outputDir, 'index.html');
    await fs.writeFile(indexFile, finalHtml, 'utf-8');
    return indexFile;
}

async function main() {
    try {
        console.log('🚀 Iniciando geração da documentação...');
        
        const docsDir = __dirname;
        const outputDir = path.join(docsDir, 'html');
        
        await fs.ensureDir(outputDir);
        
        // Arquivos markdown para converter
        const mdFiles = [
            'README.md',
            'arquitetura.md',
            'guia-desenvolvimento.md'
        ];
        
        const convertedFiles = [];
        
        // Converter cada arquivo
        for (const mdFile of mdFiles) {
            const mdPath = path.join(docsDir, mdFile);
            if (await fs.pathExists(mdPath)) {
                console.log(\`📄 Convertendo \${mdFile}...\`);
                const htmlFile = await convertMdToHtml(mdPath, outputDir);
                if (htmlFile) {
                    convertedFiles.push(htmlFile);
                    console.log(\`✅ Criado: \${path.basename(htmlFile)}\`);
                }
            } else {
                console.log(\`⚠️ Arquivo não encontrado: \${mdFile}\`);
            }
        }
        
        // Criar página índice
        console.log('📋 Criando página índice...');
        const indexFile = await createIndexPage(outputDir);
        console.log(\`✅ Criado: \${path.basename(indexFile)}\`);
        
        console.log(\`\\n🎉 Geração concluída!\`);
        console.log(\`📊 \${convertedFiles.length} arquivos convertidos\`);
        console.log(\`🌐 Arquivos HTML em: \${outputDir}\`);
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };
```

---

## ⚙️ Passo 4: Criar GitHub Actions

Arquivo: `.github/workflows/deploy-docs.yml`

```yaml
name: Deploy Documentation

on:
  push:
    branches: [ main ]
    paths: ['docs/**']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    
    steps:
    - name: 📁 Checkout
      uses: actions/checkout@v4
      
    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: docs/package.json
        
    - name: 📦 Install dependencies
      run: |
        cd docs
        npm install
        
    - name: 🔨 Generate HTML
      run: |
        cd docs
        node generate-html.js
        
    - name: 📋 Setup Pages
      uses: actions/configure-pages@v3
      
    - name: 📤 Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: docs/html
        
    - name: 🚀 Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

---

## 📝 Passo 5: Criar Documentação de Exemplo

### Arquivo: `docs/README.md`

```markdown
# 📚 Meu Projeto

Descrição do seu projeto aqui.

## 🚀 Como usar

Instruções de instalação e uso.

## 🛠️ Tecnologias

- Node.js
- React
- MongoDB

## 📞 Contato

Informações de contato.
```

### Arquivo: `docs/arquitetura.md`

```markdown
# 🏗️ Arquitetura do Sistema

## Visão Geral

Descrição da arquitetura do sistema.

## Componentes

### Frontend
- React.js
- TypeScript

### Backend
- Node.js
- Express

### Banco de Dados
- MongoDB
```

### Arquivo: `docs/guia-desenvolvimento.md`

```markdown
# 💻 Guia de Desenvolvimento

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências
3. Configure as variáveis de ambiente

## Padrões de Código

- Use ESLint
- Siga o Prettier
- Escreva testes

## Como Contribuir

1. Fork o projeto
2. Crie uma branch
3. Faça suas alterações
4. Abra um Pull Request
```

---

## 🚀 Passo 6: Fazer Deploy

### 1. Fazer commit e push:

```bash
git add .
git commit -m "feat: Add documentation and GitHub Pages deploy"
git push origin main
```

### 2. Habilitar GitHub Pages:

1. Vá para **Settings** do repositório
2. Scroll até **Pages**
3. Em **Source**, selecione **GitHub Actions**

### 3. Aguardar deploy:

- Vá para a aba **Actions** para ver o progresso
- Em 2-5 minutos estará online

---

## 🎯 Resultado Final

Sua documentação estará disponível em:
**https://SEU-USUARIO.github.io/SEU-REPOSITORIO/**

### ✨ Recursos incluídos:

- **Design responsivo** 📱
- **Navegação entre páginas** 🔗
- **Geração de PDF** 📄
- **Deploy automático** 🤖
- **URL pública** 🌐

---

## 🔧 Customização

### Para adicionar mais páginas:

1. Crie novos arquivos `.md` na pasta `docs/`
2. Adicione os nomes no array `mdFiles` do `generate-html.js`
3. Adicione links na navegação do template HTML
4. Commit e push - deploy automático!

### Para mudar o estilo:

- Edite a seção `<style>` no `HTML_TEMPLATE`
- Cores, fonts, layout - tudo customizável

---

## 🎉 Pronto!

Agora você tem documentação profissional com deploy automático! 

**Sempre que atualizar os arquivos `.md` e fazer push, a documentação será regenerada automaticamente.** ⚡
