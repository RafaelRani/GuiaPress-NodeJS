/*
    middleware: função intermediária entre a requisição e a resposta 
*/
//middleware de autenticação de usuários
function adminAuth(req, res, next){
    if(req.session.user != undefined){ //se o usuário está logado
        next()
    }else{ //se não está logado
        res.redirect("/login") //redireciona para a home page
    }
}

module.exports = adminAuth