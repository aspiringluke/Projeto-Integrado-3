require('dotenv').config()
const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    // pega o cabeçalho com os dados para autenticação
    console.log(req.headers)
    const auth = req.headers['authorization'];

    if(auth !== undefined){
        try {
            const bearer = auth.split(' ');
            const token = bearer[1];
            const decoded = jwt.verify(token, process.env.SECRET);

            if(decoded.role === 1){
                return next();
            }
            return res.status(403).json({success: false, message: "Usuário não autorizado"})
        } catch (error) {
            return res.status(403).json({success: false, message: "Usuário não autorizado."});
        }
    }else{
        return res.status(403).json({success:false, message: "Usuário não autenticado."});
    }
}