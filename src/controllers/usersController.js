const Users = require('../models/Users');
const hashPasswordService = require('../services/hash_password_service');
const jwt = require('jsonwebtoken');
/**
 * TODO: Adicionar verificações dos parâmetros em todas as queries
 */

const SECRET = process.env.JWT_SECRET;


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

        if(isNaN(id))
        {
            res.status(406).json({success:false, message: "Parâmetros inválidos"});
        }else{
            let result = await Users.delete(id);

            (result.valid)
            ? res.status(200).json({success: true, message: result.message})
            : res.status(404).json({success: false, message: result.error});
        }
    }



    async loginUser(req, res) {
        console.log("Rota /user/login acessada!");
        console.log("Corpo da requisição:", req.body);
        const { email, senha } = req.body;

      
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'E-mail e senha são obrigatórios.'
            });
        }

        try {
            const result = await Users.login(email, senha);  

            if (result.valid) {
    
                res.status(200).json({
                    success: true,
                    message: 'Login bem-sucedido.',
                    token: result.token
                });
            } else {

                res.status(401).json({
                    success: false,
                    message: result.message || 'Credenciais inválidas.'
                });
            }
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno no servidor.'
            });
        }
    }    


}

module.exports = new UsersController();