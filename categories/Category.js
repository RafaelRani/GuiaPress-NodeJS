const Sequelize = require("sequelize")
const connection = require("../database/database")

const Category = connection.define('categories', {
    title:{
        type: Sequelize.STRING,
        allowNull: false 
    },slug: {//endereço da categoria -> Desenvolvimento Web => desenvolvimento-web (versão em slug)
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Category.sync({force: true}) //executa apenas uma vez como true senão cria a tabela denovo

module.exports = Category