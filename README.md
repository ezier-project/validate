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
import { validateString } from '@ezier/validate';

const stringResult = validateString('some string', {
    minLength: 5,
    maxLength: 20
});
```

**Getting error info:**

```ts
for (const errorObjectIndex in stringResult) {
    const errorObject: EzierValidatorError = stringResult[Number(errorObjectIndex)];

    console.log(`[${errorObjectIndex}] [${errorObject.name}]: ${errorObject.message}`);
}
```

<i>Made by [Shadofer](https://github.com/shadofer) with joy.</i>
