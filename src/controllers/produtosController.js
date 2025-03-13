class ProdutoController
{
    async getProduto(req,res)
    {
        // pede do banco
        let dict = {
            '1': 'um'
        ,   '2': 'dois'
        ,
        }
        res.json(dict);
    }
}

module.exports = new ProdutoController();
