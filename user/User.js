const Sequelize = require("sequelize")
const connection = require("../database/database")

const User = connection.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull: false 
    },password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//User.sync({force: false}) //executa apenas uma vez como true senão cria a tabela denovo

module.exports = User