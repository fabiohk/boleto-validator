exports.boleto = boleto;

/**
 * Valida boletos
 *
 * @example <caption>Exemplo convenio.</caption>
 * // returns {isValid: true, valor: 59.9, codigoBarras: "84820000000599004020000028680260007337750318"}
 * boleto('848200000000 599004020007 002868026006 073377503180');
 * @example <caption>Exemplo titulo.</caption>
 * // returns {isValid: true, valor: 178.32, vencimento: "19/02/2013", codigoBarras: "03394561400000178329632964000000000012520102"}
 * boleto('03399.63290 64000.000006 00125.201020 4 56140000017832');
 * @param {string} linhaDigitavel Linha digitável do boleto. Pode conter
 * espaços, pontos e hífens entre os números. Uma linha digitável é válida
 * apenas se possuir 47 ou 48 dígitos, que correspondem a títulos bancários e
 * convênios, respectivamente.
 */
function boleto(linhaDigitavel) {
    linhaDigitavel = linhaDigitavel.replace(/( |-|\.)/g, '');

    if (/^[0-9]{48}$/.test(linhaDigitavel))
        return convenio(linhaDigitavel);
    else if (/^[0-9]{47}$/.test(linhaDigitavel))
        return titulo(linhaDigitavel);
    else
        return {isValid: false};
}

/**
 * Valida boletos do tipo convênio.
 * 
 * @param {string} linha Linha digitável do boleto, valida corretamente
 * apenas se a linha possuir somente números.
 */
function convenio(linha) {
    var isValid;
    
    // Verifica se a linha digitada possui 48 números
    isValid = /^[0-9]{48}$/.test(linha)

    // Verifica se os dígitos verificadores estão corretos.
    if (isValid) {
        /**
         * Verifica se o dígito verificador é calculado por modulo 10 ou
         * modulo 11.
         * Se o 3º digito for 6 ou 7 é modulo 10, se for 8 ou 9, então
         * utiliza-se o modulo 11.
         */
        isValid = ['6', '7', '8', '9'].indexOf(linha[2]) != -1;
        var isModulo10 = ['6', '7'].indexOf(linha[2]) != -1;

        // Extrai os blocos da linha e verifica se os blocos são válidos.
        var blocos = [];
        blocos[0] = linha.substr(0, 12);
        blocos[1] = linha.substr(12, 12);
        blocos[2] = linha.substr(24, 12);
        blocos[3] = linha.substr(36, 12);
        
        for (var i = 0; i < blocos.length && isValid; ++i) {
            var bloco = blocos[i].slice(0, -1);
            var digito = blocos[i].slice(-1);
            if (isModulo10)
                isValid = verificaModulo10(bloco, digito);
            else
                isValid = verificaModulo11(bloco, digito, true);
        }
    }

    // Verifica se o campo identificação do produto é a constante 8.
    if (isValid)
        isValid = linha[0] == '8';

    // Verifica se o campo identificação do segmento possui um valor válido.
    if (isValid)
        isValid = linha[1] != '0';

    // Extrai o código de barras e verifica se ele é válido.
    if (isValid) {
        var codigoBarras = '';
        for (var i = 0; i < blocos.length; ++i)
            codigoBarras += blocos[i].substr(0, 11);

        var bloco = codigoBarras.slice(0, 3) + codigoBarras.slice(4);
        var digito = codigoBarras[3];
        if (isModulo10)
            isValid = verificaModulo10(bloco, digito);
        else
            isValid = verificaModulo11(bloco, digito, true);
    }

    
    // Extrai o valor do código de barras.
    if (isValid)
        var valor = parseFloat(codigoBarras.substr(4, 9) + '.' +
                               codigoBarras.substr(13, 2));
        
    if (isValid)
        return {isValid: true, valor: valor, codigoBarras: codigoBarras};
    else
        return {isValid: false};
}

/**
 * Valida boletos do tipo títulos bancários. 
 *
 * @param {string} linha Linha digitável do boleto, valida corretamente
 * apenas se a linha possuir somente números.
 */
