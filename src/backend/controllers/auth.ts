import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'creator_collaboration_hub_secret_key_2026';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    const db = await getDB();
    const admins = await db.query('SELECT * FROM admins WHERE username = ?', [username]);

    if (admins.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({ error: 'An unexpected server error occurred' });
  }
}

export async function verifyToken(req: Request, res: Response): Promise<void> {
  // If request got past auth middleware, token is valid
  res.json({ success: true, admin: (req as any).admin });
}
