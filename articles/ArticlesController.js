const express = require("express")
const router = express.Router() //para criação das rotas
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth") //requisição ao middleware de autenticação

//R- mostrar os artigos
router.get("/admin/articles", adminAuth, (req, res) => { //chama o middleware de autenticação
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        include: [{model: Category}] //puxar os dados da categoria do artigo, através do relacionamento
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })
})

// exibir template de criação de artigos
router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    })
})

//C - salvar artigos
router.post("/articles/save", adminAuth, (req, res) => {
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category //foreing-key de Categoria
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

//D - Deletar artigos
router.post("/articles/delete", adminAuth, (req, res) => {
    var id = req.body.id
    if(id != undefined){ //se o id não é nulo
        if(!isNaN(id)){ //se o id for um número / NaN = Not a Number
            Article.destroy({ //destruir / deletar
                where: {
                    id: id //onde o id é igual ao var id passado
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")
    }
})

// Exibir tela de edição de artigos
router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id
    if(isNaN(id)){
        res.render("admin/articles")
    }
    Article.findByPk(id).then(article =>{ //findByPk: método para pesquisar por id de forma mais rápida
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit", {article: article, categories: categories})
            }).catch(erro => {
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }).catch(erro => {
        res.redirect("/admin/articles")
    })
})

// U - Atualizar Artigo
router.post("/articles/update", adminAuth, (req, res) => {
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update({title: title, slug: slugify(title), body: body, categoryId: category},{ //atualizar todos os campos
        where: {
            id: id //na categoria onde o id = id enviado
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(erro =>{
        res.redirect("/admin/articles")
    })
})

/*
paginação:
exibir o conteúdo dos artigos em formato json:
irá exibir 4 artigos por página:
página 1 = 0 ao 3 (o offset será 0)
página 2 = 4 ao 7 (o offset será 4)
página 3 = 8 ao 11 (o offset será 8)
página 4 = 12 ao 15
página 5 = 16 ao 19
*/
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num
    var offset = 0
    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page) - 1) * 4
    }
    Article.findAndCountAll({ //retornar e contar todos
        limit: 4, //mostra apenas os 4 primeiros registros
        offset: offset, //mostra a partir do número do registro contido na var offset
        order:[
            ['id', 'DESC']
        ]
    }).then(articles =>{ //retorna todos os registros da tabela e a quantida de registros
        var next
        if(offset + 4 >= articles.count){ //se o offset atual + qtd de artigos por página > numero de artigos: já não existe outra página a ser exibida
            next = false //chegou na última página
        }else{
            next = true //não chegou na última página
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        Category.findAll().then(categories =>{
            res.render("admin/articles/page", {result: result, categories: categories})
        })
        //res.json(result) //renderiza em formato json
    })
})

module.exports = router