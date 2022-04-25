// **************************************************************** //
//                 An ezier validator for nodejs.                   //
// **************************************************************** //

import { format } from 'util';

export interface EzierValidatorStringSchema {
    length?: number;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
}

// Errors
export interface EzierValidatorExtras extends EzierValidatorStringSchema {}

export type EzierValidatorErrors =
    | 'STRING_INVALID_LENGTH'
    | 'STRING_INVALID_MIN_LENGTH'
    | 'STRING_INVALID_MAX_LENGTH'
    | 'STRING_INVALID_REGEX';

const EzierValidatorErrorTemplates: {
    [Error in EzierValidatorErrors]: string;
} = {
    STRING_INVALID_LENGTH: '%s must consist of exactly %i characters.',
    STRING_INVALID_MIN_LENGTH: '%s must contain a minimum of %i characters.',
    STRING_INVALID_MAX_LENGTH: '%s must contain a maximum of %i characters.',
    STRING_INVALID_REGEX: "%s doesn't match the required regex pattern.",
};

export interface EzierValidatorError {
    message: string;
    code: number;
    extras?: EzierValidatorExtras;
}

function generateError(
    errorName: EzierValidatorErrors,
    formatArgs?: any[],
    extras?: EzierValidatorExtras
): EzierValidatorError {
    // TODO: Custom errors, probably callbacks acting as middleware
    return {
        message: formatArgs
            ? format(EzierValidatorErrorTemplates[errorName], ...formatArgs)
            : EzierValidatorErrorTemplates[errorName],
        code: Object.keys(EzierValidatorErrorTemplates).indexOf(errorName) + 1,
        extras,
    };
}

export function validateString(
    value: string,
    schema: EzierValidatorStringSchema
): undefined | EzierValidatorError {
    if (!value) {
        throw new Error('No value provided.');
    }

    if (!schema) {
        throw new Error('No schema provided.');
    }

    if (schema.length && value.length != schema.length) {
        return generateError(
            'STRING_INVALID_LENGTH',
            ['Value', schema.length],
            {
                length: schema.length,
            }
        );
    }

    if (schema.minLength && value.length < schema.minLength) {
        return generateError(
            'STRING_INVALID_MIN_LENGTH',
            ['Value', schema.minLength],
            {
                minLength: schema.minLength,
            }
        );
    }

    if (schema.maxLength && value.length > schema.maxLength) {
        return generateError(
            'STRING_INVALID_MAX_LENGTH',
            ['Value', schema.maxLength],
            {
                maxLength: schema.maxLength,
            }
        );
    }

    if (schema.regex && !value.match(schema.regex)) {
        return generateError('STRING_INVALID_REGEX', ['Value'], {
            regex: schema.regex,
        });
    }
}
