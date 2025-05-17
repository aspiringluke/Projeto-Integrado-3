const clientes = require('../models/Clientes');

class ClientesController
{
    async listAll(req,res)
    {
        let todos_clientes = await clientes.findAll();

        if(todos_clientes.valid){
            res.status(200).json({success: true, values: todos_clientes.values});
        }
        else{
            res.status(404).json({success: false, message: todos_clientes.message});
        }
    }

    async listOne(req,res)
    {
        const id = req.params.id;
        if(isNaN(id)){
            return res.status(406).json({success: false, message: "Parâmetro inválido."});
        }

        let cliente = await clientes.findOne(id);

        cliente.valid
        ? res.status(200).json({success: true, values: cliente.values})
        : res.status(404).json({success: false, message: cliente.message})
    }

    async createCliente(req,res)
    {
        let { nome, cnpj, cep, telefone } = req.body;
        let result = await clientes.create(nome,cnpj,cep,telefone);

        result.valid
        ? res.status(201).json({success: true, message: "Cliente criado com sucesso."})
        : res.status(500).json({success: false, message: result.message});
    }

    async updateCliente(req,res)
    {

    }

    async deleteCliente(req,res)
    {

    }
}

module.exports = new ClientesController();
