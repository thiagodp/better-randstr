"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NON_PRINTABLE_ASCI_START = 0;
var NON_PRINTABLE_ASCI_END = 31;
var NON_PRINTABLE_ISO_START = 127;
var NON_PRINTABLE_ISO_END = 159;
var FIRST_PRINTABLE_ASCII_ISO = 32;
exports.LAST_ASCII = 127;
exports.LAST_ISO = 255;
function _defaultOptions() {
    return {
        random: Math.random,
        chars: [FIRST_PRINTABLE_ASCII_ISO, exports.LAST_ISO],
        acceptable: undefined,
        replacer: undefined,
        includeControlChars: false
    };
}
function _isControlChar(code) {
    return code < 0 ||
        // ascii
        (code >= NON_PRINTABLE_ASCI_START && code <= NON_PRINTABLE_ASCI_END) ||
        // iso
        (code >= NON_PRINTABLE_ISO_START && code <= NON_PRINTABLE_ISO_END);
}
function _randomIntBetween(randomFunc, min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return min + Math.floor(randomFunc.call(null) * (max - min + 1));
}
function _validateOptions(options) {
    var opt = options || _defaultOptions();
    // random
    if (!opt.random) {
        opt.random = Math.random;
    }
    if (typeof opt.random !== 'function') {
        throw new Error("Parameter 'random' must a function.");
    }
    var DEFAULT_STR_MAX_LEN = 100;
    // length
    var length = (undefined === opt.length || null === opt.length)
        ? _randomIntBetween(opt.random, 0, DEFAULT_STR_MAX_LEN)
        : opt.length;
    if (Array.isArray(length)) {
        var len = length.length;
        if (len < 1) {
            throw new Error("Parameter 'length' must have at least one number.");
        }
        if (len > 2) {
            throw new Error("Parameter 'length' must have at most two numbers.");
        }
        if (isNaN(length[0])) {
            throw new Error("The first value of the parameter 'length' must be a number.");
        }
        if (len > 1) {
            if (isNaN(length[1])) {
                throw new Error("The second value of the parameter 'length' must be a number.");
            }
        }
        else {
            length.push(DEFAULT_STR_MAX_LEN);
        }
        opt.length = [Number(length[0]), Number(length[1])];
        if (opt.length[0] < 0) {
            throw new Error("The first value of the parameter 'length' must be greater than equal to zero.");
        }
        if (opt.length[1] < 0) {
            throw new Error("The second value of the parameter 'length' must be greater than or equal to zero.");
        }
        if (opt.length[0] > opt.length[1]) {
            throw new Error("The second value of the parameter 'length' must be less than the first value.");
        }
    }
    else {
        if (isNaN(length)) {
            throw new Error("Parameter 'length' must be a number.");
        }
        opt.length = Number(length);
    }
    // chars
    var chars = (undefined === opt.chars || null === opt.chars)
        ? [FIRST_PRINTABLE_ASCII_ISO, exports.LAST_ISO]
        : opt.chars;
    if (Array.isArray(chars)) {
        var len = chars.length;
        if (len !== 2) {
            throw new Error("Parameter 'chars' must have two numbers.");
        }
        if (isNaN(chars[0])) {
            throw new Error("The first value of the parameter 'chars' must be a number: ");
        }
        if (isNaN(chars[1])) {
            throw new Error("The second value of the parameter 'chars' must be a number.");
        }
        opt.chars = [Number(chars[0]), Number(chars[1])];
        if (opt.chars[0] < 0) {
            throw new Error("The first value of the parameter 'chars' must be greater than or equal zero.");
        }
        if (opt.chars[1] < 0) {
            throw new Error("The second value of the parameter 'chars' must be greater than or equal zero.");
        }
        if (opt.chars[0] > opt.chars[1]) {
            throw new Error("The second value of the parameter 'chars' must be less than the first value.");
        }
    }
    else {
        if (typeof chars !== 'string') {
            throw new Error("Parameter 'chars' must be a string or an array.");
        }
        if (chars.length < 1) {
            throw new Error("Parameter 'chars' must be a string with at least 1 character.");
        }
        opt.chars = chars;
    }
    // acceptable
    if (opt.acceptable && typeof opt.acceptable !== 'function') {
        throw new Error("Parameter 'acceptable' must a function.");
    }
    // replacer
    if (opt.replacer !== undefined && opt.replacer !== null && 'function' !== typeof opt.replacer) {
        throw new Error("Parameter 'replacer' must a function.");
    }
    return opt;
}
/**
 * Generates a random string according to the given options.
 *
 * @param options Options
 * @returns a string
 */
function randstr(options) {
    var _a;
    var opt = _validateOptions(options);
    var from, to;
    if (Array.isArray(opt.length)) {
        _a = opt.length, from = _a[0], to = _a[1];
    }
    else {
        from = to = opt.length;
    }
    var str = '';
    if (0 === to) {
        return str;
    }
    var charsIsString = 'string' === typeof opt.chars;
    var charsLastIndex = charsIsString ? opt.chars.length - 1 : 0;
    var includeControlChars = true === opt.includeControlChars;
    var hasAcceptableFunc = 'function' === typeof opt.acceptable;
    var hasReplacer = 'function' === typeof opt.replacer;
    var max = _randomIntBetween(opt.random, from, to);
    // console.log( 'max', max, 'from', from, 'to', to );
    for (var i = 0, len = 0, charCode = void 0, chr = void 0; i < max && len < max; ++i) {
        if (charsIsString) {
            var index = _randomIntBetween(opt.random, 0, charsLastIndex);
            charCode = opt.chars.charCodeAt(index);
        }
        else {
            charCode = _randomIntBetween(opt.random, opt.chars[0], opt.chars[1]);
        }
        // Non printable?
        if (!includeControlChars && _isControlChar(charCode)) {
            // console.log( 'NOT PRINTABLE!');
            --i; // back to try again
            continue;
        }
        chr = String.fromCharCode(charCode);
        // console.log( 'charCode', charCode, 'char', chr );
        if (hasAcceptableFunc && !opt.acceptable.call(null, chr)) {
            --i; // back to try again
            continue;
        }
        if (hasReplacer) {
            chr = opt.replacer.call(null, chr);
            // console.log( 'char after', chr );
            // Their combined length pass the limit?
            if ((len + chr.length) > max) {
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
exports.randstr = randstr;
//
// UTILITIES
//
exports.NUMBERS = '0123456789';
exports.UPPER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
exports.LOWER_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
exports.ALPHABET = exports.UPPER_ALPHABET + exports.LOWER_ALPHABET;
exports.ALPHA_NUMERIC = exports.NUMBERS + exports.ALPHABET;
function charIsNumeric(chr) {
    return chr >= '0' && chr <= '9';
}
exports.charIsNumeric = charIsNumeric;
function charIsUpperAlpha(chr) {
    return chr >= 'A' && chr <= 'Z';
}
exports.charIsUpperAlpha = charIsUpperAlpha;
function charIsLowerAlpha(chr) {
    return chr >= 'a' && chr <= 'z';
}
exports.charIsLowerAlpha = charIsLowerAlpha;
function charIsAlpha(chr) {
    return charIsUpperAlpha(chr) || charIsLowerAlpha(chr);
}
exports.charIsAlpha = charIsAlpha;
function charIsAlphanumeric(chr) {
    return charIsAlpha(chr) || charIsNumeric(chr);
}
exports.charIsAlphanumeric = charIsAlphanumeric;
