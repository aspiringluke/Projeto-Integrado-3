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

    async create(newUser)
    {
        try {
            await knex
                .insert({nome: `${newUser.nome}`, email: `${newUser.email}`, senha: `${newUser.senha}`, funcao_idfuncao: `${newUser.funcao}`})
                .into('usuarios');
            return {valid: true};
        } catch (error) {
            console.log(error);
            return {valid: false, error: error};
        }
    }

    /**
     * Funciona apenas para um único valor.
     * Precisa permitir atualização de colunas simultâneas
     * ou pelo menos várias iterações.
     * Também é preciso impedir a alteração de IDs
     */
    async update(id, coluna, novoValor)
    {
        try {
            // deveria enviar de volta os dados para confirmação?
            await knex('usuarios')
                .where({idUsuarios: id})
                .update(coluna, novoValor);
            
            return {valid: true};
        } catch (error) {
            return {valid: false, error: error};
        }
    }

    async delete(id)
    {
        try {
            await knex('usuarios')
                .where({idUsuarios: id})
                .del();
            
            return {valid: true};
        } catch (error) {
            return {valid: false, error: error};
        }
    }
}


module.exports = new Users();