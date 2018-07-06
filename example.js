var randstr = require( '.' ).randstr;

console.log(
    '\nDefault\n',
    randstr()
);

var gen = ( () => {
    var counter = 0;
    return () => ( counter < 9 ? ++counter : counter = 1 ) / 10;
} )();

console.log(
    '\nCustom random function\n',
    randstr( { random: gen } )
);

console.log(
    '\nExactly 10 characters\n',
    randstr( { length: 10 } )
);

console.log(
    '\nAt least 10 characters\n',
    randstr( { length: [ 10 ] } )
);

console.log(
    '\nAt most 10 characters\n',
    randstr( { length: [ 0, 10 ] } )
);

console.log(
    '\nBetween 2 and 60 characters\n',
    randstr( { length: [ 2, 60 ] } )
);

console.log(
    '\nExactly 10 characters, only the specified characters\n',
    randstr( { length: 10, chars: 'ABC123' } )
);

console.log(
    '\nExactly 10 characters, only characters in the range, no control characters\n',
    randstr( { length: 10, chars: [ 32, 127 ] } ) // ASCII range
);

console.log(
    "\nExactly 10 characters, between 'A' and 'Z'\n",
    randstr( { length: 10, chars: [ 'A'.charCodeAt( 0 ), 'Z'.charCodeAt( 0 ) ] } )
);

var NUMBERS = require( '.' ).NUMBERS;
console.log(
    '\nExactly 10 characters, only numbers\n',
    randstr( { length: 10, chars: NUMBERS } ) // same as '0123456789'
);

var ALPHA_NUMERIC = require( '.' ).ALPHA_NUMERIC
console.log(
    '\nExactly 10 characters, alphanumeric\n',
    randstr( { length: 10, chars: ALPHA_NUMERIC } )
);

console.log(
    '\nExactly 10 characters, all characters in ASCII/ISO (UTF-8) except the specified\n',
    randstr( { length: 10, acceptable: function( chr ) {
        return '%#&$'.indexOf( chr ) < 0; // acceptable if not found
    } } )
);

console.log(
    '\nExactly 10 characters, escaping quotes and single-quotes\n',
    randstr( { length: 10, replacer: function( chr ) {
        switch ( chr ) {
            case '"': return '\\"';
            case "'": return "\\'";
        }
        return chr;
    } } )
);

console.log(
    '\nWider range than UTF-8\n',
    randstr( { chars: [ 32, 1000 ] } )
);

console.log(
    '\nInclude control characters\n',
    randstr( { includeControlChars: true } )
);