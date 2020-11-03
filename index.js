const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session") //incluir biblioteca de sessão
const connection = require("./database/database")

//importando arquivo CategoriesController.js da pasta categories
const categoriesController = require("./categories/CategoriesController")
//importando arquivo ArticlesController.js da pasta categories
const articlesController = require("./articles/ArticlesController")
//importando arquivo UsersController.js da pasta user
const usersController = require("./user/UsersControler")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./user/User")

// View engine
app.set('view engine','ejs')

// Session
app.use(session({
    secret: "qualquercoisa", //palavra aleatória (tipo senha) para decryptar suas sessões e aumentar a segurança
    cookie: {maxAge: 30000000} //referência para a sessão do usuário / maxAge: tempo de expiração do cookie, no caso..
    //da própria sessão (30.000 milisegundos = 30 segundos)
}))

// Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// Database

connection
    .authenticate()
    .then(() => { //caso a authenticação tenha sucesso!
        console.log("Conexão feita com sucesso!");
    }).catch((error) => { //caso a authenticação não tenha sucesso!
        console.log(error);
    })

//utilizando as rotas que estão no arquivo 'CategoriesController.js' na pasta categories
app.use("/",categoriesController)
//utilizando as rotas que estão no arquivo 'ArticlesController.js' na pasta articles 
app.use("/",articlesController)
//utilizando as rotas que estão no arquivo 'UsersController.js' na pasta users
app.use("/", usersController)

//mostra a página inicial com todos os artigos
app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4 //mostrar apenas os 4 primeiros registros da busca
    }).then(articles =>{
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories})
        })
    })
})

app.get("/:slug", (req, res) =>{
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(error =>{
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] //fazendo um join com a tabela artigo: trás todos os artigos desta categoria
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.listen(8080, () => {
    console.log("O servidor está rodando!")
})