import { EzierValidatorError, validateString } from '../main/index';
import { v4 } from 'uuid';

let hasErrored = false;

function checkError(result: undefined | EzierValidatorError, done: Mocha.Done): void {
    if(result) {
        hasErrored = true;
        done(result.message);
    }
}

function validateExactLength(done: Mocha.Done): void {
    checkError(validateString('astring', {
        length: 7
    }), done);
}

function validateMinLength(done: Mocha.Done): void {
    checkError(validateString('strmin', {
        minLength: 6
    }), done);
}

function validateMaxLength(done: Mocha.Done): void {
    checkError(validateString('strmax', {
        maxLength: 6
    }), done);
}

function validateRegex(done: Mocha.Done): void {
    checkError(validateString(v4(), {
        regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    }), done);
}

it('string validation', done => {
    validateExactLength(done);
    validateMinLength(done);
    validateMaxLength(done);
    validateRegex(done);

    !hasErrored && done();
});
