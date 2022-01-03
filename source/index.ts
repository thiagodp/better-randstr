
type RandomProducer = () => number;
type CharReplacer = ( input: string ) => string;
type AcceptableChar = ( input: string ) => boolean;

const NON_PRINTABLE_ASCI_START = 0;
const NON_PRINTABLE_ASCI_END = 31;

const NON_PRINTABLE_ISO_START = 127;
const NON_PRINTABLE_ISO_END = 159;

const FIRST_PRINTABLE_ASCII_ISO = 32;

export const LAST_ASCII = 127;
export const LAST_ISO = 255;

export interface Options {

    /**
     * Random function to be used. By default, it assumes `Math.random()`.
     *
     * The function does not expect arguments and must return a number between 0 and 1.
     */
    random?: RandomProducer;

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
    acceptable?: AcceptableChar;

    /**
     * Function that replaces a character by other character or characters.
     * By default, it is `undefined`.
     * You may use it for escaping or replacing certain characters, for example.
     */
    replacer?: CharReplacer;

    /**
     * Whether is desired to include control characters. By default, it is `false`.
     */
    includeControlChars?: boolean;
}

function _defaultOptions(): Options {
    return {
        random: Math.random,
        chars: [ FIRST_PRINTABLE_ASCII_ISO, LAST_ISO ],
        acceptable: undefined,
        replacer: undefined,
        includeControlChars: false
    }
}

function _isControlChar( code: number ): boolean {
    return code < 0 ||
        // ascii
        ( code >= NON_PRINTABLE_ASCI_START && code <= NON_PRINTABLE_ASCI_END ) ||
        // iso
        ( code >= NON_PRINTABLE_ISO_START && code <= NON_PRINTABLE_ISO_END );
}

function _randomIntBetween( randomFunc: () => number, min: number, max: number ): number {
    min = Math.ceil( min );
    max = Math.floor( max );
    return min + Math.floor( randomFunc.call( null ) * ( max - min + 1 ) );
}


function _validateOptions( options?: Options ) {

    let opt = options || _defaultOptions();

    // random
    if ( ! opt.random ) {
        opt.random = Math.random;
    }
    if ( typeof opt.random !== 'function' ) {
        throw new Error( "Parameter 'random' must a function." );
    }

    const DEFAULT_STR_MAX_LEN = 100;

    // length
    const length = ( undefined === opt.length || null === opt.length )
        ? _randomIntBetween( opt.random, 0, DEFAULT_STR_MAX_LEN )
        : opt.length;

    if ( Array.isArray( length ) ) {
        const len = length.length;
        if ( len < 1 ) {
            throw new Error( "Parameter 'length' must have at least one number." );
        }
        if ( len > 2 ) {
            throw new Error( "Parameter 'length' must have at most two numbers." );
        }
        if ( isNaN( length[ 0 ] ) ) {
            throw new Error( "The first value of the parameter 'length' must be a number." );
        }
        if ( len > 1 ) {
            if ( isNaN( length[ 1 ] ) ) {
                throw new Error( "The second value of the parameter 'length' must be a number." );
            }
        } else {
            length.push( DEFAULT_STR_MAX_LEN );
        }

        opt.length = [ Number( length[ 0 ] ), Number( length[ 1 ] ) ];

        if ( opt.length[ 0 ] < 0 ) {
            throw new Error( "The first value of the parameter 'length' must be greater than equal to zero." );
        }
        if ( opt.length[ 1 ] < 0 ) {
            throw new Error( "The second value of the parameter 'length' must be greater than or equal to zero." );
        }
        if ( opt.length[ 0 ] > opt.length[ 1 ] ) {
            throw new Error( "The second value of the parameter 'length' must be less than the first value." );
        }

    } else {
        if ( isNaN( length ) ) {
            throw new Error( "Parameter 'length' must be a number." );
        }
        opt.length = Number( length );
    }

    // chars
    const chars = ( undefined === opt.chars || null === opt.chars )
        ? [ FIRST_PRINTABLE_ASCII_ISO, LAST_ISO ]
        : opt.chars;

    if ( Array.isArray( chars ) ) {
        const len = chars.length;
        if ( len !== 2 ) {
            throw new Error( "Parameter 'chars' must have two numbers." );
        }
        if ( isNaN( chars[ 0 ] ) ) {
            throw new Error( "The first value of the parameter 'chars' must be a number: " );
        }
        if ( isNaN( chars[ 1 ] ) ) {
            throw new Error( "The second value of the parameter 'chars' must be a number." );
        }

        opt.chars = [ Number( chars[ 0 ] ), Number( chars[ 1 ] ) ];

        if ( opt.chars[ 0 ] < 0 ) {
            throw new Error( "The first value of the parameter 'chars' must be greater than or equal zero." );
        }
        if ( opt.chars[ 1 ] < 0 ) {
            throw new Error( "The second value of the parameter 'chars' must be greater than or equal zero." );
        }
        if ( opt.chars[ 0 ] > opt.chars[ 1 ] ) {
            throw new Error( "The second value of the parameter 'chars' must be less than the first value." );
        }

    } else {
        if ( typeof chars !== 'string' ) {
            throw new Error( "Parameter 'chars' must be a string or an array." );
        }
        if ( chars.length < 1 ) {
            throw new Error( "Parameter 'chars' must be a string with at least 1 character." );
        }
        opt.chars = chars;
    }

    // acceptable
    if ( opt.acceptable && typeof opt.acceptable !== 'function' ) {
        throw new Error( "Parameter 'acceptable' must a function." );
    }

    // replacer
    if ( opt.replacer !== undefined && opt.replacer !== null && 'function' !== typeof opt.replacer ) {
        throw new Error( "Parameter 'replacer' must a function." );
    }

    return opt;
}

