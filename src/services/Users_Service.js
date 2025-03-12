// importar a conexão com o banco
const knex = require('../config/data'); // é a ponte que liga este arquivo ao banco de dados


class UsersService
{
    // criar um método para buscar todos os usuários
    // vamos impedir o código de continuar até que as informações sejam retornada
    async findAll()
    {
        try
        {
            let users = await knex.select(["idUsuarios","nome","email"]).table("usuarios");
            return users;
        } catch (error)
        {
            console.log(error);
        }
    }
}

module.exports = new UsersService();