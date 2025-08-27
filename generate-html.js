#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Template HTML base
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - DoeSangue Documentation</title>
    <style>
        /* Reset e Base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 10px;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        
        /* Header */
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
        
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .header .meta {
            margin-top: 15px;
            font-size: 0.9em;
            opacity: 0.8;
        }
        
        /* Typography */
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        h1 {
            font-size: 2.5em;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
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
        
        h4 {
            font-size: 1.3em;
            color: #f39c12;
        }
        
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        /* Lists */
        ul, ol {
            margin-bottom: 15px;
            padding-left: 30px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        /* Code */
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
        
        /* Tables */
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
        
        tr:hover {
            background: #f8f9fa;
        }
        
        /* Blockquotes */
        blockquote {
            border-left: 4px solid #3498db;
            padding: 15px 20px;
            margin: 20px 0;
            background: #f8f9fa;
            border-radius: 0 8px 8px 0;
            font-style: italic;
        }
        
        /* Links */
        a {
            color: #3498db;
            text-decoration: none;
            border-bottom: 1px dotted #3498db;
        }
        
        a:hover {
            color: #2980b9;
            border-bottom: 1px solid #2980b9;
        }
        
        /* Badges/Tags */
        .badge {
            display: inline-block;
            padding: 4px 8px;
            background: #3498db;
            color: white;
            border-radius: 12px;
            font-size: 0.8em;
            margin: 2px;
        }
        
        .badge.success { background: #27ae60; }
        .badge.warning { background: #f39c12; }
        .badge.danger { background: #e74c3c; }
        .badge.info { background: #3498db; }
        
        /* Navigation */
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
        
        .nav li {
            margin: 0 15px;
        }
        
        .nav a {
            color: #ecf0f1;
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            transition: background 0.3s;
        }
        
        .nav a:hover {
            background: #34495e;
            border: none;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: 20px;
            margin-top: 40px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 0.9em;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                padding: 15px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.3em; }
            
            .nav ul {
                flex-direction: column;
                align-items: center;
            }
            
            .nav li {
                margin: 5px 0;
            }
        }
        
        /* Stats */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
            border-left: 4px solid #3498db;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #3498db;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🩸 {title}</h1>
            <div class="subtitle">Sistema DoeSangue - Documentação Técnica</div>
            <div class="meta">Gerado em {date} | Versão {version}</div>
        </div>
        
        <nav class="nav">
            <ul>
                <li><a href="index.html">🏠 Início</a></li>
                <li><a href="architecture.html">🏗️ Arquitetura</a></li>
                <li><a href="DOCUMENTACAO-ENTIDADES.html">📊 Entidades</a></li>
                <li><a href="DOADOR-CONTROLLER-DOCUMENTACAO.html">🎮 Controller</a></li>
                <li><a href="SWAGGER-DOCUMENTACAO.html">📖 Swagger</a></li>
                <li><a href="ROADMAP-PROXIMOS-PASSOS.html">🗺️ Roadmap</a></li>
            </ul>
        </nav>
        
        <div class="content">
            {content}
        </div>
        
        <div class="footer">
            <p>📋 Documentação gerada automaticamente | 🎯 Projeto DoeSangue</p>
            <p>💻 Desenvolvido com ❤️ pela equipe de desenvolvimento</p>
        </div>
    </div>
</body>
</html>
`;

function extractTitleFromMarkdown(content) {
    const lines = content.split('\n');
    for (const line of lines) {
        if (line.startsWith('# ')) {
            return line.substring(2).trim();
        }
    }
    return "Documentação DoeSangue";
}

function enhanceMarkdown(content) {
    // Converter badges e emojis especiais
    content = content.replace(/✅/g, '<span class="badge success">✅</span>');
    content = content.replace(/❌/g, '<span class="badge danger">❌</span>');
    content = content.replace(/⚠️/g, '<span class="badge warning">⚠️</span>');
    
    return content;
}

async function convertMdToHtml(mdFilePath, outputDir) {
    try {
        // Ler arquivo markdown
        const mdContent = await fs.readFile(mdFilePath, 'utf-8');
        
        // Extrair título
        const title = extractTitleFromMarkdown(mdContent);
        
        // Melhorar markdown
        const enhancedMd = enhanceMarkdown(mdContent);
        
        // Converter para HTML
        const htmlContent = marked(enhancedMd);
        
        // Aplicar template
        const finalHtml = HTML_TEMPLATE
            .replace(/{title}/g, title)
            .replace(/{content}/g, htmlContent)
            .replace(/{date}/g, new Date().toLocaleString('pt-BR'))
            .replace(/{version}/g, "1.0");
        
        // Salvar arquivo HTML
        const fileName = path.basename(mdFilePath, '.md') + '.html';
        const outputFile = path.join(outputDir, fileName);
        await fs.writeFile(outputFile, finalHtml, 'utf-8');
        
        return outputFile;
        
    } catch (error) {
        console.error(`Erro ao converter ${mdFilePath}: ${error.message}`);
        return null;
    }
}

async function createIndexPage(outputDir) {
    const indexContent = \`
    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">6</div>
            <div class="stat-label">Documentos</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">17</div>
            <div class="stat-label">Entidades</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">700+</div>
            <div class="stat-label">Linhas de Código</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">50+</div>
            <div class="stat-label">Endpoints API</div>
        </div>
    </div>
    
    <h2>📚 Documentações Disponíveis</h2>
    
    <blockquote>
        <strong>🎯 Bem-vindo à documentação do Sistema DoeSangue!</strong><br>
        Esta é uma coleção completa de documentos técnicos para o projeto de gerenciamento de doações de sangue.
    </blockquote>
    
    <h3>🏗️ Arquitetura e Design</h3>
    <ul>
        <li><a href="architecture.html"><strong>Arquitetura do Sistema</strong></a> - Visão geral da arquitetura, tecnologias e padrões utilizados</li>
        <li><a href="DOCUMENTACAO-ENTIDADES.html"><strong>Documentação das Entidades</strong></a> - Detalhamento completo de todas as entidades do sistema</li>
    </ul>
    
    <h3>💻 Desenvolvimento e API</h3>
    <ul>
        <li><a href="DOADOR-CONTROLLER-DOCUMENTACAO.html"><strong>Documentação do Controller</strong></a> - Exemplo completo de implementação de controller REST</li>
        <li><a href="SWAGGER-DOCUMENTACAO.html"><strong>Configuração Swagger</strong></a> - Documentação detalhada da configuração OpenAPI</li>
        <li><a href="SWAGGER-RESUMO-IMPLEMENTACAO.html"><strong>Resumo da Implementação Swagger</strong></a> - Guia prático de implementação</li>
    </ul>
    
    <h3>📋 Planejamento e Roadmap</h3>
    <ul>
        <li><a href="ROADMAP-PROXIMOS-PASSOS.html"><strong>Roadmap e Próximos Passos</strong></a> - Planejamento de desenvolvimento e melhorias</li>
        <li><a href="PLANO-ACAO-SEMANAL.html"><strong>Plano de Ação Semanal</strong></a> - Cronograma detalhado de atividades</li>
    </ul>
    
    <h2>🚀 Como Usar Esta Documentação</h2>
    
    <blockquote>
        <strong>👨‍💻 Para Desenvolvedores:</strong><br>
        Comece pela <a href="architecture.html">Arquitetura</a> para entender a estrutura geral, 
        depois veja o <a href="DOADOR-CONTROLLER-DOCUMENTACAO.html">Controller</a> para exemplos práticos.
    </blockquote>
    
    <blockquote>
        <strong>📊 Para Analistas:</strong><br>
        Foque na <a href="DOCUMENTACAO-ENTIDADES.html">Documentação das Entidades</a> e no 
        <a href="ROADMAP-PROXIMOS-PASSOS.html">Roadmap</a> para entender os requisitos e planejamento.
    </blockquote>
    
    <h2>🛠️ Tecnologias Utilizadas</h2>
    
    <table>
        <thead>
            <tr>
                <th>Categoria</th>
                <th>Tecnologia</th>
                <th>Versão</th>
                <th>Propósito</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Backend</td>
                <td>Spring Boot</td>
                <td>3.5.5</td>
                <td>Framework principal</td>
            </tr>
            <tr>
                <td>ORM</td>
                <td>JPA/Hibernate</td>
                <td>6.x</td>
                <td>Mapeamento objeto-relacional</td>
            </tr>
            <tr>
                <td>Database</td>
                <td>SQL Server</td>
                <td>2019+</td>
                <td>Banco de dados principal</td>
            </tr>
            <tr>
                <td>Security</td>
                <td>Spring Security + JWT</td>
                <td>6.x</td>
                <td>Autenticação e autorização</td>
            </tr>
            <tr>
                <td>Documentation</td>
                <td>SpringDoc OpenAPI</td>
                <td>3.0</td>
                <td>Documentação automática da API</td>
            </tr>
            <tr>
                <td>Build</td>
                <td>Maven</td>
                <td>3.9+</td>
                <td>Gerenciamento de dependências</td>
            </tr>
        </tbody>
    </table>
    
    <h2>📞 Contato e Suporte</h2>
    
    <p>Para dúvidas, sugestões ou suporte técnico:</p>
    
    <ul>
        <li><strong>Email:</strong> dev@doesangue.com.br</li>
        <li><strong>GitHub:</strong> <a href="https://github.com/nisze/doesangue_backend">github.com/nisze/doesangue_backend</a></li>
        <li><strong>Documentação API:</strong> <a href="http://localhost:8080/swagger-ui.html">localhost:8080/swagger-ui.html</a></li>
    </ul>
    \`;
    
    const finalHtml = HTML_TEMPLATE
        .replace(/{title}/g, "Documentação Completa do Sistema DoeSangue")
        .replace(/{content}/g, indexContent)
        .replace(/{date}/g, new Date().toLocaleString('pt-BR'))
        .replace(/{version}/g, "1.0");
    
    const indexFile = path.join(outputDir, 'index.html');
    await fs.writeFile(indexFile, finalHtml, 'utf-8');
    
    return indexFile;
}

async function main() {
    try {
        console.log('🚀 Iniciando conversão de documentações para HTML...');
        
        const docsDir = __dirname;
        const outputDir = path.join(docsDir, 'html');
        
        // Criar diretório de saída
        await fs.ensureDir(outputDir);
        
        console.log(\`📁 Diretório de origem: \${docsDir}\`);
        console.log(\`📁 Diretório de saída: \${outputDir}\`);
        
        // Arquivos markdown para converter
        const mdFiles = [
            'architecture.md',
            'DOCUMENTACAO-ENTIDADES.md',
            'DOADOR-CONTROLLER-DOCUMENTACAO.md',
            'PLANO-ACAO-SEMANAL.md',
            'ROADMAP-PROXIMOS-PASSOS.md',
            'SWAGGER-DOCUMENTACAO.md',
            'SWAGGER-RESUMO-IMPLEMENTACAO.md'
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
                } else {
                    console.log(\`❌ Erro ao converter: \${mdFile}\`);
                }
            } else {
                console.log(\`⚠️ Arquivo não encontrado: \${mdFile}\`);
            }
        }
        
        // Criar página índice
        console.log('📋 Criando página índice...');
        const indexFile = await createIndexPage(outputDir);
        console.log(\`✅ Criado: \${path.basename(indexFile)}\`);
        
        // Resumo final
        console.log(\`\\n🎉 Conversão concluída!\`);
        console.log(\`📊 \${convertedFiles.length} arquivos convertidos com sucesso\`);
        console.log(\`🌐 Arquivos HTML salvos em: \${outputDir}\`);
        console.log(\`🏠 Abra o arquivo: \${indexFile}\`);
        
        return outputDir;
        
    } catch (error) {
        console.error('❌ Erro durante a conversão:', error.message);
        process.exit(1);
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { main, convertMdToHtml, createIndexPage };
