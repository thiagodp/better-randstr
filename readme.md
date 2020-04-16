# better-randstr

[![Build Status](https://travis-ci.com/thiagodp/better-randstr.svg?branch=master)](https://travis-ci.com/thiagodp/better-randstr)
[![npm version](https://badge.fury.io/js/better-randstr.svg)](https://badge.fury.io/js/better-randstr)

> 🌞 Fully-customizable random string generator. Useful for testing applications, etc.

- Use it with your preferred pseudo-random number generator (PRNG).
- Unit-tested.
- No external dependencies.
- Works with JavaScript and TypeScript.

## Install

```bash
npm install --save better-randstr
```

## Examples

```js
var randstr  = require( 'better-randstr' ).randstr;

// Default:
// - Up to 100 characters
// - No control characters
// - ASCII + ISO (UTF-8)
randstr();
// => ;Þë?Ç¡m{îU4I0_%L*qV

// Using a customized function as random function, instead of Math.random()
var myRandomFunc = /* function that returns a number between 0 and 1 */
randstr( { random: myRandomFunc } );
// => cy¦¼Óé6Lcy

// Exactly 10 characters
randstr( { length: 10 } );
// => »²y+iÀëC#Ù

// At least 10 characters
randstr( { length: [ 10 ] } );
// => ü¢ ß~å¿Û¿\ÓÜtÈ["ª9¡.:`i¡{ã«?®Q=>?v&ëÿ2"Âë

// At most 10 characters
randstr( { length: [ 0, 10 ] } );
// => È¹t×úÓ¯ÖÃj

// Between 2 and 60 characters
randstr( { length: [ 2, 60 ] } );
// => ZÔý­ÛÏaæ»û_Eâo9¨§­:Çu!ÕÄø|FNß¨j)1n¦Í:

// Exactly 10 characters, with only the specified characters
randstr( { length: 10, chars: 'ABC123' } );
// => A31AAB3AB1

// Exactly 10 characters, only characters in the range, no control characters
randstr( { length: 10, chars: [ 32, 127 ] } ); // ASCII range
// => EA*bY7{*cL

// Exactly 10 characters, between 'A' and 'Z'
randstr( { length: 10, chars: [ 'A'.charCodeAt( 0 ), 'Z'.charCodeAt( 0 ) ] } );
// => SPQJNORXXR

// Exactly 10 characters, only numbers
var NUMBERS = require( 'better-randstr' ).NUMBERS;
randstr( { length: 10, chars: NUMBERS } ) // same as passing '0123456789'
// => 7450625283

// Exactly 10 characters, alfanumeric
var ALPHA_NUMERIC = require( 'better-randstr' ).ALPHA_NUMERIC;
randstr( { length: 10, chars: ALPHA_NUMERIC } );
// => s1wMa7QVmg

// Exactly 10 characters, all characters in ASCII/ISO (UTF-8) except the specified
randstr( { length: 10, acceptable: function( chr ) {
    return '%#&$'.indexOf( chr ) < 0; // acceptable if not found
} } );
// => ´NvÄ~]¿Gº]

// Exactly 10 characters, escaping quotes and single-quotes
randstr( { length: 10, replacer: function( chr ) {
    switch ( chr ) {
        case '"': return '\\"';
        case "'": return "\\'";
    }
    return chr;
} } );
// => ñ;}éÔÝf«\'

// Include control characters
randstr( { includeControlChars: true } );
// => x@HA$÷°GÝ³:^Ê%¼¤®ý±#Sh+Ò+Å|

// Wider range than UTF-8 - control characters not avoided!
randstr( { chars: [ 32, 1000 ] } );
// => r΅4ƹǭ̻ɍĿΠsɊQȍάĠĲȤċƳȭɧĄƹĜʋ͏Ʒȥĭ˟͢"Ȓǭ̼Ζ˂̀ƖǛ̚3&΃ƏϧȷɥŃ
```

See [example.js](example.js)

## API

```typescript
function randstr( options: Options ): string;
```

where `Options` is :

```typescript
{

    /**
     * Random function to be used. By default, it assumes `Math.random()`.
     *
     * The function does not expect arguments and must return a number between 0 and 1.
     */
    random?: function () => number;

    /**
     * Length or length range. By default, it assumes `[ 0, 100 ]`.
     *
     * - Number: Minimum and maximum length will be equal to the provided number. Example: `{ length: 20 }`.
     * - One-length array: Maximum will be a random number greater than or equal to the minimum. Example: `{ length: [ 2 ] }`.
     * - Two-length array: Minimum and maximum length will assume the provided numbers. Example: `{ length: [ 0, 50 ] }`.
     */
    length?: number | number[];

    /**
     * Allowed characters or byte range. By default, it assumes `[32, 255]`
     * which is a range containing the first printable ASCII character (`32`)
     * and the last ISO character (`255`).
     *
     * For example, `"0123456789"`, which gives the same result as
     * `['0'.charCodeAt(0), '9'.charCodeAt(0)]`.
     */
    chars?: string | number[];

    /**
     * Function that evaluates whether the generated character is acceptable.
     * By default, it is `undefined`.
     * The function expects a character and returns a boolean.
     */
    acceptable?: function ( string ) => boolean;

    /**
     * Function that replaces a character by other character or characters.
     * By default, it is `undefined`.
     * You may use it for escaping or replacing certain characters, for example.
     */
    replacer?: function ( string ) => string;

    /**
     * Whether is desired to include control characters. By default, it is `false`.
     */
    includeControlChars?: boolean;
}
```

## See also

[spec-pattern](https://github.com/thiagodp/spec-pattern) Build complex validation rules or filters easily.

## License

[MIT](LICENSE) © [Thiago Delgado Pinto](https://github.com/thiagodp)