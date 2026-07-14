import { Request, Response } from 'express';
import { getDB } from '../config/db.js';

export async function createRequest(req: Request, res: Response): Promise<void> {
  const {
    name,
    mobile,
    instagram,
    request_type,
    idea_title,
    idea_description,
    preferred_date,
    preferred_time,
    video_duration,
    additional_note
  } = req.body;

  // Server-side validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ error: 'Full Name is required.' });
    return;
  }

  // Mobile number must contain only digits (can contain spaces or optional + prefix, but prompt says "must contain only digits")
  // Let's strip spaces/dashes and verify it is non-empty and has only digits
  if (!mobile || typeof mobile !== 'string') {
    res.status(400).json({ error: 'Mobile Number is required.' });
    return;
  }
  const cleanMobile = mobile.replace(/[\s\-\+\(\)]/g, ''); // Let's allow formatting helper chars like +, (), -, spaces but enforce numeric body
  const isOnlyDigits = /^\d+$/.test(cleanMobile);
  if (!isOnlyDigits || cleanMobile.length < 5) {
    res.status(400).json({ error: 'Phone number must contain only digits (e.g. 919999999999).' });
    return;
  }

  if (!instagram || typeof instagram !== 'string' || instagram.trim() === '') {
    res.status(400).json({ error: 'Instagram username cannot be empty.' });
    return;
  }

  const validTypes = ['Collaboration', 'Promotion', 'Brand Partnership', 'AI Video Idea', 'Content Suggestion', 'Other'];
  if (!request_type || !validTypes.includes(request_type)) {
    res.status(400).json({ error: 'Please select a valid Type of Request.' });
    return;
  }

  if (!idea_title || typeof idea_title !== 'string' || idea_title.trim() === '') {
    res.status(400).json({ error: 'Idea title cannot be empty.' });
    return;
  }

  if (!idea_description || typeof idea_description !== 'string' || idea_description.trim() === '') {
    res.status(400).json({ error: 'Describe Your Idea is required.' });
    return;
  }

  try {
    const db = await getDB();

    const sql = `
      INSERT INTO collaboration_requests (
        name, mobile, instagram, request_type,
        idea_title, idea_description, preferred_date, preferred_time,
        video_duration, additional_note, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const params = [
      name.trim(),
      mobile.trim(),
      instagram.trim(),
      request_type,
      idea_title.trim(),
      idea_description.trim(),
      preferred_date && typeof preferred_date === 'string' && preferred_date.trim() !== '' ? preferred_date.trim() : null,
      preferred_time && typeof preferred_time === 'string' && preferred_time.trim() !== '' ? preferred_time.trim() : null,
      video_duration !== undefined && video_duration !== null && video_duration !== '' ? parseInt(String(video_duration), 10) : null,
      additional_note ? additional_note.trim() : null
    ];

    const result = await db.execute(sql, params);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your idea has been submitted successfully. I will review it soon.',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Error in createRequest controller:', error);
    res.status(500).json({ error: 'Failed to submit collaboration request.' });
  }
}

export async function getRequests(req: Request, res: Response): Promise<void> {
  const search = req.query.search ? `%${req.query.search}%` : null;
  const status = req.query.status as string;

  try {
    const db = await getDB();

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (search) {
      whereClauses.push('(name LIKE ? OR instagram LIKE ? OR idea_title LIKE ? OR idea_description LIKE ?)');
      params.push(search, search, search, search);
    }

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Retrieve all requests sorted by Date Newest First
    const selectSql = `
      SELECT * FROM collaboration_requests 
      ${whereSql} 
      ORDER BY created_at DESC
    `;

    const requests = await db.query(selectSql, params);

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error in getRequests controller:', error);
    res.status(500).json({ error: 'Failed to retrieve collaboration requests' });
  }
}

export async function getRequestDetails(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid request ID' });
    return;
  }

  try {
    const db = await getDB();
    const requests = await db.query('SELECT * FROM collaboration_requests WHERE id = ?', [id]);

    if (requests.length === 0) {
      res.status(404).json({ error: 'Collaboration request not found' });
      return;
    }

    res.json({
      success: true,
      data: requests[0]
    });
  } catch (error) {
    console.error('Error in getRequestDetails controller:', error);
    res.status(500).json({ error: 'Failed to retrieve request details' });
  }
}

export async function updateRequestStatus(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);
  const { status, additional_note } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid request ID' });
    return;
  }

  try {
    const db = await getDB();
    
    if (status !== undefined) {
      const validStatuses = ['pending', 'reviewed', 'completed'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        return;
      }

      const result = await db.execute(
        'UPDATE collaboration_requests SET status = ? WHERE id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Collaboration request not found' });
        return;
      }
    }

    if (additional_note !== undefined) {
      const result = await db.execute(
        'UPDATE collaboration_requests SET additional_note = ? WHERE id = ?',
        [additional_note || '', id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Collaboration request not found' });
        return;
      }
    }

    res.json({
      success: true,
      message: `Request updated successfully`
    });
  } catch (error) {
    console.error('Error in updateRequestStatus controller:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
}

export async function deleteRequest(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid request ID' });
    return;
  }

  try {
    const db = await getDB();
    const result = await db.execute('DELETE FROM collaboration_requests WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Collaboration request not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Collaboration request deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteRequest controller:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
}

export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const db = await getDB();

    const counts = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM collaboration_requests 
      GROUP BY status
    `);

    const stats = {
      total: 0,
      pending: 0,
      reviewed: 0,
      completed: 0
    };

    counts.forEach((row: any) => {
      const cnt = parseInt(row.count);
      stats.total += cnt;
      if (row.status === 'pending') stats.pending = cnt;
      else if (row.status === 'reviewed') stats.reviewed = cnt;
      else if (row.status === 'completed') stats.completed = cnt;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getStats controller:', error);
    res.status(500).json({ error: 'Failed to load dashboard statistics' });
  }
}
