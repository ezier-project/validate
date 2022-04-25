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
    name: EzierValidatorErrors;
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
        name: errorName,
        extras,
    };
}

export function validateString(
    value: string,
    schema: EzierValidatorStringSchema
): EzierValidatorError[] {
    if (!value) {
        throw new Error('No value provided.');
    }

    if (!schema) {
        throw new Error('No schema provided.');
    }

    const errorsList: EzierValidatorError[] = [];

    if (schema.length && value.length != schema.length) {
        errorsList.push(
            generateError('STRING_INVALID_LENGTH', ['Value', schema.length], {
                length: schema.length,
            })
        );
    }

    if (schema.minLength && value.length < schema.minLength) {
        errorsList.push(
            generateError(
                'STRING_INVALID_MIN_LENGTH',
                ['Value', schema.minLength],
                {
                    minLength: schema.minLength,
                }
            )
        );
    }

    if (schema.maxLength && value.length > schema.maxLength) {
        errorsList.push(
            generateError(
                'STRING_INVALID_MAX_LENGTH',
                ['Value', schema.maxLength],
                {
                    maxLength: schema.maxLength,
                }
            )
        );
    }

    if (schema.regex && !value.match(schema.regex)) {
        errorsList.push(
            generateError('STRING_INVALID_REGEX', ['Value'], {
                regex: schema.regex,
            })
        );
    }

    return errorsList;
}
