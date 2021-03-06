const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")
const adminAuth = require("../middlewares/adminAuth") //requisição ao middleware de autenticação

//listar usuários cadastrados
router.get("/admin/users", adminAuth, (req, res) =>{
    User.findAll().then(users =>{
        res.render("admin/users/index", {users: users})
    })
})

//carregar a página de registro de usuário
router.get("/admin/users/create", adminAuth, (req, res) =>{
    res.render("admin/users/create")
})

//C - Salvar usuário
router.post("/users/create", adminAuth, (req, res) =>{
    var email = req.body.email
    var password = req.body.password

    User.findOne({where:{email: email}}).then(user => { //procura o usuário pelo email informado
        if(user == undefined){ //se não encontrar
            var salt = bcrypt.genSaltSync(10) //adicionar um 'sal'(salt) a mais no hash
            var hash = bcrypt.hashSync(password, salt) //criar o hash da senha

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users")
            }).catch((erro) =>{
                res.redirect("/admin/users/create")
            })
        }else{ //se encontrar retorna
            res.redirect("/admin/users/create")
        }
    })
})

//exibir tela de login
router.get("/login", (req, res) =>{
    res.render("admin/users/login")
})

//fazer a autenticação do usuário
router.post("/authenticate", (req, res) =>{
    var email = req.body.email
    var password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined){ //se existe um usuário com este email
            //validar senha
            var correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user = { //req.session.user já vem implementado no express para guardar sessões de usuário
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    })
})

router.get("/logout", (req, res) =>{
    req.session.user = undefined //deixa o user nulo
    res.redirect("/")
})

module.exports = router