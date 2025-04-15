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

    async createUser(req,res)
        {
            /**
             * Aqui provavelmente vão as verificações
             * de dados mais complexas, considerando que
             * o frontend provavelmente já irá verificar de antemão
             */
            
            let result = await pedidos.create(req.body);
    
            ! (result.valid)
            ? res.status(500).json({success: false, message: result.error})
            : res.status(201).json({success: true, message: "Usuário criado com sucesso"});
        }
}
module.exports = new PedidoController();