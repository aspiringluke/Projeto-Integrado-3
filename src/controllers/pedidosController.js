const pedidos = require('../models/Pedidos');

class PedidoController
{
    async listAll(req,res)
    {
        let result = await pedidos.findAll();

        ! (result.valid)
        ? res.status(404).json({success: false, message: result.error})
        : res.status(200).json({success: true, values: result.values});
    }


    async listOne(req,res)
    {
        let result = await pedidos.findById(req.params.id);
        if (!(result.valid))
        {
            res.status(404).json({success: false, message: result.error})
        }
        else
        {
            result.values === undefined
            ? res.status(404).json({success: false, message: "pedido não encontrado."})
            : res.status(200).json({success: true, values: result.values});
        }
    }

    async create(req, res) {
        let result = await pedidos.create(req.body);

        if (!result.valid) {
            res.status(500).json({ success: false, message: result.error });
        } else {
            // Retorna o ID do pedido junto com a mensagem de sucesso
            res.status(201).json({ success: true, message: "Pedido criado com sucesso", idPedido: result.idPedido });
        }
    }


}
module.exports = new PedidoController();