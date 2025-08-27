const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');

async function generatePDFFromHTML(htmlFile, outputDir) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Ler o arquivo HTML
        const htmlPath = `file://${htmlFile}`;
        await page.goto(htmlPath, { waitUntil: 'networkidle0' });
        
        // Configurar o PDF
        const pdfName = path.basename(htmlFile, '.html') + '.pdf';
        const pdfPath = path.join(outputDir, pdfName);
        
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '15mm',
                right: '15mm'
            }
        });
        
        await browser.close();
        return pdfPath;
        
    } catch (error) {
        console.error(`Erro ao gerar PDF de ${htmlFile}: ${error.message}`);
        return null;
    }
}

async function main() {
    try {
        console.log('📄 Iniciando geração de PDFs...');
        
        const docsDir = __dirname;
        const htmlDir = path.join(docsDir, 'html');
        const pdfDir = path.join(docsDir, 'pdf');
        
        // Criar diretório PDF
        await fs.ensureDir(pdfDir);
        
        console.log(`📁 Diretório HTML: ${htmlDir}`);
        console.log(`📁 Diretório PDF: ${pdfDir}`);
        
        // Listar arquivos HTML
        const htmlFiles = await fs.readdir(htmlDir);
        const pdfFiles = [];
        
        for (const htmlFile of htmlFiles.filter(f => f.endsWith('.html'))) {
            const htmlPath = path.join(htmlDir, htmlFile);
            console.log(`📄 Gerando PDF de ${htmlFile}...`);
            
            const pdfPath = await generatePDFFromHTML(htmlPath, pdfDir);
            if (pdfPath) {
                pdfFiles.push(pdfPath);
                console.log(`✅ PDF criado: ${path.basename(pdfPath)}`);
            } else {
                console.log(`❌ Erro ao criar PDF de: ${htmlFile}`);
            }
        }
        
        console.log(`\n🎉 Geração de PDFs concluída!`);
        console.log(`📊 ${pdfFiles.length} PDFs criados com sucesso`);
        console.log(`📁 PDFs salvos em: ${pdfDir}`);
        
        return pdfDir;
        
    } catch (error) {
        console.error('❌ Erro durante a geração de PDFs:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main, generatePDFFromHTML };
