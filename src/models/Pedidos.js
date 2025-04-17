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

    async create(newPedido)
    {
        try {
            let idpedido = await knex
                .insert({
                    status: `${newPedido.status}`,
                    data: `${newPedido.data}`,
                    idUsuario: newPedido.idUsuario,
                    idCliente: newPedido.idCliente
                }, ['idPedido'])
                .into('pedidos');
            
            console.log(idpedido);
            
            let result = this.insertItems(idpedido, newPedido.itens);

            return result.valid
            ? {valid: true, message: result.message}
            : {valid: false, error: result.error};

            return {valid: true};
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