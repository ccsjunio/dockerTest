/* import environmental variables */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const PORT = process.env.ENV_PORT !== undefined ? process.env.ENV_PORT : 10000;

/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */
app.listen(PORT, function(){
	console.log('server on line - front end - mode: ' + process.env.NODE_ENV + ' - listening on port ' + PORT);
})

console.log(process.env);
