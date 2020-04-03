const express = require("express")
const router = express.Router() //criando uma rota
const Category = require("./Category")
const slugify = require("slugify") //npm install --save slugify

//Exibir tela de nova categoria
router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new")
})

//C - Criar nova Categoria
router.post("/categories/save", (req, res) => { //post = recomentdado para trabalhar com formulários
    var title = req.body.title
    if(title != undefined){ //se o título não for nulo
        Category.create({
            title: title,
            //slug: versão do título otimizada para urls (sem espaço e tudo minúsculo)
            //ex: Computação e Informática => computacao-e-informatica
            slug: slugify(title)
        }).then(() =>{
            res.redirect("/admin/categories")
        })
    }else{
        res.redirect("/admin/categories/new")
    }
})

//R - Listar Categorias
router.get("/admin/categories", (req, res) =>{
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories})
    })
})

//D - Deletar Categoria
router.post("/categories/delete", (req, res) => {
    var id = req.body.id
    if(id != undefined){ //se o id não é nulo
        if(!isNaN(id)){ //se o id for um número / NaN = Not a Number
            Category.destroy({ //destruir / deletar
                where: {
                    id: id //onde o id é igual ao var id passado
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")
    }
})

// Exibir tela de edição de categoria
router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id
    if(isNaN(id)){
        res.render("admin/categories")
    }
    Category.findByPk(id).then(category =>{ //findByPk: método para pesquisar por id de forma mais rápida
        if(category != undefined){
            res.render("admin/categories/edit", {category: category})
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})

// U - Atualizar Categoria
router.post("/categories/update", (req, res) => {
    var id = req.body.id
    var title = req.body.title

    Category.update({title: title, slug: slugify(title)},{ //atualizar o titulo
        where: {
            id: id //na categoria onde o id = id enviado
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router