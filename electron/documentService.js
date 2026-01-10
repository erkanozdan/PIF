const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow } = require('docx');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class DocumentService {
  // Word belgesi oluştur
  async createWordDocument(content, filePath) {
    try {
      const sections = this.parseContent(content);
      const docChildren = [];

      for (const section of sections) {
        if (section.type === 'heading') {
          docChildren.push(
            new Paragraph({
              text: section.text,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 240, after: 120 }
            })
          );
        } else if (section.type === 'paragraph') {
          docChildren.push(
            new Paragraph({
              children: [new TextRun(section.text)],
              spacing: { before: 120, after: 120 }
            })
          );
        } else if (section.type === 'list') {
          for (const item of section.items) {
            docChildren.push(
              new Paragraph({
                text: `• ${item}`,
                spacing: { before: 60, after: 60 }
              })
            );
          }
        } else if (section.type === 'table') {
          const table = new Table({
            rows: section.rows.map(row =>
              new TableRow({
                children: row.map(cell =>
                  new TableCell({
                    children: [new Paragraph(cell)]
                  })
                )
              })
            )
          });
          docChildren.push(table);
        }
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren
        }]
      });

      const Packer = require('docx').Packer;
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(filePath, buffer);

      return { success: true, path: filePath };
    } catch (error) {
      console.error('Word document error:', error);
      return { success: false, error: error.message };
    }
  }

  // Excel belgesi oluştur
  async createExcelDocument(content, filePath) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sayfa1');

      const sections = this.parseContent(content);

      let currentRow = 1;

      for (const section of sections) {
        if (section.type === 'heading') {
          const row = worksheet.getRow(currentRow);
          row.getCell(1).value = section.text;
          row.getCell(1).font = { bold: true, size: 16 };
          row.height = 30;
          currentRow += 2;
        } else if (section.type === 'paragraph') {
          const row = worksheet.getRow(currentRow);
          row.getCell(1).value = section.text;
          row.alignment = { wrapText: true, vertical: 'top' };
          currentRow += 2;
        } else if (section.type === 'list') {
          for (const item of section.items) {
            const row = worksheet.getRow(currentRow);
            row.getCell(1).value = `• ${item}`;
            currentRow++;
          }
          currentRow++;
        } else if (section.type === 'table') {
          // Tablo başlıkları
          const headerRow = worksheet.getRow(currentRow);
          section.rows[0].forEach((cell, idx) => {
            headerRow.getCell(idx + 1).value = cell;
            headerRow.getCell(idx + 1).font = { bold: true };
            headerRow.getCell(idx + 1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE0E0E0' }
            };
          });
          currentRow++;

          // Tablo verileri
          for (let i = 1; i < section.rows.length; i++) {
            const dataRow = worksheet.getRow(currentRow);
            section.rows[i].forEach((cell, idx) => {
              dataRow.getCell(idx + 1).value = cell;
            });
            currentRow++;
          }
          currentRow++;
        }
      }

      // Sütun genişliklerini ayarla
      worksheet.columns.forEach(column => {
        column.width = 30;
      });

      await workbook.xlsx.writeFile(filePath);

      return { success: true, path: filePath };
    } catch (error) {
      console.error('Excel document error:', error);
      return { success: false, error: error.message };
    }
  }

  // PDF belgesi oluştur
  async createPDFDocument(content, filePath) {
    return new Promise((resolve) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        const sections = this.parseContent(content);

        for (const section of sections) {
          if (section.type === 'heading') {
            doc.fontSize(18).font('Helvetica-Bold').text(section.text, { lineGap: 10 });
            doc.moveDown();
          } else if (section.type === 'paragraph') {
            doc.fontSize(12).font('Helvetica').text(section.text, { align: 'justify', lineGap: 5 });
            doc.moveDown();
          } else if (section.type === 'list') {
            for (const item of section.items) {
              doc.fontSize(12).font('Helvetica').text(`• ${item}`, { indent: 20, lineGap: 3 });
            }
            doc.moveDown();
          } else if (section.type === 'table') {
            // Basit tablo çizimi
            const startY = doc.y;
            const cellPadding = 5;
            const cellWidth = 150;
            const cellHeight = 25;

            section.rows.forEach((row, rowIndex) => {
              let x = 50;
              const y = startY + (rowIndex * cellHeight);

              row.forEach((cell, colIndex) => {
                // Hücre çerçevesi
                doc.rect(x, y, cellWidth, cellHeight).stroke();

                // Hücre metni
                doc.fontSize(10).text(cell, x + cellPadding, y + cellPadding, {
                  width: cellWidth - (cellPadding * 2),
                  height: cellHeight - (cellPadding * 2),
                  align: 'left'
                });

                x += cellWidth;
              });
            });

            doc.y = startY + (section.rows.length * cellHeight) + 20;
          }
        }

        doc.end();

        stream.on('finish', () => {
          resolve({ success: true, path: filePath });
        });

        stream.on('error', (error) => {
          resolve({ success: false, error: error.message });
        });
      } catch (error) {
        console.error('PDF document error:', error);
        resolve({ success: false, error: error.message });
      }
    });
  }

  // İçeriği parse et
  parseContent(content) {
    const sections = [];
    const lines = content.split('\n');
    let currentList = null;
    let currentTable = null;

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        if (currentList) {
          sections.push({ type: 'list', items: currentList });
          currentList = null;
        }
        if (currentTable) {
          sections.push({ type: 'table', rows: currentTable });
          currentTable = null;
        }
        continue;
      }

      // Başlık kontrolü
      if (trimmed.startsWith('# ')) {
        if (currentList) {
          sections.push({ type: 'list', items: currentList });
          currentList = null;
        }
        sections.push({ type: 'heading', text: trimmed.substring(2) });
      }
      // Liste öğesi kontrolü
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) {
        const item = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
        if (!currentList) currentList = [];
        currentList.push(item);
      }
      // Tablo satırı kontrolü
      else if (trimmed.includes('|')) {
        const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
        if (!currentTable) currentTable = [];
        currentTable.push(cells);
      }
      // Normal paragraf
      else {
        if (currentList) {
          sections.push({ type: 'list', items: currentList });
          currentList = null;
        }
        if (currentTable) {
          sections.push({ type: 'table', rows: currentTable });
          currentTable = null;
        }
        sections.push({ type: 'paragraph', text: trimmed });
      }
    }

    // Kalan liste veya tabloyu ekle
    if (currentList) {
      sections.push({ type: 'list', items: currentList });
    }
    if (currentTable) {
      sections.push({ type: 'table', rows: currentTable });
    }

    return sections;
  }
}

module.exports = new DocumentService();
