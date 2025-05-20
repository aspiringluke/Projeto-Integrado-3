const pedidos = require('../models/Pedidos');

class PedidoController {
    async listAll(req, res) {
        let result = await pedidos.findAll();

        !(result.valid)
            ? res.status(404).json({ success: false, message: result.error })
            : res.status(200).json({ success: true, values: result.values });
    }

    async listOne(req, res) {
        if (isNaN(req.params.id)) {
            res.status(400).json({ success: false, message: "ID inválido." });
        } else {
            let result = await pedidos.findById(req.params.id);
            if (!(result.valid)) {
                res.status(404).json({ success: false, message: result.error });
            } else {
                result.values === undefined
                    ? res.status(406).json({ success: false, message: "Pedido não encontrado." })
                    : res.status(200).json({ success: true, values: result.values });
            }
        }
    }

    async create(req,res)
    {
        let { idUsuario, status, data, idCliente, itens } = req.body;

        let result = await pedidos.create(status, data, idUsuario, idCliente, itens);

        !(result.valid)
            ? res.status(500).json({ success: false, message: result.error })
            : res.status(201).json({ success: true, message: "Pedido criado com sucesso", idPedido: result.idPedido });
    }

    async listPedidosDetalhados(req, res) 
    {
        const result = await pedidos.findPedidos();

        if (!result.valid) {
            return res.status(500).json({ success: false, message: result.message });
        }

        res.status(200).json({ success: true, values: result.values });
    }

}

module.exports = new PedidoController();

