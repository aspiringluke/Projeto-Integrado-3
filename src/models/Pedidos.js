const knex = require('../config/data');

class Pedidos {
    async findAll() {
        try {
            let pedidos = await knex.select(['idPedido', 'status', 'data']).table('pedidos');
            return { valid: true, values: pedidos };
        } catch (error) {
            return { valid: false, message: error };
        }
    }

    async findById(id) {
        try {
            let pedido = await knex.select(["idPedido", "status", "data"]).table("pedidos").where({ idPedido: id });

            return (pedido.length > 0)
                ? { valid: true, values: pedido }
                : { valid: true, values: undefined };
        }
        catch (error) {
            return { valid: false, message: error };
        }
    }

    async create(status, data, idUsuario, idCliente, itens) {
        try {
            // O insert retorna o id inserido (array no MySQL)
            let idpedido = await knex('pedidos')
                .insert({
                    status: status,
                    data: data,
                    Usuario_idUsuario: idUsuario,  // Passa o id do usuário corretamente
                    Cliente_idCliente: idCliente
                });

            const idPedidoInserido = Array.isArray(idpedido) ? idpedido[0] : idpedido;

            let result = await this.insertItems(idPedidoInserido, itens);

            return result.valid
                ? { valid: true, message: result.message, idPedido: idPedidoInserido }
                : { valid: false, error: result.error };

        } catch (error) {
            console.log(error);
            return { valid: false, error: error.message || error };
        }
}


    async insertItems(idpedido, itens) {
        try {
            console.log(itens)
            for (const item of itens) {
                await knex('itenspedido')
                    .insert({
                        Pedido_idPedido: idpedido,
                        Produto_idProduto: item.idProduto,
                        quantidade: item.quantidade,
                        valorCombinado: item.valorCombinado
                    });
            }

            return { valid: true, message: "Pedido cadastrado." };
        }
        catch (error) {
            console.log('Erro ao inserir itens:', error);
            return { valid: false, error: error.message || error };
        }
    }


    async findPedidos() 
    {
        try {
            const pedidos = await knex('pedidos')
            .leftJoin('clientes', 'clientes.idCliente', 'pedidos.Cliente_idCliente')
            .leftJoin('itenspedido', 'itenspedido.Pedido_idPedido', 'pedidos.idPedido')
            .select(
                'pedidos.idPedido',
                'pedidos.status',
                'pedidos.data',
                'clientes.nome as nomeCliente'
            )
            .sum('itenspedido.valorCombinado as valorTotal')
            .groupBy('pedidos.idPedido', 'pedidos.status', 'pedidos.data', 'clientes.nome');

            return { valid: true, values: pedidos };

        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            return { valid: false, message: error.message || error };
        }
    }

    async updateStatus(idPedido, novoStatus) 
    {
        try {

            const updated = await knex('pedidos')
            .where({ idPedido })
            .update({ status: novoStatus });


            if (updated === 0) {
            return { valid: false, message: "Pedido não encontrado ou status não alterado." };
            }

            return { valid: true, message: "Status atualizado com sucesso." };
        } catch (error) {
            console.error("Erro ao atualizar status do pedido:", error);
            return { valid: false, message: error.message || error };
        }
    }


}

module.exports = new Pedidos();
