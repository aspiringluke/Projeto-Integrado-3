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

    async create(newProduto)
    {
        try {
            await knex
                .insert({
                    nome: `${newProduto.nome}`,
                    descricao: `${newProduto.descricao}`,
                    valorUnitario: `${newProduto.valorUnitario}`
                })
                .into('produtos');
            return {valid: true};
        } catch (error) {
            console.log(error);
            return {valid: false, error: error};
        }
    }

    async update(id, coluna, novoValor)
    {
        try {
            // deveria enviar de volta os dados para confirmação?
            let linhasAfetadas = await knex('produtos')
                .where({idprodutos: id})
                .update(coluna, novoValor);
            
            console.log("Linhas afetadas: " + linhasAfetadas);
            return {valid: true, linhasAfetadas: linhasAfetadas};
        } catch (error) {
            return {valid: false, error: error};
        }
    }

    async delete(id)
    {
        try {
            let linhasAfetadas = await knex('produtos')
                .where({idprodutos: id})
                .del();
            
            console.log("Linhas afetadas: " + linhasAfetadas);
            return {valid: true, linhasAfetadas: linhasAfetadas};
        } catch (error) {
            return {valid: false, error: error};
        }
    }

}

module.exports = new Produto();