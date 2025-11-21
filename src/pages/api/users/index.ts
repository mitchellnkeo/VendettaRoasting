import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { query } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === 'GET') {
    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // User can only fetch their own data, or admin can fetch any
      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      // Check if user is requesting their own data or is admin
      if (session.user?.email !== email && session.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden'
        });
      }

      const userResult = await query(
        'SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE email = $1 LIMIT 1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: userResult.rows[0]
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      if (!session || !session.user?.email) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { firstName, lastName, phone } = req.body;

      const updateResult = await query(
        `UPDATE users 
         SET first_name = $1, last_name = $2, phone = $3, updated_at = NOW()
         WHERE email = $4
         RETURNING id, email, first_name, last_name, phone, created_at`,
        [firstName, lastName, phone, session.user.email]
      );

      if (updateResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updateResult.rows[0]
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