function titulo(linha) {
    var isValid;

    // Verifica se a linha digitada possui 47 números
    isValid = /^[0-9]{47}$/.test(linha);

    // Trata o campo 1
    if (isValid) {
        var campo1 = linha.substr(0, 9);
        var digito = linha[9];

        var prefixoCodigo = campo1.slice(0, 4);
        var sufixoCodigo = campo1.slice(4);
        isValid = verificaModulo10(campo1, digito);
    }

    // Trata o campo 2
    if (isValid) {
        var campo2 = linha.substr(10, 10);
        digito = linha[20];
        sufixoCodigo += campo2;
        isValid = verificaModulo10(campo2, digito);
    }

    // Trata o campo 3
    if (isValid) {
        var campo3 = linha.substr(21, 10);
        digito = linha[31];
        sufixoCodigo += campo3;
        isValid = verificaModulo10(campo3, digito);
    }

    // Trata o campo 5 (fator de vencimento e valor do boleto)
    if (isValid) {
        var campo5 = linha.substr(33);
        var today = new Date();
        var vencimento = new Date(2025, 1, 22);
        if (today >= vencimento)
            vencimento.setDate(vencimento.getDate()-1000);
        else
            vencimento.setDate(vencimento.getDate()-10000);

        var fatorVencimento = parseInt(campo5.slice(0, 4));
        var valor;
        if (fatorVencimento < 1000) // Não existe fator de vencimento!
            valor = parseFloat(campo5.slice(0, -2) + '.' + campo5.slice(-2));
        else {
            vencimento.setDate(vencimento.getDate() + fatorVencimento);
            valor = parseFloat(campo5.slice(4, -2) + '.' + campo5.slice(-2));
        }
    
        // Verifica o código de barras
        var bloco = prefixoCodigo + campo5 + sufixoCodigo;
        digito = linha[32];
        isValid = verificaModulo11(bloco, digito, false);
    }

    if (isValid) {
        var codigoBarras = prefixoCodigo + digito + campo5 + sufixoCodigo;
        if (fatorVencimento < 1000)
            return {isValid: true, valor: valor, codigoBarras: codigoBarras};
        else
            return {isValid: true,
                    valor: valor,
                    vencimento: vencimento.toLocaleString('pt-br',
                                                          {year: 'numeric',
                                                           month: 'numeric',
                                                           day: 'numeric'}),
                    codigoBarras: codigoBarras};
    }
    else
        return {isValid: false};
}

/**
 * Verifica se o bloco é válido, utilizando módulo 10.
 *
 * @param {string} bloco Bloco a ser verificado.
 * @param digito Digito informado.
 */
function verificaModulo10(bloco, digito) {
    if (digito.length != 1 || !/^[0-9]$/.test(digito))
        throw new RangeError('digito must be one numeric character');
     
    var somatorio = 0, multiplicador = 2;
    
    for (var i = bloco.length-1; i >= 0; --i) {
        var produto = (parseInt(bloco[i]) % 10) * multiplicador;
        while (produto > 0) {
            somatorio += produto % 10;
            produto = Math.floor(produto / 10);
        }

        // Atualiza valores
        if (multiplicador % 2)
            multiplicador = 2;
        else
            multiplicador = 1;
    }
    var resto = somatorio % 10;
    var digitoApurado = resto == 0 ? resto : 10-resto;
    
    return digitoApurado == parseInt(digito);
}

/**
 * Verifica se o bloco é válido, utilizando módulo 11.
 *
 * @param {string} bloco Bloco a ser verificado.
 * @param digito Digito informado.
 * @param {boolean} zeroValido Informa se o digito zero é válido (se é
 * permitido utilizá-lo como dígito verificador).
 */
function verificaModulo11(bloco, digito, zeroValido) {
    if (digito.length != 1 || !/^[0-9]$/.test(digito))
        throw new RangeError('digito must be one numeric character');
    
    var somatorio = 0, multiplicador = 2;
    
    for (var i = bloco.length-1; i >= 0; --i) {
        somatorio += (parseInt(bloco[i]) % 10) * multiplicador;

        multiplicador++;
        if (multiplicador > 9)
            multiplicador = 2;
    }
    var resto = somatorio % 11;
    var digitoApurado = resto <= 1 ? 0 : 11-resto;
    if (!zeroValido && digitoApurado == 0)
        digitoApurado = 1;

    return parseInt(digito) == digitoApurado;
}
