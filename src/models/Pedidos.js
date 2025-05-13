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

    async create(status, data, idUsuario, idCliente, itens)
    {
        try {
            let idpedido = await knex('pedidos')
				.insert({
					status: status,
					data: data,
					Usuario_idUsuario: idUsuario,
					Cliente_idCliente: idCliente
			}, ['idPedido']);

			let result = this.insertItems(idpedido, itens);

            return result.valid
            ? {valid: true, message: result.message}
            : {valid: false, error: result.error};
        } catch (error) {
            console.log(error);
            return {valid: false, error: error};
        }
    }

    /**
     * Podemos precisar utilizar dois models: um para os pedidos e um para os itens
     */
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

            return {valid: true, message: "Pedido cadastrado."};
        }
        catch(error){
            return {valid:false, error:error};
        }

    }
}


module.exports = new Pedidos();
