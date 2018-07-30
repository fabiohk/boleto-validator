var appRouter = function (app) {
    app.get('/', function(req, res) {
        res.status(200).send('Welcome to our restful API');
    });
    
    app.get('/validaBoleto/linha=:linhaDigit', function(req, res) {
        var boletoValidator = require('../src/boleto-validator');
        console.log(req.params.linhaDigit);
        var result = boletoValidator.boleto(req.params.linhaDigit);
        res.status(200).send(JSON.stringify(result));
    });
}

module.exports = appRouter;
