require('dotenv').config();
const api = require('./src/api')

api.listen(process.env.PORT,()=>{
    console.log(`\n API rodando na porta ${process.env.PORT}`)
})
