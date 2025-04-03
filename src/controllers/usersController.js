const Users = require('../models/Users');

/**
 * TODO: Adicionar verificações dos parâmetros em todas as queries
 */

class UsersController
{
    async listAll(req,res)
    {
        let result = await Users.findAll();
        
        ! (result.valid)
        ? res.status(404).json({success: false, message: result.error})
        : res.status(200).json({success: true, values: result.values});
    }

    async listOne(req,res)
    {
        let result = await Users.findById(req.params.id);
        if (!(result.valid))
        {
            res.status(404).json({success: false, message: result.error})
        }
        else
        {
            result.values === undefined
            ? res.status(404).json({success: false, message: "Usuário não encontrado."})
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
        
        let result = await Users.create(req.body);

        ! (result.valid)
        ? res.status(500).json({success: false, message: result.error})
        : res.status(201).json({success: true, message: "Usuário criado com sucesso"});
    }


    async updateUser(req,res)
    {
        let result = await Users.update(
            req.body.idUsuarios,
            req.body.coluna,
            req.body.valor
        );

        ! (result.valid)
        ? res.status(404).json({success: false, message: result.error})
        : res.status(200).json({success: true, message: `${req.body.coluna} atualizado(a) com sucesso`});
    }


    async deleteUser(req,res)
    {
        // não seria melhor passar o id como parâmetro?
        let result = await Users.delete(req.body.id);

        ! (result.valid)
        ? res.status(404).json({success: false, message: result.error})
        : res.status(200).json({success: true, message: `Deletado(a) com sucesso`});
    }
}

module.exports = new UsersController();