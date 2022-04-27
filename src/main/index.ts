// **************************************************************** //
//                 An ezier validator for nodejs.                   //
// **************************************************************** //

import { format } from 'util';

export interface EzierValidatorSchema {
    optional?: boolean;
}

// Strings
type EzierValidatorStringType = 'email';

const EzierValidatorStringTypeRegex: {
    [Type in EzierValidatorStringType]: RegExp;
} = {
    // https://ihateregex.io/expr/email
    email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
};

export interface EzierValidatorStringSchema extends EzierValidatorSchema {
    length?: number;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    type?: EzierValidatorStringType;
}

// Errors
export interface EzierValidatorExtras extends EzierValidatorStringSchema {
    key: string;
}

export type EzierValidatorErrors =
    | 'STRING_REQUIRED'
    | 'STRING_INVALID_LENGTH'
    | 'STRING_INVALID_MIN_LENGTH'
    | 'STRING_INVALID_MAX_LENGTH'
    | 'STRING_INVALID_REGEX'
    | 'STRING_INVALID_TYPE';

const EzierValidatorErrorTemplates: {
    [Error in EzierValidatorErrors]: string;
} = {
    STRING_REQUIRED: "Key '%s' is required.",
    STRING_INVALID_LENGTH: "Key '%s' must consist of exactly %i characters.",
    STRING_INVALID_MIN_LENGTH:
        "Key '%s' must contain a minimum of %i characters.",
    STRING_INVALID_MAX_LENGTH:
        "Key '%s' must contain a maximum of %i characters.",
    STRING_INVALID_REGEX: "Key '%s' doesn't match the required regex pattern.",
    STRING_INVALID_TYPE: "Key '%s' was expected to be of type %s.",
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

// General
function checkArgsExistance(
    consumedKeys: string[],
    schema: { [key: string]: EzierValidatorSchema }
): void {
    for (const keyValue in schema) {
        if (
            consumedKeys.indexOf(keyValue) == -1 &&
            !schema[keyValue].optional
        ) {
            throw new Error(
                `Key \'${keyValue}\' was not passed and is not optional.`
            );
        }
    }
}

// Strings
export class StringSchema {
    schema!: { [key: string]: EzierValidatorStringSchema };

    constructor(schema: { [key: string]: EzierValidatorStringSchema }) {
        if (!schema || Object.keys(schema).length == 0) {
            throw new Error('No schema provided.');
        }

        // Sanity checks
        for (const schemaKey in schema) {
            const schemaValue = schema[schemaKey];

            if (
                (schemaValue.length && schemaValue.length < 0) ||
                (schemaValue.minLength && schemaValue.minLength < 0) ||
                (schemaValue.maxLength && schemaValue.maxLength < 0)
            ) {
                throw new Error(
                    `Schema for key \'${schemaKey}\' contains negative length values.`
                );
            }

            if (
                schemaValue.minLength &&
                schemaValue.maxLength &&
                schemaValue.minLength > schemaValue.maxLength
            ) {
                throw new Error(
                    `Schema for key \'${schemaKey}\' has a higher minLength than maxLength (${schemaValue.minLength} > ${schemaValue.maxLength})`
                );
            }

            if (
                schemaValue.type &&
                !EzierValidatorStringTypeRegex[schemaValue.type]
            ) {
                throw new Error("Unknown string 'type' value.");
            }
        }

        this.schema = schema;
    }

    validate(values: { [key: string]: string }): EzierValidatorError[] {
        const errorsList: EzierValidatorError[] = [];
        const consumedKeys: string[] = [];

        for (const stringValueIndex in values) {
            const stringValue = values[stringValueIndex];

            if (!this.schema[stringValueIndex]) {
                throw new Error(
                    `Key \'${stringValueIndex}\' doesn\'t exist in the schema.`
                );
            }

            const strDictArg: { [key: string]: string } = {};
            strDictArg[stringValueIndex] = stringValue;

            errorsList.push(
                ...validateString(strDictArg, this.schema[stringValueIndex])
            );

            consumedKeys.push(stringValueIndex);
        }

        checkArgsExistance(consumedKeys, this.schema);

        return errorsList;
    }
}

function validateString(
    valueDict: { [key: string]: string },
    schema: EzierValidatorStringSchema
): EzierValidatorError[] {
    const errorsList: EzierValidatorError[] = [];

    const valueKey = Object.keys(valueDict)[0];
    const value = valueDict[valueKey];

    if (!value) {
        errorsList.push(
            generateError('STRING_REQUIRED', [valueKey], {
                key: valueKey,
            })
        );
    }

    if (schema.length && value.length != schema.length) {
        errorsList.push(
            generateError('STRING_INVALID_LENGTH', [valueKey, schema.length], {
                length: schema.length,
                key: valueKey,
            })
        );
    }

    if (schema.minLength && value.length < schema.minLength) {
        errorsList.push(
            generateError(
                'STRING_INVALID_MIN_LENGTH',
                [valueKey, schema.minLength],
                {
                    minLength: schema.minLength,
                    key: valueKey,
                }
            )
        );
    }

    if (schema.maxLength && value.length > schema.maxLength) {
        errorsList.push(
            generateError(
                'STRING_INVALID_MAX_LENGTH',
                [valueKey, schema.maxLength],
                {
                    maxLength: schema.maxLength,
                    key: valueKey,
                }
            )
        );
    }

    if (schema.regex && !schema.regex.test(value)) {
        errorsList.push(
            generateError('STRING_INVALID_REGEX', [valueKey], {
                regex: schema.regex,
                key: valueKey,
            })
        );
    }

    if (schema.type) {
        switch (schema.type) {
            default:
                if (!EzierValidatorStringTypeRegex[schema.type].test(value)) {
                    errorsList.push(
                        generateError(
                            'STRING_INVALID_TYPE',
                            [valueKey, schema.type],
                            {
                                type: schema.type,
                                key: valueKey,
                            }
                        )
                    );
                }
        }
    }

    return errorsList;
}
