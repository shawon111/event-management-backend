const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        const userId = decoded.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = requireAuth;