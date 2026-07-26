import { 
  findUserByEmail, 
  findUserById,
  createUser, 
  verifyPassword, 
  sanitizeUser,
  seedDemoUsers 
} from '../utils/jsonDatabase.js';
import { generateToken } from '../utils/authUtils.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ 
        error: 'All fields are required.' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        error: 'Passwords do not match.' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters.' 
      });
    }

    // Validate role
    if (!['user', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role selected.' 
      });
    }

    // Create new user
    const newUser = await createUser({
      name,
      email,
      password,
      role
    });

    // Generate token
    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: newUser
    });
  } catch (error) {
    console.log('Register error:', error.message);
    res.status(400).json({ 
      error: error.message || 'Registration failed' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required.' 
      });
    }

    // Find user by email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Account is disabled. Please contact support.' 
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.log('Login error:', error.message);
    res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Logout failed' 
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // User is attached to request by authMiddleware
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Not authenticated' 
      });
    }

    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch user' 
    });
  }
};

// Seed demo users on startup
export async function initializeAuthSystem() {
  try {
    await seedDemoUsers();
    console.log('✓ Auth system initialized with demo users');
  } catch (error) {
    console.log('Error initializing auth system:', error.message);
  }
}
