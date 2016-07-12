import {expect} from 'chai';
import HttpError from '../../src/errors/HttpError';

describe('HTTP errors.', function () {
    it('should extend Error".', function (done) {
        let error = new HttpError();
        expect(error).to.be.an.instanceof(Error);

        done();
    });
});
