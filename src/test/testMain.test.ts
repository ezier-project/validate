import {
    EzierValidatorError,
    EzierValidatorStringSchema,
    StringSchema,
} from '../main/index';
import { v4 } from 'uuid';

let hasErrored = false;

function validate(
    value: string,
    schema: EzierValidatorStringSchema
): EzierValidatorError[] {
    return new StringSchema({ value: schema }).validate({ value });
}

function checkError(result: EzierValidatorError[], done: Mocha.Done): void {
    if (result[0]) {
        hasErrored = true;
        done(result[0].message);
    }
}

function validateExactLength(done: Mocha.Done): void {
    checkError(validate('astring', { length: 7 }), done);
}

function validateMinLength(done: Mocha.Done): void {
    checkError(validate('strmin', { minLength: 6 }), done);
}

function validateMaxLength(done: Mocha.Done): void {
    checkError(validate('strmax', { maxLength: 6 }), done);
}

function validateRegex(done: Mocha.Done): void {
    checkError(
        validate(v4(), {
            regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        }),
        done
    );
}

it('string validation', done => {
    validateExactLength(done);
    validateMinLength(done);
    validateMaxLength(done);
    validateRegex(done);

    !hasErrored && done();
});
