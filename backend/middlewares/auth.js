const jwt = require('jsonwebtoken');
const SECRET_KEY = 'YusriIsAnEngineer';


// Base authentication to validate token

exports.authenticate = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json({error:'No token provided'});

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded.user;
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

// staff middleware

exports.staffAuth = (roles = []) => {
    return (req, res, next) => {
        exports.authenticate(req, res, () =>{
            if (req.user.role !== 'staff') {
                return res.status(403).json({error:'Access denied, Staff only'})
            }

            if (roles.length > 0 && !roles.includes(req.user.category)){
                return res.status(403).json({ error: 'Access denied: Insufficient privileges' });
            }

            next();
        });
    }
}