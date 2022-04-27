import { v4 } from 'uuid';
import { StringSchema } from '../src/main/index';

const uuidSchema = new StringSchema({
    uuid: {
        length: 36,
        regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    },
});

const result = uuidSchema.validate({ uuid: v4() });

if (!result[0]) {
    console.log('Valid UUID!');
} else {
    console.log('Invalid UUID.');
    console.log(...result);
}
