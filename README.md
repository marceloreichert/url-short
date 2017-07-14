# Encurtador de URL


### Iniciando

Encurtador de URL desenvolvido em Node.js, usando MongoDB para armazenar as urls. 

Composto por 3 rotas que respondem aos seguintes endpoints: 
* Route users
- POST   /users/
- POST   /users/:userid/urls
- GET    /users/:userid/stats
- DELETE /users/:userid

* Route urls
- GET    /urls/:id
- DELETE /urls/:id

* Route stats
- GET /stats/
- GET /stats/:id


### Pré-Requisitos

* Node.js 
* MondoDB
* Mocha 


### Configuração

Para alterar os parametros de inicialização, alterar as variáveis do arquivo .ENV
Porta de inicialização -> PORT = 3000
Endereço do MongoDB produção -> MONGODB_URI = mongodb://localhost:27017/urlshorten
Endereço do MongoDB teste -> MONGODB_URI_TEST = mongodb://localhost:27017/urlshorten_test
Inicializar como produção/teste NODE_ENV = production/test
HOST = 'http://localhost:3000/'


### Testes

Executar mocha no Terminal.
