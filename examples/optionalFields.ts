import { StringSchema } from '../src/main/index';

const optionalFieldsSchema = new StringSchema({
    notOptional: {
        length: 3,
        regex: /^[0-9]+$/
    },

    optional: {
        length: 8,
        optional: true
    }
});

const result = optionalFieldsSchema.validate({
    notOptional: '123'
});

if(!result[0]) {
    console.log('Valid schema.');
} else {
    console.log('Invalid params.');
    console.log(...result);
}
