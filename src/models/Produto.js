const knex = require('../config/data');

class Produto
{
    async findAll()
    {
        try 
        {
            let produto = await knex.select(["idprodutos","nome","descricao","valorUnitario"]).table("produtos");
            return {valid: true, values: produto};
        } catch (error) 
        {        
            return {valid: false, error: error};
        }   
    }
}

module.exports = new Produto();