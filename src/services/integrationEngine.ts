import { LessonData, IntegrationItem } from '../types/curriculum';
import allIntegrations from '../data/integrations.json';

export class IntegrationEngine {
  /**
   * Analyzes a lesson's topic, vocabulary, and objectives to recommend relevant cross-curricular integrations.
   */
  public static recommendIntegrations(lesson: LessonData): IntegrationItem[] {
    const recommended: IntegrationItem[] = [];
    const textContent = (
      lesson.title +
      ' ' +
      lesson.unitTitle +
      ' ' +
      lesson.vocabulary.map((v) => v.word + ' ' + v.meaning).join(' ') +
      ' ' +
      lesson.sentencePatterns.map((p) => p.pattern).join(' ')
    ).toLowerCase();

    // 1. Digital & Audio Competence (If audio, listening or media mentioned)
    if (textContent.includes('listen') || textContent.includes('audio') || textContent.includes('sound') || textContent.includes('point')) {
      const dig = (allIntegrations as IntegrationItem[]).find((i) => i.category === 'Digital Competence');
      if (dig) recommended.push(dig);
    }

    // 2. Environmental Education (If nature, hometown, village, animals, playground mentioned)
    if (
      textContent.includes('hometown') ||
      textContent.includes('village') ||
      textContent.includes('mountain') ||
      textContent.includes('nature') ||
      textContent.includes('playground') ||
      textContent.includes('park')
    ) {
      const env = (allIntegrations as IntegrationItem[]).find((i) => i.category === 'Environmental Education');
      if (env) recommended.push(env);
    }

    // 3. Ethics & Polite Greetings (If greetings, friends, hello, goodbye mentioned)
    if (textContent.includes('hello') || textContent.includes('friend') || textContent.includes('hi') || textContent.includes('address')) {
      const eth = (allIntegrations as IntegrationItem[]).find((i) => i.category === 'Ethics');
      if (eth) recommended.push(eth);
    }

    // 4. STEM (If numbers, shapes, sorting, counting, maps mentioned)
    if (textContent.includes('map') || textContent.includes('lane') || textContent.includes('street') || textContent.includes('flat')) {
      const stem = (allIntegrations as IntegrationItem[]).find((i) => i.category === 'STEM');
      if (stem) recommended.push(stem);
    }

    // 5. Life Skills (Always recommended for primary pairwork/groupwork)
    const life = (allIntegrations as IntegrationItem[]).find((i) => i.category === 'Life Skills');
    if (life && !recommended.some((r) => r.id === life.id)) {
      recommended.push(life);
    }

    // Include any custom lesson specific candidates if provided
    if (lesson.integrationCandidates && lesson.integrationCandidates.length > 0) {
      lesson.integrationCandidates.forEach((cand) => {
        if (!recommended.some((r) => r.id === cand.id)) {
          recommended.push(cand);
        }
      });
    }

    return recommended;
  }
}
