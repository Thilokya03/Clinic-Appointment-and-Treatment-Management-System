const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// Base authentication to validate token
exports.authenticate = (req, res, next) => {
    const authtoken = req.header('Authorization');
    console.log("🟢 Authenticate middleware reached");

    if (!authtoken) return res.status(401).json({error:'No token provided'});
    const token = authtoken.split(' ')[1];
    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded.user;
        console.log("decoded", req.user);
        next();
    }catch(err){
        return res.status(401).json({error: 'Invalid token'});
    }
};

// patient middleware
exports.patientAuth = (req, res, next) => {
    exports.authenticate(req, res, () => {
        if (req.user.role === 'patient') {
            next();
        }else{
            res.status(403).json({error:'Access denied: Patient access only'})
        }
    });
};

// appointment booking middleware - allows both patients and staff
exports.appointmentAccess = (req, res, next) => {
    exports.authenticate(req, res, () => {
        // Both patients and staff can access
        if (req.user.role === 'patient' || req.user.category) {
            next();
        } else {
            res.status(403).json({error:'Access denied: Invalid user type'})
        }
    });
};

// staff middleware
exports.staffAuth = (roles = []) => {
    return (req, res, next) => {
        exports.authenticate(req, res, () =>{
            if (req.user.role === 'patient') {
                return res.status(403).json({error:'Access denied, Staff only'})
            }

            // 👑 Super Admin has access to everything
            if (req.user.id === 'SUPER_ADMIN' || req.user.category === 'Super Admin') {
                console.log('👑 Super Admin access granted');
                return next();
            }

            if (roles.length > 0 && !roles.includes(req.user.category)){
                console.log("userCategory", req.user.category)
                return res.status(403).json({ error: 'Access denied: Insufficient privileges' });
            }

            next();
        });
    }
}