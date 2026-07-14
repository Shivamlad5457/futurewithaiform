import { Router } from 'express';
import { login, verifyToken } from '../controllers/auth.js';
import {
  createRequest,
  getRequests,
  getRequestDetails,
  updateRequestStatus,
  deleteRequest,
  getStats
} from '../controllers/collaboration.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Public Routes
router.post('/auth/login', login);
router.post('/request', createRequest); // Exactly POST /api/request

// Protected Admin Routes (Require JWT)
router.get('/auth/verify', authMiddleware, verifyToken);
router.get('/admin/requests', authMiddleware, getRequests); // Exactly GET /api/admin/requests
router.get('/admin/request/:id', authMiddleware, getRequestDetails); // Exactly GET /api/admin/request/:id
router.delete('/admin/request/:id', authMiddleware, deleteRequest); // Exactly DELETE /api/admin/request/:id
router.patch('/admin/request/:id', authMiddleware, updateRequestStatus); // Exactly PATCH /api/admin/request/:id
router.get('/admin/stats', authMiddleware, getStats);

export default router;
