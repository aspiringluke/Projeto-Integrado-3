const Users = require('../models/Users');

class UsersController
{
    // método de api (precisa de uma rota?)
    async listAll(req,res)
    {
        // req = requerer, res = response
        let result = await Users.findAll();
        
        ! (result.valid)
        ? res.status(418).json({success: false, message: result.error})
        : res.status(200).json({success: true, values: result.values});
    }

    async listOne(req,res)
    {
        let result = await Users.findById(req.params.id);
        if (!(result.valid))
        {
            res.status(404).json({success: false, message: result.error})
        }
        else
        {
            result.values === undefined
            ? res.status(404).json({success: false, message: "Usuário não encontrado."})
            : res.status(200).json({success: true, values: result.values});
        }
    }
}

module.exports = new UsersController();