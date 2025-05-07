const knex = require('../config/data');

class Produto
{
    async findAll()
    {
        try 
        {
            let produtos = await knex.select(["idProduto","descricao","unidade","valorUnitario"]).table("produtos");
            return {valid: true, values: produtos};
        } catch (error) 
        {        
            return {valid: false, message: error};
        }   
    }

    async findById(id)
    {
        try
        {
            let produto = await knex.select(["idProduto","descricao","unidade","valorUnitario"]).table("produtos").where({idproduto: id});
        
            return (produto.length > 0)
            ? {valid: true, values: produto}
            : {valid: true, values: undefined};
        }   
        catch (error)     
        {   
        return {valid: false, message: error};
        }
    }

    async create(descricao, unidade, valorUnitario)
    {
        try {
            await knex('produtos')
                .insert({
                    descricao: descricao,
                    unidade: unidade,
                    valorUnitario: valorUnitario
                });
            return {valid: true};
        } catch (error) {
            return {valid: false, message: error};
        }
    }

    async update(id, descricao, unidade, valorUnitario)
    {
        let produto = await this.findById(id);
        if(produto.valid){
            if(produto.values === undefined) return {valid: false, message: undefined};
            else{
                let produtoInfo = {};

                descricao !== undefined ? produtoInfo.descricao = descricao : null;
                unidade !== undefined ? produtoInfo.unidade = unidade : null;
                valorUnitario !== undefined ? produtoInfo.valorUnitario = valorUnitario : null;

                try {
                    await knex('produtos').update(produtoInfo).where({idProduto: id});

                    return {valid: true, message: "Produto atualizado com sucesso."};
                } catch (error) {
                    return {valid: false, message: error};
                }
            }
        }else{
            return {valid: false, message: produto.error}
        }
    }

    async delete(id)
    {
        let produto = await this.findById(id);

        if(produto.valid){
            if(produto.values !== undefined){
                try {
                    await knex("usuarios").delete().where({idProduto:id});
                    return {valid: true, message: "Usuário excluído com sucesso."};
                } catch (error) {
                    return {valid: false, message: error};
                }
            }
            else{
                return {valid: false, message: undefined}
            }
        }
        else{
            return {valid: false, message: produto.error};
        }
    }

}

module.exports = new Produto();