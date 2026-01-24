import { Router } from 'express';
import { db } from '../db/database.js';
import type { User, CreateUserInput, UpdateUserInput } from '../types/index.js';

const router = Router();

// Create or login user
router.post('/', (req, res) => {
  try {
    const { username, display_name, blog_url } = req.body as CreateUserInput;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const normalizedUsername = username.toLowerCase().trim();

    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(normalizedUsername) as User | undefined;

    if (existingUser) {
      return res.json(existingUser);
    }

    // Create new user
    const result = db.prepare(
      'INSERT INTO users (username, display_name, blog_url) VALUES (?, ?, ?)'
    ).run(normalizedUsername, display_name || null, blog_url || null);

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as User;

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by username
router.get('/:username', (req, res) => {
  try {
    const { username } = req.params;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.toLowerCase()) as User | undefined;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get response count and completed topics
    const responseCount = db.prepare(
      'SELECT COUNT(*) as count FROM responses WHERE user_id = ?'
    ).get(user.id) as { count: number };

    const completedTopics = db.prepare(`
      SELECT DISTINCT t.id, t.name
      FROM topics t
      JOIN questions q ON q.topic_id = t.id
      JOIN responses r ON r.question_id = q.id
      WHERE r.user_id = ?
    `).all(user.id);

    res.json({
      ...user,
      response_count: responseCount.count,
      completed_topics: completedTopics
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.patch('/:username', (req, res) => {
  try {
    const { username } = req.params;
    const { display_name, blog_url } = req.body as UpdateUserInput;

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.toLowerCase()) as User | undefined;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare(
      'UPDATE users SET display_name = ?, blog_url = ? WHERE id = ?'
    ).run(
      display_name !== undefined ? display_name : user.display_name,
      blog_url !== undefined ? blog_url : user.blog_url,
      user.id
    );

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as User;

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// List all users (for finding people to compare with)
router.get('/', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT u.*, COUNT(r.id) as response_count
      FROM users u
      LEFT JOIN responses r ON r.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all();

    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

export default router;
