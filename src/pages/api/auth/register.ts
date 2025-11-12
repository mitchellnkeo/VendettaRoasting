import { NextApiRequest, NextApiResponse } from 'next';
// TODO: Install and use bcryptjs when implementing password hashing
// import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
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

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // TODO: Check if user already exists in database
    // TODO: Hash password with bcrypt
    // TODO: Save user to database

    // For now, simulate successful registration
    console.log('User registration attempt:', { firstName, lastName, email });

    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 500));

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: 'temp-user-id',
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
