const pedidos = require('../models/Pedidos');

class PedidoController
{
    async listAll(req,res)
    {
        const result = await pedidos.findAll();

        ! (result.valid)
        ? res.status(404).json({success: false, message: result.error})
        : res.status(200).json({success: true, values: result.values});
    }
}

module.exports = new PedidoController();