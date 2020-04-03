const Sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false 
    },slug: {//endereço da categoria -> Desenvolvimento Web => desenvolvimento-web (versão em slug)
        type: Sequelize.STRING,
        allowNull: false 
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article) //relacionamento 1 p muitos: Category tem vários Articles
Article.belongsTo(Category) //relacionamento 1 p 1: Article pertence a Category
//pode ter os dois (de mão dupla) ou somente 1 destes relacionamentos

//Article.sync({force: true}) //executa apenas uma vez como true

module.exports = Article