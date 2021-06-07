import { updatedValues } from '../replaceUniforms';
describe('replaceUniforms', function () {
    it('', function () {
        var result = updatedValues({ factor: 2, i: 2, startCondition: 10 });
        expect(result).toEqual(14);
    });
});
