const Users = require('../models/Users');

class UsersController
{
    // método de api (precisa de uma rota?)
    async listAll(req,res)
    {
        // req = requerer, res = response
        let result = await Users.findAll();
        
        ! (result.valid)
        ? res.status(404).json({success: false, message: result.error})
        : res.status(418).json({success: true, values: result.values});
    }
}

module.exports = new UsersController();