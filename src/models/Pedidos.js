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
            await knex
                .insert({
                    status: `${newPedido.status}`,
                    data: `${newPedido.data}`,
                })
                .into('pedidos');
            return {valid: true};
        } catch (error) {
            console.log(error);
            return {valid: false, error: error};
        }
    }


}
module.exports = new Pedidos();