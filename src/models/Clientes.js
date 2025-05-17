const knex = require('../config/data');

class Cliente
{
    async findAll()
    {
        try{
            let todos_clientes = await knex('clientes').select('*');
            return {valid: true, values: todos_clientes};
        }catch(error){
            return {valid: false, message: error};
        }
    }

    async findOne(id)
    {
        try{
            let todos_clientes = await knex('clientes').select('*').where({idCliente:id});
            return todos_clientes.length>0
                ? {valid: true, values: todos_clientes[0]}
                : {valid: false, message: "Cliente não encontrado."};
        }catch(error){
            return {valid: false, message: error};
        }
    }

    async create(nome, cnpj, cep, telefone)
    {
        try{
            await knex('clientes').insert({
                nome: nome, CNPJ: cnpj, CEP: cep, telefone: telefone
            });

            return {valid: true};
        }catch(error){
            return {valid: false, message: "Erro ao cadastrar cliente."};
        }
    }

    async update()
    {

    }

    async del()
    {

    }
}

module.exports = new Cliente();