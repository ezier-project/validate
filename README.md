<h1 align='center'><img src='https://raw.githubusercontent.com/ezier-project/validate/master/images/validate.svg' alt='Ezier Validator logo'>

Ezier Validator</h1>

<h2 align='center'>An ezier validator for nodejs.</h2>

<h2 align='center'>

![npm bundle size](https://img.shields.io/bundlephobia/min/@ezier/validate?style=for-the-badge) ![npm](https://img.shields.io/npm/dm/@ezier/validate?style=for-the-badge) ![NPM](https://img.shields.io/npm/l/@ezier/validate?style=for-the-badge) ![npm](https://img.shields.io/npm/v/@ezier/validate?style=for-the-badge)

# Why?

**This validator allows you to validate your objects with eze.
Nothing more, nothing less.**

***Also used in the Fronvo [server](https://github.com/Fronvo/fronvo)***

# Installing

```
npm i @ezier/validate
```

# Documentation
**Documentation for the Ezier Validator can be found at https://ezier-project.github.io/validate/.**

# Examples

**Validate a string's length:**

```ts
import { StringSchema } from '@ezier/validate';

const schema = new StringSchema({
    value: {
        minLength: 5,
        maxLength: 20
    }
});

const result = schema.validate({
    value: 'some string'
});
```

**Validating manually with regex:**

```ts
import { v4 } from 'uuid';

const uuidSchema = new StringSchema({
    uuid: {
        regex: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    },
});

uuidSchema.validate({ uuid: v4() });
```

**Or with provided types:**

```ts
import { v4 } from 'uuid';

const uuidSchema = new StringSchema({
    uuid: {
        type: 'uuid'
    },
});

uuidSchema.validate({ uuid: v4() });
```

**With support for optional fields:**

```ts
const schema = new StringSchema({
    provideThis: {
        minLength: 8,
        maxLength: 60,
        type: 'email',
    },

    orThis: {
        minLength: 8,
        maxLength: 30,
        regex: /^[a-zA-Z0-9]+$/,
        optional: true
    },
});

schema.validate({
    provideThis: 'anemail@gmail.com'
});
```

**Getting error info:**

```ts
for (const errorObjectIndex in result) {
    const errorObject = result[Number(errorObjectIndex)];

    console.log(`[${errorObject.name}]: ${errorObject.message}`);
}
```

**More examples located [here](https://github.com/ezier-project/validate/tree/master/examples)**

<i>Made by [Shadofer](https://github.com/shadofer) with joy.</i>
