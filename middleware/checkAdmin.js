const {User} = require('../models/User');

const checkAdmin = async (req, res, next) => {
  console.log(req.user.email);
    try {
    console.log(req.user.email);
    const email = req.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user.isAdmin);
    if (user.isAdmin===true) {
      next();
    } else {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = checkAdmin;
