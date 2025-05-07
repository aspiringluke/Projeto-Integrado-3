const Users = require('../models/Users');
const hashPasswordService = require('../services/hash_password_service');


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
        let id = req.params.id;
        if(isNaN(id)){
            res.status(406).json({success:false, message: "Parâmetros inválidos"});
            return;
        }

        let result = await Users.findById();
        if (!(result.valid)){
            res.status(404).json({success: false, message: result.error})
        }
        else{
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
        
        let {nome, email, senha, funcao} = req.body;

        let result = await Users.create(nome, email, hashPasswordService(senha), funcao);

        ! (result.valid)
        ? res.status(500).json({success: false, message: result.error})
        : res.status(201).json({success: true, message: "Usuário criado com sucesso"});
    }


    async updateUser(req,res)
    {
        /**
         * passa o id nos params
         * atualiza tudo o que não for null
         */
        let id = req.params.id;
        if(isNaN(id)){
            res.status(406).json({success:false, message: "Parâmetros inválidos"});
            return;
        }

        let {nome, email, funcao} = req.body;

        let result = await Users.update(id, nome, email, funcao);

        if (result.valid){
            res.status(200).json({success: true, message: `Usuário atualizado com sucesso`});
        }
        else {
            result.error === undefined
            ? res.status(404).json({success: false, message: "Não há nenhum usuário com esse ID."})
            : res.status(500).json({success: false, message: result.error});
        }
    }

    async deleteUser(req,res)
    {
        let id = req.params.id;

        if(isNaN(id))        {
            res.status(406).json({success:false, message: "Parâmetros inválidos"});
        }else{
            let result = await Users.delete(id);

            (result.valid)
            ? res.status(200).json({success: true, message: result.message})
            : res.status(404).json({success: false, message: result.error});
        }
    }
}

module.exports = new UsersController();