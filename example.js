var boletoValidator = require('./src/boleto-validator');

// returns {isValid: true, valor: 178.32, vencimento: "19/02/2013", codigoBarras: "03394561400000178329632964000000000012520102"}
console.log("boletoValidator.boleto('03399.63290 64000.000006 00125.201020 4 56140000017832')" + ' Returns:')
console.log(boletoValidator.boleto('03399.63290 64000.000006 00125.201020 4 56140000017832'))

// returns {isValid: true, valor: 178.32, vencimento: "19/02/2013", codigoBarras: "03394561400000178329632964000000000012520102"}
console.log("boletoValidator.boleto('03399632906400000000600125201020456140000017832')" + ' Returns:')
console.log(boletoValidator.boleto('03399632906400000000600125201020456140000017832'))

// returns {isValid: true, valor: 59.9, codigoBarras: "84820000000599004020000028680260007337750318"}
console.log("boletoValidator.boleto('848200000000 599004020007 002868026006 073377503180')" + ' Returns:')
console.log(boletoValidator.boleto('848200000000 599004020007 002868026006 073377503180'))

// returns {isValid: false}
console.log("boletoValidator.boleto('03399632906400000000600125201020456140000017831')" + ' Returns:')
console.log(boletoValidator.boleto('03399632906400000000600125201020456140000017831'))
