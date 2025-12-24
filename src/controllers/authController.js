const authService = require('../services/authService');

class AuthController {
  /**
   * Login
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const result = await authService.login(username, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Register
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const userData = req.body;

      const newUser = await authService.register(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      const user = await authService.getProfile(userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout (client-side token removal)
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      res.json({
        success: true,
        message: 'Logout successful. Please remove token from client.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
