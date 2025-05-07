const knex = require('../config/data');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;


class Users
{
    async findAll()
    {
        try
        {
            let users = await knex.select(["idUsuario","nome","email"]).table("usuarios");
            return {valid: true, values: users};
        } catch (error)
        {
            return {valid: false, error: error};
        }
    }
    
    async findById(id)
    {
        try
        {
            let user = await knex.select(["idUsuario","nome","email"]).table("usuarios").where({idUsuario: id});
        
        return (user.length > 0)
        ? {valid: true, values: user}
        : {valid: true, values: undefined};
        } catch (error)
        {
            return {valid: false, error: error};
        }
    }

    async create(nome, email, senha, funcao) {
        try {
            // Criptografa a senha antes de salvar no banco
            const hashedPassword = await bcrypt.hash(senha, 10); // 10 é o número de "salt rounds"
    
            await knex('usuarios')
                .insert({
                    nome: nome,
                    email: email,
                    senha: hashedPassword,
                    Funcao_idFuncao: funcao
                });
            return { valid: true };
        } catch (error) {
            return { valid: false, error: error };
        }
    }

    /**
     * Funciona apenas para um único valor.
     * Precisa permitir atualização de colunas simultâneas
     * ou pelo menos várias iterações.
     * Também é preciso impedir a alteração de IDs
     */
    async update(id, nome, email, funcao)
    {
        let user = await this.findById(id);
        if(user.valid){
            if(user.values === undefined) return {valid: false, error: undefined};
            else{
                let userInfo = {};

                nome !== undefined ? userInfo.nome = nome : null;
                email !== undefined ? userInfo.email = email : null;
                funcao !== undefined ? userInfo.funcao = funcao : null;

                try {
                    await knex('usuarios').update(userInfo).where({idUsuario: id});

                    return {valid: true, message: "Usuário atualizado com sucesso."};
                } catch (error) {
                    return {valid: false, error: error};
                }
            }
        }else{
            return {valid: false, error: user.error}
        }
    }

    async delete(id)
    {
        let user = await this.findById(id);

        if(user.valid){
            if(user.values !== undefined){
                try {
                    await knex("usuarios").delete().where({idUsuario:id});
                    return {valid: true, message: "Usuário excluído com sucesso."};
                } catch (error) {
                    return {valid: false, error: error};
                }
            }
            else{
                return {valid: false, error: "Usuário não encontrado."}
            }
        }
        else{
            return {valid: false, error: user.error};
        }
    }

    async login(email, senha) {
        try {
            
            let user = await knex('usuarios').where({ email }).first();
            
            if (!user) {
                return { valid: false, message: 'Usuário não encontrado.' };
            }

            const isPasswordValid = await bcrypt.compare(senha, user.senha);

            if (!isPasswordValid) {
                return { valid: false, message: 'Senha incorreta.' };
            }

            const token = jwt.sign({ id: user.idUsuario, email: user.email }, SECRET, { expiresIn: '1h' });

            return { valid: true, token };
        } catch (error) {
            console.error(error);
            return { valid: false, message: 'Erro interno no servidor.' };
        }
    }
     
    
}








module.exports = new Users();