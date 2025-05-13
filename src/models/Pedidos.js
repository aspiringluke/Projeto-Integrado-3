const knex = require('../config/data');

class Pedidos
{
    async findAll()
    {
        try
        {
            let pedidos = await knex.select(['idpedidos', 'status', 'data']).table('pedidos');
            return {valid: true, values: pedidos};
        }
        catch(error)
        {
            return {valid: false, error: error};
        }
    }




    async findById(id)
    {
        try
        {
            let pedido = await knex.select(["idpedidos","status","data"]).table("pedidos").where({idpedidos: id});
        
            return (pedido.length > 0)
            ? {valid: true, values: pedido}
            : {valid: true, values: undefined};
        }   
        catch (error)     
        {   
        return {valid: false, error: error};
        }
    }

async create(newPedido) {
    try {
        // Inserindo o pedido
        let idpedido = await knex
            .insert({
                status: newPedido.status,
                data: newPedido.data,
                idUsuario: newPedido.idUsuario,
                idCliente: newPedido.idCliente
            }, ['idPedido'])
            .into('pedidos');
        
        // Pegando o ID do pedido inserido
        const id = idpedido[0].idPedido;

        // Inserindo os itens do pedido
        let result = await this.insertItems(id, newPedido.itens);

        // Retornando o resultado da inserção dos itens
        if (result.valid) {
            return {valid: true, message: "Pedido e itens cadastrados com sucesso."};
        } else {
            return {valid: false, error: result.error};
        }
    } catch (error) {
        console.log(error);
        return {valid: false, error: error};
    }
}


    async insertItems(idpedido, itens)
    {
        try{
            for(const item of itens){
                await knex('itenspedido')
                        .insert({
                            idPedido: idpedido,
                            idProduto: item.idProduto,
                            quantidade: item.quantidade,
                            valorCombinado: item.valorCombinado
                        });
            }

            return {valid: true, message: "Itens cadastrados."};
        }
        catch(error){
            return {valid:false, error:error};
        }

    }
}


module.exports = new Pedidos();