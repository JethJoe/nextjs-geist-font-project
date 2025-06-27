import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { generateToken } from '../utils/jwt';

// Validation rules
export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('language').optional().isIn(['en', 'sw']).withMessage('Language must be either en or sw'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        message_sw: 'Uthibitisho umeshindwa',
        errors: errors.array(),
      });
      return;
    }

    const { email, password, first_name, last_name, phone, language = 'en' } = req.body;

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        message_sw: 'Mtumiaji wa barua pepe hii tayari yupo',
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, phone, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, language, created_at',
      [email, hashedPassword, first_name, last_name, phone, language]
    );

    const user = newUser.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      message_sw: 'Mtumiaji amesajiliwa kwa mafanikio',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          language: user.language,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      message_sw: 'Hitilafu ya ndani ya seva',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        message_sw: 'Uthibitisho umeshindwa',
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Find user
    const userResult = await pool.query(
      'SELECT id, email, password, first_name, last_name, language FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        message_sw: 'Barua pepe au nenosiri si sahihi',
      });
      return;
    }

    const user = userResult.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        message_sw: 'Barua pepe au nenosiri si sahihi',
      });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      message_sw: 'Kuingia kumefanikiwa',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          language: user.language,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      message_sw: 'Hitilafu ya ndani ya seva',
    });
  }
};

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const userResult = await pool.query(
      'SELECT id, email, first_name, last_name, phone, language, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        message_sw: 'Mtumiaji hakupatikana',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user: userResult.rows[0],
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      message_sw: 'Hitilafu ya ndani ya seva',
    });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { first_name, last_name, phone, language } = req.body;

    const updateResult = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, phone = $3, language = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, email, first_name, last_name, phone, language',
      [first_name, last_name, phone, language, userId]
    );

    if (updateResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        message_sw: 'Mtumiaji hakupatikana',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      message_sw: 'Wasifu umesasishwa kwa mafanikio',
      data: {
        user: updateResult.rows[0],
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      message_sw: 'Hitilafu ya ndani ya seva',
    });
  }
};

// Change password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
        message_sw: 'Nenosiri la sasa na nenosiri jipya vinahitajika',
      });
      return;
    }

    if (new_password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
        message_sw: 'Nenosiri jipya lazima liwe na angalau herufi 6',
      });
      return;
    }

    // Get current password
    const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        message_sw: 'Mtumiaji hakupatikana',
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, userResult.rows[0].password);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        message_sw: 'Nenosiri la sasa si sahihi',
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully',
      message_sw: 'Nenosiri limebadilishwa kwa mafanikio',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      message_sw: 'Hitilafu ya ndani ya seva',
    });
  }
};
