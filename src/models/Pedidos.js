const knex = require('../config/data');

class Pedidos
{
    async findAll()
    {
        try
        {
            const pedidos = await knex.select(['idpedidos', 'status', 'data']).table('pedidos');
            return {valid: true, values: pedidos};
        }
        catch(error)
        {
            return {valid: false, error: error};
        }
    }
}

module.exports = new Pedidos();