var chai = require('chai');
var expect = chai.expect;
var boletoValidator = require('../src/boleto-validator');

describe('boletoValidator', function() {
    it("boleto('03399.63290 64000.000006 00125.201020 4 56140000017832') should return the object: {isValid: true, valor: 178.32, vencimento: '19/02/2013', codigoBarras: '03394561400000178329632964000000000012520102'}", function() {
        var result = boletoValidator.boleto('03399.63290 64000.000006 00125.201020 4 56140000017832');
        var expected = {isValid: true, valor: 178.32, vencimento: '19/02/2013', codigoBarras: '03394561400000178329632964000000000012520102'};
        expect(result.isValid).to.equal(expected.isValid);
        expect(result.valor).to.equal(expected.valor);
        expect(result.codigoBarras).to.equal(expected.codigoBarras);
    });
    
    it("boleto('848200000000 599004020007 002868026006 073377503180') should return the object: {isValid: true, valor: 59.9, codigoBarras: '84820000000599004020000028680260007337750318'}", function() {
        var result = boletoValidator.boleto('848200000000 599004020007 002868026006 073377503180');
        var expected = {isValid: true, valor: 59.9, codigoBarras: "84820000000599004020000028680260007337750318"};
        expect(result.isValid).to.equal(expected.isValid);
        expect(result.valor).to.equal(expected.valor);
        expect(result.codigoBarras).to.equal(expected.codigoBarras);
    });

    it("boleto('848200000000599004020007002868026006073377503180') should return the object: {isValid: true, valor: 59.9, codigoBarras: '84820000000599004020000028680260007337750318'}", function() {
        var result = boletoValidator.boleto('848200000000599004020007002868026006073377503180');
        var expected = {isValid: true, valor: 59.9, codigoBarras: "84820000000599004020000028680260007337750318"};
        expect(result.isValid).to.equal(expected.isValid);
        expect(result.valor).to.equal(expected.valor);
        expect(result.codigoBarras).to.equal(expected.codigoBarras);
    });

    it("boleto('848200000000599004020007002868026006073377503181') should return the object: {isValid: false}", function() {
        var result = boletoValidator.boleto('848200000000599004020007002868026006073377503181');
        var expected = {isValid: false};
        expect(result.isValid).to.equal(expected.isValid);
    });
});
