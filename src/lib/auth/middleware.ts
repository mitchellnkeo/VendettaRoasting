import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const withAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // TODO: Implement proper JWT token validation
      // For now, we'll simulate authentication check
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // TODO: Validate JWT token and get user data
      // For now, simulate user data
      req.user = {
        id: 'temp-user-id',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication'
      });
    }
  };
};
