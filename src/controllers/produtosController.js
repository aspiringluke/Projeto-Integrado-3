
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

        async createProdutos(req,res)
            {
                /**
                 * Aqui provavelmente vão as verificações
                 * de dados mais complexas, considerando que
                 * o frontend provavelmente já irá verificar de antemão
                 */
                
                let result = await Produto.create(req.body);
        
                ! (result.valid)
                ? res.status(500).json({success: false, message: result.error})
                : res.status(201).json({success: true, message: "Produto cadastrado com sucesso"});
            }


    
        async updateProdutos(req,res)
            {
                let result = await Produto.update(
                    req.body.idprodutos,
                    req.body.coluna,
                    req.body.valor
                );
        
                if (!(result.valid)){
                    res.status(500).json({success: false, message: result.error})
                }
                else {
                    result.linhasAfetadas == 0
                    ? res.status(404).json({success: false, message: "Não há nenhum produto com esse ID."})
                    : res.status(200).json({success: true, message: `${req.body.coluna} atualizado(a) com sucesso`});
                }
            }
        
        async deleteProduto(req,res)
            {
                // não seria melhor passar o id como parâmetro?
                let result = await Produto.delete(req.body.id);
        
                if (!(result.valid)){
                    res.status(500).json({success: false, message: result.error})
                }
                else {
                    result.linhasAfetadas == 0
                    ? res.status(404).json({success: false, message: "Não existe nenhum produto com este ID."})
                    : res.status(200).json({success: true, message: `Deletado(a) com sucesso`});
                }
            }


}
    
    module.exports = new ProdutoControllers();