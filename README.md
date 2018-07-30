# Validador de boletos

API para validação de boletos do tipo convênio (composto por 4 blocos de números) [1] e de títulos bancários (composto por 5 campos) [2].

# Uso

$ npm app.js

Criará um servidor HTTP local (localhost:3000), que poderá ser testado com:

$ localhost:3000/validaBoleto/linha=:linhaDigitavel

Onde linhaDigitavel corresponde a linha digitável do boleto.

# Exemplos

## Exemplo 1:
```
localhost:3000/validaBoleto/linha=848200000000 599004020007 002868026006 073377503180
```
Retorna:
```
{"isValid":true,"valor":59.9,"codigoBarras":"84820000000599004020000028680260007337750318"}
```

## Exemplo 2:
```
localhost:3000/validaBoleto/linha=848200000000599004020007002868026006073377503180
```
Retorna:
```
{"isValid":true,"valor":59.9,"codigoBarras":"84820000000599004020000028680260007337750318"}
```

## Exemplo 3:
```
localhost:3000/validaBoleto/linha=03399.63290%2064000.000006%2000125.201020%204%2056140000017832
```
Retorna:
```
{"isValid":true,"valor":178.32,"vencimento":"2013-2-19","codigoBarras":"03394561400000178329632964000000000012520102"}
```

## Exemplo 4:
```
localhost:3000/validaBoleto/linha=03399632906400000000600125201020456140000017831
```
Retorna:
```
{"isValid":false}
```

# Uso em código
```js
var boletoValidator = require('./src/boleto-validator');

// returns {isValid: true, valor: 178.32, vencimento: "19/02/2013", codigoBarras: "03394561400000178329632964000000000012520102"}
boletoValidator.boleto('03399.63290 64000.000006 00125.201020 4 56140000017832')

// returns {isValid: true, valor: 178.32, vencimento: "19/02/2013", codigoBarras: "03394561400000178329632964000000000012520102"}
boletoValidator.boleto('03399632906400000000600125201020456140000017832')

// returns {isValid: true, valor: 59.9, codigoBarras: "84820000000599004020000028680260007337750318"}
boletoValidator.boleto('848200000000 599004020007 002868026006 073377503180')

// returns {isValid: false}
boletoValidator.boleto('03399632906400000000600125201020456140000017831')
```

# Referências
[1] http://www.febraban.org.br/7Rof7SWg6qmyvwJcFwF7I0aSDf9jyV/sitefebraban/Codbar4-v28052004.pdf
[2] https://www.bb.com.br/docs/pub/emp/empl/dwn/Doc5175Bloqueto.pdf
