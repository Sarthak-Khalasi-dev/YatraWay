// Lightweight authentication middleware for Supabase / Standalone mode
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let userId = 'demo_user_1';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) userId = token;
  } else if (req.headers['x-user-id']) {
    userId = req.headers['x-user-id'];
  }

  req.user = {
    _id: userId,
    id: userId,
    name: 'Explorer',
    email: 'user@example.com',
  };

  next();
};

module.exports = { protect };
