require('dotenv').config()

const Users = require('../models/Users');
const comparePasswordService = require('../services/compare_password_service');
const jwt = require('jsonwebtoken');

class LoginController
{
    async login(req,res)
    {
        let {email, senha} = req.body;

        let user = await Users.findByEmail(email);
        
        if(!(user.valid)){
            if(user.values === undefined){
                res.status(404).json({success: false, message: "Email não encontrado."});
                return;
            }
            res.status(500).json({success: false, message: user.message})
            return;
        }

        let isPasswordCorrect = await comparePasswordService(senha, user.values.senha);
        if(isPasswordCorrect){
            let token = jwt.sign({idUsuario: user.values.idUsuario, email: email}, process.env.SECRET, {expiresIn: 5000});
            res.status(200).json({success: true, token: token, id: user.values.id});
        }
        else{
            res.status(401).json({success: false, message: "Senha incorreta."});
        }
    }
}

module.exports = new LoginController();