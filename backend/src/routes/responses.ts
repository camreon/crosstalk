import { Router } from 'express';
import { db } from '../db/database.js';
import type { Response, ResponseWithQuestion, SaveResponseInput } from '../types/index.js';

const router = Router();

// Save responses (batch)
router.post('/', (req, res) => {
  try {
    const responses = req.body as SaveResponseInput[];

    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'Responses array is required' });
    }

    const insertOrUpdate = db.prepare(`
      INSERT INTO responses (user_id, question_id, answer, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, question_id) 
      DO UPDATE SET answer = excluded.answer, updated_at = CURRENT_TIMESTAMP
    `);

    const insertMany = db.transaction((responses: SaveResponseInput[]) => {
      for (const r of responses) {
        insertOrUpdate.run(r.user_id, r.question_id, r.answer);
      }
    });

    insertMany(responses);

    res.json({ success: true, count: responses.length });
  } catch (error) {
    console.error('Error saving responses:', error);
    res.status(500).json({ error: 'Failed to save responses' });
  }
});

// Get user's responses
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const responses = db.prepare(`
      SELECT 
        r.*,
        q.text as question_text,
        q.question_type,
        q.topic_id,
        t.name as topic_name
      FROM responses r
      JOIN questions q ON q.id = r.question_id
      JOIN topics t ON t.id = q.topic_id
      WHERE r.user_id = ?
      ORDER BY t.sort_order, q.sort_order
    `).all(userId) as ResponseWithQuestion[];

    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get user's responses for a specific topic
router.get('/user/:userId/topic/:topicId', (req, res) => {
  try {
    const { userId, topicId } = req.params;

    const responses = db.prepare(`
      SELECT 
        r.*,
        q.text as question_text,
        q.question_type
      FROM responses r
      JOIN questions q ON q.id = r.question_id
      WHERE r.user_id = ? AND q.topic_id = ?
      ORDER BY q.sort_order
    `).all(userId, topicId) as ResponseWithQuestion[];

    res.json(responses);
  } catch (error) {
    console.error('Error fetching topic responses:', error);
    res.status(500).json({ error: 'Failed to fetch topic responses' });
  }
});

// Delete a response
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM responses WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ error: 'Failed to delete response' });
  }
});

export default router;
