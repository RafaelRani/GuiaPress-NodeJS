//arquivo responsável por estabelecer a comunicação com o bd 'guiapress'

const Sequelize = require("sequelize") //importatndo a biblioteca sequelize para bd

//configurando o bd: 'nome_do_bd', 'usuário', 'senha'
const connection = new Sequelize('guiapress','root','rafarani008',{
    host: 'localhost', //endereço
    dialect: 'mysql', // tipo de banco de dados
    timezone: '-03:00' //timezone do Brasil
})

module.exports = connection