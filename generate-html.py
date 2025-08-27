#!/usr/bin/env python3
"""
Gerador de Documentação HTML para o Projeto DoeSangue
Converte arquivos Markdown em HTML com formatação profissional
"""

import os
import markdown
from pathlib import Path
import re
from datetime import datetime

# Template HTML base
HTML_TEMPLATE = """
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
        
        /* Alerts */
        .alert {
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .alert.info {
            background: #d1ecf1;
            border-color: #3498db;
            color: #0c5460;
        }
        
        .alert.success {
            background: #d4edda;
            border-color: #27ae60;
            color: #155724;
        }
        
        .alert.warning {
            background: #fff3cd;
            border-color: #f39c12;
            color: #856404;
        }
        
        .alert.danger {
            background: #f8d7da;
            border-color: #e74c3c;
            color: #721c24;
        }
        
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
        
        /* Print styles */
        @media print {
            body {
                background: white;
            }
            
            .container {
                box-shadow: none;
                margin: 0;
                padding: 0;
            }
            
            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
            }
        }
        
        /* Syntax highlighting */
        .highlight {
            background: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
        }
        
        /* Emoji support */
        .emoji {
            font-size: 1.2em;
            margin-right: 5px;
        }
        
        /* Custom classes for specific content */
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
"""

def extract_title_from_markdown(content):
    """Extrai o título principal do markdown"""
    lines = content.split('\n')
    for line in lines:
        if line.startswith('# '):
            return line[2:].strip()
    return "Documentação DoeSangue"

def enhance_markdown(content):
    """Melhora o markdown com elementos HTML customizados"""
    # Converter emojis e badges
    content = re.sub(r'✅', '<span class="badge success">✅</span>', content)
    content = re.sub(r'❌', '<span class="badge danger">❌</span>', content)
    content = re.sub(r'🎯', '<span class="emoji">🎯</span>', content)
    content = re.sub(r'📊', '<span class="emoji">📊</span>', content)
    content = re.sub(r'🚀', '<span class="emoji">🚀</span>', content)
    
    # Converter alertas
    content = re.sub(r'\*\*IMPORTANTE:\*\*', '<div class="alert warning"><strong>⚠️ IMPORTANTE:</strong>', content)
    content = re.sub(r'\*\*NOTA:\*\*', '<div class="alert info"><strong>ℹ️ NOTA:</strong>', content)
    
    return content

def convert_md_to_html(md_file_path, output_dir):
    """Converte um arquivo Markdown para HTML"""
    try:
        # Ler arquivo markdown
        with open(md_file_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Extrair título
        title = extract_title_from_markdown(md_content)
        
        # Melhorar markdown
        enhanced_md = enhance_markdown(md_content)
        
        # Converter para HTML
        html_content = markdown.markdown(
            enhanced_md,
            extensions=['tables', 'codehilite', 'toc', 'fenced_code'],
            extension_configs={
                'codehilite': {
                    'css_class': 'highlight',
                    'use_pygments': False
                }
            }
        )
        
        # Aplicar template
        final_html = HTML_TEMPLATE.format(
            title=title,
            content=html_content,
            date=datetime.now().strftime("%d/%m/%Y às %H:%M"),
            version="1.0"
        )
        
        # Salvar arquivo HTML
        output_file = output_dir / f"{Path(md_file_path).stem}.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_html)
        
        return output_file
        
    except Exception as e:
        print(f"Erro ao converter {md_file_path}: {str(e)}")
        return None

def create_index_page(output_dir):
    """Cria página índice com links para todas as documentações"""
    index_content = """
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
    
    <div class="alert info">
        <strong>🎯 Bem-vindo à documentação do Sistema DoeSangue!</strong><br>
        Esta é uma coleção completa de documentos técnicos para o projeto de gerenciamento de doações de sangue.
    </div>
    
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
    
    <div class="alert success">
        <strong>👨‍💻 Para Desenvolvedores:</strong><br>
        Comece pela <a href="architecture.html">Arquitetura</a> para entender a estrutura geral, 
        depois veja o <a href="DOADOR-CONTROLLER-DOCUMENTACAO.html">Controller</a> para exemplos práticos.
    </div>
    
    <div class="alert info">
        <strong>📊 Para Analistas:</strong><br>
        Foque na <a href="DOCUMENTACAO-ENTIDADES.html">Documentação das Entidades</a> e no 
        <a href="ROADMAP-PROXIMOS-PASSOS.html">Roadmap</a> para entender os requisitos e planejamento.
    </div>
    
    <div class="alert warning">
        <strong>🎯 Para Gestores:</strong><br>
        Consulte o <a href="PLANO-ACAO-SEMANAL.html">Plano de Ação</a> para acompanhar o progresso 
        e os marcos do projeto.
    </div>
    
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
    """
    
    final_html = HTML_TEMPLATE.format(
        title="Documentação Completa do Sistema DoeSangue",
        content=index_content,
        date=datetime.now().strftime("%d/%m/%Y às %H:%M"),
        version="1.0"
    )
    
    index_file = output_dir / "index.html"
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    return index_file

def main():
    """Função principal para converter todas as documentações"""
    # Diretórios
    docs_dir = Path(__file__).parent
    output_dir = docs_dir / "html"
    output_dir.mkdir(exist_ok=True)
    
    print("🚀 Iniciando conversão de documentações para HTML...")
    print(f"📁 Diretório de origem: {docs_dir}")
    print(f"📁 Diretório de saída: {output_dir}")
    
    # Arquivos markdown para converter
    md_files = [
        "architecture.md",
        "DOCUMENTACAO-ENTIDADES.md", 
        "DOADOR-CONTROLLER-DOCUMENTACAO.md",
        "PLANO-ACAO-SEMANAL.md",
        "ROADMAP-PROXIMOS-PASSOS.md",
        "SWAGGER-DOCUMENTACAO.md",
        "SWAGGER-RESUMO-IMPLEMENTACAO.md"
    ]
    
    converted_files = []
    
    # Converter cada arquivo
    for md_file in md_files:
        md_path = docs_dir / md_file
        if md_path.exists():
            print(f"📄 Convertendo {md_file}...")
            html_file = convert_md_to_html(md_path, output_dir)
            if html_file:
                converted_files.append(html_file)
                print(f"✅ Criado: {html_file.name}")
            else:
                print(f"❌ Erro ao converter: {md_file}")
        else:
            print(f"⚠️ Arquivo não encontrado: {md_file}")
    
    # Criar página índice
    print("📋 Criando página índice...")
    index_file = create_index_page(output_dir)
    print(f"✅ Criado: {index_file.name}")
    
    # Resumo final
    print(f"\n🎉 Conversão concluída!")
    print(f"📊 {len(converted_files)} arquivos convertidos com sucesso")
    print(f"🌐 Arquivos HTML salvos em: {output_dir}")
    print(f"🏠 Abra o arquivo: {index_file}")
    
    return output_dir

if __name__ == "__main__":
    main()
