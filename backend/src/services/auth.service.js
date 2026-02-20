const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

class AuthService {
  /**
   * Generate access token
   */
  generateAccessToken(user) {
    return jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        email: user.email
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  /**
   * Generate refresh token
   */
  async generateRefreshToken(user) {
    const token = jwt.sign(
      { userId: user._id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Save to database
    await RefreshToken.create({
      userId: user._id,
      token,
      expiresAt
    });

    return token;
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token) {
    try {
      // Verify JWT
      const decoded = jwt.verify(token, config.jwt.refreshSecret);

      // Check if token exists in database
      const refreshToken = await RefreshToken.findOne({ token });

      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      if (refreshToken.isExpired()) {
        await refreshToken.deleteOne();
        throw new Error('Refresh token expired');
      }

      return decoded;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(token) {
    await RefreshToken.deleteOne({ token });
  }

  /**
   * Revoke all user's refresh tokens
   */
  async revokeAllUserTokens(userId) {
    await RefreshToken.deleteMany({ userId });
  }

  /**
   * Register new user
   */
  async register(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await User.create(userData);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new Error('Account is inactive');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // Remove password from response
    user.password = undefined;

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    const decoded = await this.verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.status !== 'active') {
      throw new Error('Account is inactive');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
      user
    };
  }

  /**
   * Logout user
   */
  async logout(refreshToken) {
    await this.revokeRefreshToken(refreshToken);
  }
}

module.exports = new AuthService();