/**
 * Generates a random string according to the given options.
 *
 * @param options Options
 * @returns a string
 */
export function randstr( options?: Options ): string {

    const opt = _validateOptions( options );

    let from: number, to: number;
    if ( Array.isArray( opt.length ) ) {
        [ from, to ] = opt.length;
    } else {
        from = to = opt.length || 0;
    }

    let str = '';
    if ( 0 === to ) {
        return str;
    }

    const charsIsString = 'string' === typeof opt.chars;
    const charsLastIndex = charsIsString ? opt.chars!.length - 1 : 0;
    const includeControlChars = true === opt.includeControlChars;
    const hasAcceptableFunc = 'function' === typeof opt.acceptable;
    const hasReplacer = 'function' === typeof opt.replacer;
    const max = _randomIntBetween( opt.random!, from, to );
    // console.log( 'max', max, 'from', from, 'to', to );

    for ( let i = 0, len = 0, charCode, chr; i < max && len < max; ++i ) {

        if ( charsIsString ) {
            const index = _randomIntBetween( opt.random!, 0, charsLastIndex );
            charCode = ( opt.chars as string ).charCodeAt( index );
        } else {
            const [ first, second ] = opt.chars as number[];
            charCode = _randomIntBetween( opt.random!, first, second );
        }

        // Non printable?
        if ( ! includeControlChars && _isControlChar( charCode ) ) {
            // console.log( 'NOT PRINTABLE!');
            --i; // back to try again
            continue;
        }

        chr = String.fromCharCode( charCode );
        // console.log( 'charCode', charCode, 'char', chr );

        if ( hasAcceptableFunc && ! opt.acceptable!.call( null, chr ) ) {
            --i; // back to try again
            continue;
        }

        if ( hasReplacer ) {
            chr = opt.replacer!.call( null, chr );
            // console.log( 'char after', chr );
            // Their combined length pass the limit?
            if ( ( len + chr.length ) > max ) {
                // console.log( 'greater than max!', 'i', i, 'max', max, 'str', len, 'chr', chr.length );
                --i; // back to try again
                continue;
            }
        }

        str += chr;

        len = str.length;
    }

    return str;
}

//
// UTILITIES
//

export const NUMBERS = '0123456789';
export const UPPER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWER_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
export const ALPHABET = UPPER_ALPHABET + LOWER_ALPHABET;
export const ALPHA_NUMERIC = NUMBERS + ALPHABET;

export function charIsNumeric( chr: string ): boolean {
    return chr >= '0' && chr <= '9';
}

export function charIsUpperAlpha( chr: string ): boolean {
    return chr >= 'A' && chr <= 'Z';
}

export function charIsLowerAlpha( chr: string ): boolean {
    return chr >= 'a' && chr <= 'z';
}

export function charIsAlpha( chr: string ): boolean {
    return charIsUpperAlpha( chr ) || charIsLowerAlpha( chr );
}

export function charIsAlphanumeric( chr: string ): boolean {
    return charIsAlpha( chr ) || charIsNumeric( chr );
}