
const Produto = require('../models/Produto');

class ProdutoControllers
    
    
    {
        
        async listAll(req,res)
        {
            // req = requerer, res = response
            let result = await Produto.findAll();
            
            ! (result.valid)
            ? res.status(418).json({success: false, message: result.error})
            : res.status(200).json({success: true, values: result.values});
        }

        async listOne(req,res)
        {
            let result = await Produto.findById(req.params.id);
            if (!(result.valid))
        {
            res.status(404).json({success: false, message: result.error})
        }
        else
        {
            result.values === undefined
            ? res.status(404).json({success: false, message: "produto não encontrado."})
            : res.status(200).json({success: true, values: result.values});
        }
        }

}
    
    module.exports = new ProdutoControllers();