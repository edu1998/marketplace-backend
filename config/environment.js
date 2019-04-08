//  VARIABLES DE ENTORNO

//PUERTO
process.env.PORT = 7575;

//CONFIGURACIONES MYSQL
process.env.HOST = 'localhost';
process.env.USER = 'eduardo';
process.env.PORT_MYSQL = 3306;
process.env.PASSWORD = 'nojoda69';
process.env.DB = 'marketplace';


//DEPLOY STATUS;
// dev = desarrollo <==> product = produccion 
process.env.DEPLOY = 'dev';
