const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers['x-access-token'];
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (authHeader) {
            token = authHeader;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No access token provided.'
            });
        }

        // Verify token with Supabase Auth
        const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

        if (error || !authUser) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid or expired session token.'
            });
        }

        // Fetch user from internal users table
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', authUser.id)
            .single();

        if (profileError || !userProfile) {
            return res.status(404).json({
                success: false,
                message: 'User profile record not found.'
            });
        }

        req.authUser = authUser;
        req.user = userProfile;
        req.token = token;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(500).json({
            success: false,
            message: 'Authentication error occurred.'
        });
    }
};

module.exports = { requireAuth };
