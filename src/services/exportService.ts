import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';
import { LessonPlanDocument } from '../types/lessonPlan';

export class ExportService {
  /**
   * Generates and downloads a real, fully editable Microsoft Word (.docx) file.
   */
  public static async exportToWord(doc: LessonPlanDocument): Promise<void> {
    const filename = `Grade${doc.header.grade}_Unit${doc.header.unitNumber}_Lesson${doc.header.lessonNumber}_LessonPlan.docx`;

    // Font settings
    const mainFont = 'Times New Roman';

    // 1. Header Block (2-column table layout without borders)
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: doc.header.governingBody.toUpperCase(), bold: true, size: 22, font: mainFont }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: doc.header.schoolName.toUpperCase(), bold: true, size: 22, font: mainFont }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: `Teacher: ${doc.header.teacherName}`, italics: true, size: 24, font: mainFont }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Title Paragraphs
    const titleParagraph = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: `LESSON PLAN GRADE ${doc.header.grade} – GLOBAL SUCCESS`,
          bold: true,
          size: 28,
          font: mainFont,
          color: '1E3A8A',
        }),
      ],
    });

    const subTitleParagraph = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `UNIT ${doc.header.unitNumber}: ${doc.header.unitTitle.toUpperCase()} - LESSON ${doc.header.lessonNumber}`,
          bold: true,
          size: 26,
          font: mainFont,
        }),
        new TextRun({
          text: `\nPeriod: ${doc.header.period} | Duration: ${doc.header.durationMinutes} minutes`,
          italics: true,
          size: 24,
          font: mainFont,
        }),
      ],
    });

    // Section I: OBJECTIVES
    const sectionIHeader = new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: 'I. OBJECTIVES', bold: true, size: 26, font: mainFont })],
    });

    const objectivesContent: Paragraph[] = [
      new Paragraph({
        children: [new TextRun({ text: 'By the end of the lesson, pupils are able to:', italics: true, size: 24, font: mainFont })],
      }),
      new Paragraph({
        spacing: { before: 100 },
        children: [new TextRun({ text: '1. Language Knowledge & Skills', bold: true, size: 24, font: mainFont })],
      }),
      new Paragraph({
        children: [new TextRun({ text: 'a. Language Knowledge:', bold: true, italics: true, size: 24, font: mainFont })],
      }),
    ];

    // Vocabulary
    if (doc.objectives.languageKnowledge.vocabulary.length > 0) {
      objectivesContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: '• Vocabulary: ', bold: true, size: 24, font: mainFont }),
            new TextRun({
              text: doc.objectives.languageKnowledge.vocabulary
                .map((v) => `${v.word}${v.pronunciation ? ' ' + v.pronunciation : ''} (${v.meaning})`)
                .join('; '),
              size: 24,
              font: mainFont,
            }),
          ],
        })
      );
    }

    // Sentence Patterns
    if (doc.objectives.languageKnowledge.sentencePatterns.length > 0) {
      objectivesContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: '• Sentence Patterns: ', bold: true, size: 24, font: mainFont }),
            new TextRun({
              text: doc.objectives.languageKnowledge.sentencePatterns.map((p) => p.pattern).join('; '),
              size: 24,
              font: mainFont,
            }),
          ],
        })
      );
    }

    // Language Skills
    objectivesContent.push(
      new Paragraph({
        spacing: { before: 100 },
        children: [new TextRun({ text: 'b. Language Skills:', bold: true, italics: true, size: 24, font: mainFont })],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Listening, Speaking, Reading, and Writing integrated. Thereby contributing to the development of pupils\' general competences and qualities such as autonomy, communication and cooperation.',
            size: 24,
            font: mainFont,
          }),
        ],
      })
    );

    // Integrations
    if (doc.objectives.integrations && doc.objectives.integrations.length > 0) {
      objectivesContent.push(
        new Paragraph({
          spacing: { before: 100 },
          children: [new TextRun({ text: '2. Integration:', bold: true, size: 24, font: mainFont })],
        })
      );
      doc.objectives.integrations.forEach((item) => {
        objectivesContent.push(
          new Paragraph({
            children: [
              new TextRun({ text: `• [${item.category}] ${item.title}: `, bold: true, size: 24, font: mainFont }),
              new TextRun({ text: item.description, size: 24, font: mainFont }),
            ],
          })
        );
      });
    }

    // Section II: TEACHING AIDS
    const sectionIIHeader = new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: 'II. TEACHING AIDS AND LEARNING MATERIALS', bold: true, size: 26, font: mainFont })],
    });

    const aidsContent = [
      new Paragraph({
        children: [
          new TextRun({ text: '• Teacher: ', bold: true, size: 24, font: mainFont }),
          new TextRun({ text: doc.teachingAids.teacherEquipment.join(', '), size: 24, font: mainFont }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '• Pupils: ', bold: true, size: 24, font: mainFont }),
          new TextRun({ text: doc.teachingAids.pupilEquipment.join(', '), size: 24, font: mainFont }),
        ],
      }),
    ];

    // Section III: TEACHING PROCEDURES (3 Columns Table)
    const sectionIIIHeader = new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: 'III. TEACHING PROCEDURES', bold: true, size: 26, font: mainFont })],
    });

    // Create 3-column Procedure Table
    const tableHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          shading: { fill: 'F1F5F9' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'LEARNING ACTIVITIES', bold: true, size: 22, font: mainFont })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { fill: 'F1F5F9' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'EXPECTED OUTCOMES & EVIDENCE OF INTEGRATION',
                  bold: true,
                  size: 22,
                  font: mainFont,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: 'F1F5F9' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'POST-LESSON ADJUSTMENTS', bold: true, size: 22, font: mainFont })],
            }),
          ],
        }),
      ],
    });

    const stageTableRows = doc.procedures.stages.map((stage) => {
      const teacherActivityPars = stage.teacherActivities.map(
        (ta) => new Paragraph({ children: [new TextRun({ text: `• Teacher: ${ta}`, size: 22, font: mainFont })] })
      );
      const pupilActivityPars = stage.pupilActivities.map(
        (pa) => new Paragraph({ children: [new TextRun({ text: `• Pupils: ${pa}`, size: 22, font: mainFont })] })
      );
      const outcomePars = stage.expectedOutcomes.map(
        (eo) => new Paragraph({ children: [new TextRun({ text: `• ${eo}`, size: 22, font: mainFont })] })
      );

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 100, after: 50 },
                children: [
                  new TextRun({
                    text: `${stage.stageName} (${stage.durationMinutes} mins)`,
                    bold: true,
                    size: 24,
                    font: mainFont,
                    color: '1D4ED8',
                  }),
                ],
              }),
              ...teacherActivityPars,
              ...pupilActivityPars,
            ],
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            children: outcomePars,
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: stage.postLessonAdjustments || '—', size: 22, font: mainFont })],
              }),
            ],
          }),
        ],
      });
    });

    const procedureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [tableHeaderRow, ...stageTableRows],
    });

    // Post-Lesson Reflection
    const reflectionHeader = new Paragraph({
      spacing: { before: 200, after: 50 },
      children: [new TextRun({ text: 'Post-lesson Reflection:', bold: true, size: 24, font: mainFont })],
    });
    const reflectionBody = new Paragraph({
      children: [new TextRun({ text: doc.postLessonReflection || 'None.', italics: true, size: 24, font: mainFont })],
    });

    // Signatures Area
    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 300 },
                  children: [new TextRun({ text: doc.signatures.schoolAdminRole, bold: true, size: 24, font: mainFont })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 800 },
                  children: [new TextRun({ text: doc.signatures.schoolAdminName, bold: true, size: 24, font: mainFont })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 300 },
                  children: [new TextRun({ text: doc.signatures.headTeacherRole, bold: true, size: 24, font: mainFont })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 800 },
                  children: [new TextRun({ text: doc.signatures.headTeacherName, bold: true, size: 24, font: mainFont })],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Create Document Container
    const wordDocument = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1134, // 20mm
                bottom: 1134,
                left: 1417, // 25mm
                right: 1134,
              },
            },
          },
          children: [
            headerTable,
            titleParagraph,
            subTitleParagraph,
            sectionIHeader,
            ...objectivesContent,
            sectionIIHeader,
            ...aidsContent,
            sectionIIIHeader,
            procedureTable,
            reflectionHeader,
            reflectionBody,
            signatureTable,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(wordDocument);
    saveAs(blob, filename);
  }

  /**
   * Triggers native browser print formatted specifically for A4 PDF export.
   */
  public static exportToPDF(): void {
    window.print();
  }
}
