import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'banksight_secret_jwt_key_2026_finance_secure';

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.full_name
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function extractToken(req) {
  // Check HttpOnly cookie first
  if (req.cookies && req.cookies.bs_token) {
    return req.cookies.bs_token;
  }
  // Check Authorization header (Bearer token for Postman / API test)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: `Access denied. Requires '${role}' privilege. Your current role is '${req.user.role}'.` 
      });
    }
    next();
  };
}

export function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Ignored for optional
    }
  }
  next();
}
