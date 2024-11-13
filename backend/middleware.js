const jwt = require('jsonwebtoken')

const  JWT_SECRET  = process.env.JWT_SECRET;
const authMiddleware = async (req,res,next)=>{
const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith('Bearer')){
    return res.status(403).json({
        message:"token not validate"
    })
}
const token = authHeader.split(' ')[1];
try {
    const decode = jwt.verify(token,JWT_SECRET);
    req.userId = decode.userId;
    next();
} catch (error) {
    return res.status(403).json({message:error.message})
}

}

module.exports = {
    authMiddleware
}