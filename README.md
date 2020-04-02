# GuiaPress-NodeJS
Aplicação do Curso Formação NodeJS

# Requisitos:
- Fazer o CRUD de Categorias e Artigos;
- Fazer o loguin e autenticação para realizar CRUD das Categoria e Artigos; 
- Fazer paginação dos artigos;

# Pre-Requisitos:
- Ter o NodeJS instalado
- Ter o MySQL instalado

# Como rodar a aplicação:
1. Abra o MySQL e crie um novo bd com o nome 'guiapress' (pode ser mudado):<br>
  create database guiapress;
  
2. Abra o bd criado e execute os seguintes comandos:<br>
  use guiapress; <br>
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '[senha-do-usuario]'
  
3. Configure a conexão da aplicação ao bd, inserindo sua senha de usuário mysql, no arquivo 'database/database.js'<br>
  const connection = new Sequelize('guiapress', 'root', '[senha-do-usuário]',{<br>
      host: 'localhost',<br>
      dialect: 'mysql'<br>
  })

4. Instale as dependências, abrindo a pasta do projeto no CMD e utilizando o comando:<br>
  $ npm install
  
5. Rode a aplicação com o comando:<br>
  $ nodemon index.js
