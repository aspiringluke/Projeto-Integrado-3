const knex = require('../config/data');

class Produto
{
    async findAll()
    {
        try 
        {
            let produtos = await knex.select(["idprodutos","nome","descricao","valorUnitario"]).table("produtos");
            return {valid: true, values: produtos};
        } catch (error) 
        {        
            return {valid: false, error: error};
        }   
    }

    async findById(id)
    {
        try
        {
            let produto = await knex.select(["idprodutos","nome","descricao","valorUnitario"]).table("produtos").where({idprodutos: id});
        
            return (produto.length > 0)
            ? {valid: true, values: produto}
            : {valid: true, values: undefined};
        }   
        catch (error)     
        {   
        return {valid: false, error: error};
        }
    }




}

module.exports = new Produto();