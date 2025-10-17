import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // TODO: Find user in database by email
    // TODO: Verify password with bcrypt
    // TODO: Generate JWT token
    // TODO: Set session/cookie

    // For now, simulate successful login
    console.log('User login attempt:', { email });

    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate user data (in real app, this would come from database)
    const user = {
      id: 'temp-user-id',
      firstName: 'John',
      lastName: 'Doe',
      email: email,
      createdAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token: 'temp-jwt-token'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
