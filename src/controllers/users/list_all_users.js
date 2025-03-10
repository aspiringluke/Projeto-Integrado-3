const UsersService = require('../../services/Users_Service');

class ListAllUsers
{
    // método de api (precisa de uma rota?)
    async listAll(req,res)
    {
        // req = requerer, res = response
        let result = await UsersService.findAll();
        console.log(result);
    }
}

module.exports = new ListAllUsers();