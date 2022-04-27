import { v4 } from 'uuid';
import { StringSchema } from '../src/main/index';

const uuidSchema = new StringSchema({
    uuid: {
        type: 'uuid'
    },
});

const result = uuidSchema.validate({ uuid: v4() });

if (!result[0]) {
    console.log('Valid UUID!');
} else {
    console.log('Invalid UUID.');
    console.log(...result);
}
