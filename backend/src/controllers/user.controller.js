import User from '../models/User.model.js';
import Character from '../models/Character.model.js';

// @desc    List all users (admin only)
// @route   GET /api/users
// @access  Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActivated: true })
      .select('username slug displayName email role createdAt')
      .sort({ createdAt: -1 });

    const withCounts = await Promise.all(
      users.map(async (u) => {
        const charactersCount = await Character.countDocuments({ owner: u._id });
        return {
          _id: u._id,
          username: u.username,
          slug: u.slug,
          displayName: u.displayName,
          email: u.email,
          role: u.role,
          charactersCount,
          createdAt: u.createdAt
        };
      })
    );

    res.status(200).json({ success: true, data: withCounts });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user + cascade delete their characters (admin only)
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.equals(id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const deletedChars = await Character.deleteMany({ owner: user._id });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `User deleted. ${deletedChars.deletedCount} character(s) removed.`
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    next(error);
  }
};
