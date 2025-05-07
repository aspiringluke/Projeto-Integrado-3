const Produto = require('../models/Produto');

class ProdutoControllers
    {
        async listAll(req,res)
        {
            let result = await Produto.findAll();
            
            ! (result.valid)
            ? res.status(418).json({success: false, message: result.error})
            : res.status(200).json({success: true, values: result.values});
        }

        async listOne(req,res)
        {
            let result = await Produto.findById(req.params.id);
            if (!(result.valid)){
                res.status(404).json({success: false, message: result.error})
            }
            else
            {
                result.values === undefined
                ? res.status(404).json({success: false, message: "produto não encontrado."})
                : res.status(200).json({success: true, values: result.values});
            }
        }

        async createProdutos(req,res)
        {
            /**
             * Aqui provavelmente vão as verificações
             * de dados mais complexas, considerando que
             * o frontend provavelmente já irá verificar de antemão
             */
            let {descricao, unidade, valorUnitario} = req.body
            let result = await Produto.create(descricao, unidade, valorUnitario);
    
            ! (result.valid)
            ? res.status(500).json({success: false, message: result.error})
            : res.status(201).json({success: true, message: "Produto cadastrado com sucesso"});
        }


    
        async updateProdutos(req,res)
        {
            let id = req.params.id;
            let {descricao, unidade, valorUnitario} = req.body;
            let result = await Produto.update(id, descricao, unidade, valorUnitario);
    
            if (result.valid){
                res.status(200).json({success: true, message: `Produto atualizado com sucesso`});
            }
            else {
                result.message === undefined
                ? res.status(404).json({success: false, message: "Não há nenhum produto com esse ID."})
                : res.status(500).json({success: false, message: result.message});
            }
        }
        
        async deleteProduto(req,res)
        {
            let result = await Produto.delete(req.params.id);
    
            if (result.valid){
                res.status(200).json({success: true, message: `Produto atualizado com sucesso`});
            }
            else {
                result.message === undefined
                ? res.status(404).json({success: false, message: "Não há nenhum produto com esse ID."})
                : res.status(500).json({success: false, message: result.message});
            }
        }


}
    
module.exports = new ProdutoControllers();