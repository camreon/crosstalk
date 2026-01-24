import { Router } from 'express';
import { db } from '../db/database.js';
import type { Topic, Question, QuestionWithParsedOptions } from '../types/index.js';

const router = Router();

// Get all topics
router.get('/', (req, res) => {
  try {
    const topics = db.prepare('SELECT * FROM topics ORDER BY sort_order').all() as Topic[];

    // Get question count for each topic
    const topicsWithCounts = topics.map(topic => {
      const questionCount = db.prepare(
        'SELECT COUNT(*) as count FROM questions WHERE topic_id = ?'
      ).get(topic.id) as { count: number };

      return {
        ...topic,
        question_count: questionCount.count
      };
    });

    res.json(topicsWithCounts);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get single topic
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(id) as Topic | undefined;

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// Get questions for a topic
router.get('/:id/questions', (req, res) => {
  try {
    const { id } = req.params;

    const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(id) as Topic | undefined;

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const questions = db.prepare(
      'SELECT * FROM questions WHERE topic_id = ? ORDER BY sort_order'
    ).all(id) as Question[];

    // Parse options JSON for each question
    const parsedQuestions: QuestionWithParsedOptions[] = questions.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null
    }));

    res.json({
      topic,
      questions: parsedQuestions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get user's progress on a topic
router.get('/:id/progress/:userId', (req, res) => {
  try {
    const { id, userId } = req.params;

    const totalQuestions = db.prepare(
      'SELECT COUNT(*) as count FROM questions WHERE topic_id = ?'
    ).get(id) as { count: number };

    const answeredQuestions = db.prepare(`
      SELECT COUNT(*) as count FROM responses r
      JOIN questions q ON q.id = r.question_id
      WHERE q.topic_id = ? AND r.user_id = ?
    `).get(id, userId) as { count: number };

    res.json({
      topic_id: parseInt(id),
      total: totalQuestions.count,
      answered: answeredQuestions.count,
      complete: answeredQuestions.count === totalQuestions.count
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
