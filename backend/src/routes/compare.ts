import { Router } from 'express';
import { db } from '../db/database.js';
import { findCommonGround } from '../services/openai.js';
import type { User, ResponseWithQuestion } from '../types/index.js';

const router = Router();

// Compare two users
router.post('/', async (req, res) => {
  try {
    const { user1_id, user2_id } = req.body;

    if (!user1_id || !user2_id) {
      return res.status(400).json({ error: 'Both user IDs are required' });
    }

    if (user1_id === user2_id) {
      return res.status(400).json({ error: 'Cannot compare a user with themselves' });
    }

    // Get both users
    const user1 = db.prepare('SELECT * FROM users WHERE id = ?').get(user1_id) as User | undefined;
    const user2 = db.prepare('SELECT * FROM users WHERE id = ?').get(user2_id) as User | undefined;

    if (!user1 || !user2) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Get responses for both users
    const user1Responses = db.prepare(`
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
    `).all(user1_id) as ResponseWithQuestion[];

    const user2Responses = db.prepare(`
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
    `).all(user2_id) as ResponseWithQuestion[];

    // Find questions both users have answered
    const user2ResponseMap = new Map(
      user2Responses.map(r => [r.question_id, r])
    );

    const sharedResponses: {
      question_id: number;
      question_text: string;
      topic_name: string;
      user1_answer: string;
      user2_answer: string;
    }[] = [];

    for (const r1 of user1Responses) {
      const r2 = user2ResponseMap.get(r1.question_id);
      if (r2) {
        sharedResponses.push({
          question_id: r1.question_id,
          question_text: r1.question_text,
          topic_name: r1.topic_name,
          user1_answer: r1.answer,
          user2_answer: r2.answer
        });
      }
    }

    if (sharedResponses.length === 0) {
      return res.json({
        user1,
        user2,
        shared_questions: 0,
        message: 'No shared questions answered. Both users need to complete some of the same survey topics.'
      });
    }

    // Categorize agreements and disagreements
    const agreements: typeof sharedResponses = [];
    const disagreements: typeof sharedResponses = [];

    for (const sr of sharedResponses) {
      if (sr.user1_answer === sr.user2_answer) {
        agreements.push(sr);
      } else {
        disagreements.push(sr);
      }
    }

    // Get AI analysis
    let aiAnalysis = null;
    try {
      aiAnalysis = await findCommonGround(user1, user2, sharedResponses);
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      // Continue without AI analysis
    }

    res.json({
      user1,
      user2,
      shared_questions: sharedResponses.length,
      agreements,
      disagreements,
      ai_analysis: aiAnalysis
    });
  } catch (error) {
    console.error('Error comparing users:', error);
    res.status(500).json({ error: 'Failed to compare users' });
  }
});

export default router;
