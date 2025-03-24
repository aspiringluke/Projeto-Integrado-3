// importar a conexão com o banco
const knex = require('../config/data'); // é a ponte que liga este arquivo ao banco de dados


class Users
{
    // criar um método para buscar todos os usuários
    // vamos impedir o código de continuar até que as informações sejam retornada
    async findAll()
    {
        try
        {
            let users = await knex.select(["idUsuarios","nome","email"]).table("usuarios");
            return {valid: true, values: users};
        } catch (error)
        {
            return {valid: false, error: error};
        }
    }
    
    async findById(id)
    {
        try
        {
            let user = await knex.select(["idUsuarios","nome","email"]).table("usuarios").where({idUsuarios: id});
        
        return (user.length > 0)
        ? {valid: true, values: user}
        : {valid: true, values: undefined};
        } catch (error)
        {
            return {valid: false, error: error};
        }
    }

}


module.exports = new Users();