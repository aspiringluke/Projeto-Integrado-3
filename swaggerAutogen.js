const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger/swagger_output.json';
const routes = ['./src/routes/router.js'];

const doc = {
    info: {
        version: '1.0.0',
        title: 'API de Cadastro de Pedidos',
        description: 'Api de cadastro para a Argenzio de Casa Branca'
    },
    host: '3.148.112.54:4040',
    basePath: '/',
    scheme: [],
    consumes: [],
    produces: [],
    tags: [],
    securityDefinitions: {},
    definitions: {},
    components: {}
};

swaggerAutogen(outputFile, routes, doc);