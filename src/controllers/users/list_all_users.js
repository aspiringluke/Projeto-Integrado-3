const UsersService = require('../../services/Users_Service');

class UserController
{
    async getUser(id)
    {
        // ^ coisas
    }

    async createUser(nome, email, senha)
    {
        // ^ mais coisas
    }

    async postUser()
    {
        // ^ outras coisas
    }
}

class ListAllUsers
{
    // método de api (precisa de uma rota?)
    async listAll(req,res)
    {
        // req = requerer, res = response
        let result = await UsersService.findAll();

        // TODO: Pesquisar sobre como devolver um JSON pro front
        console.log(result);
    }
}

module.exports = new ListAllUsers();