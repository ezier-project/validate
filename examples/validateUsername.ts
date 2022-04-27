import { StringSchema } from '../src/main/index';

const usernameSchema = new StringSchema({
    username: {
        // 8 <= username <= 16
        minLength: 8,
        maxLength: 16,
        // Alphanumeric and digits
        regex: /^[a-zA-Z0-9]+$/,
    },
});

const result = usernameSchema.validate({ username: 'GreatUsername156' });

if (!result[0]) {
    console.log('Valid username!');
} else {
    console.log('Invalid username.');
    console.log(...result);
}
