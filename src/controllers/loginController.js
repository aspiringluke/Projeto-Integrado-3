require('dotenv').config()

const Users = require('../models/Users');
const comparePasswordService = require('../services/compare_password_service');
const jwt = require('jsonwebtoken');

class LoginController
{
    async login(req,res)
    {
        let {email, senha} = req.body;

        let result = await Users.findByEmail(email);
        
        if(!(result.valid)){
            if(result.values === undefined){
                res.status(404).json({success: false, message: "Email não encontrado."});
                return;
            }
            res.status(500).json({success: false, message: result.message})
            return;
        }

        let isPasswordCorrect = await comparePasswordService(senha, result.values.senha);
        if(isPasswordCorrect){
            let token = jwt.sign({email: email}, process.env.SECRET, {expiresIn: 5000});
            res.status(200).json({success: true, token: token});
        }
        else{
            res.status(401).json({success: false, message: "Senha incorreta."});
        }
    }
}

module.exports = new LoginController();