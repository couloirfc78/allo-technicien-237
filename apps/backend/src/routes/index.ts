import { Router, Request, Response } from 'express';
import { sendResponse } from '../utils/errors';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  sendResponse(res, 200, { status: 'OK' }, 'Server is healthy');
});

router.get('/', (req: Request, res: Response) => {
  sendResponse(res, 200, { api: 'Allo Technicien 237 API', version: '1.0.0' });
});

export default router;
