import { randstr } from '../index';


let numberGen = ( () => {
    var counter = 0;
    return () => ++counter;
} )();


describe( '#randstr', () => {

    const MAX_TESTS = 10;

    it( 'respects length', () => {
        for ( let i = 0, value; i < MAX_TESTS; ++i ) {
            value = randstr( { length: 10 } );
            expect( value ).toHaveLength( 10 );
        }
    } );

    it( 'respects min length', () => {
        for ( let i = 0, value; i < MAX_TESTS; ++i ) {
            value = randstr( { length: [ 10 ] } );
            expect( value.length ).toBeGreaterThanOrEqual( 10 );
        }
    } );

    it( 'respects max length', () => {
        for ( let i = 0, value; i < MAX_TESTS; ++i ) {
            value = randstr( { length: [ 0, 100 ] } );
            expect( value.length ).toBeLessThanOrEqual( 100 );
        }
    } );

    it( 'respects length with replacement function', () => {

        const repFunc = function repFunc( chr: string ): string {
            if ( chr >= 'a' && chr <= 'z' ) {
                return chr + chr;
            }
            return chr;
        };

        const min = 20, max = 100;
        for ( let i = 0, value; i < MAX_TESTS; ++i ) {
            value = randstr( { length: [ min, max ], replacer: repFunc } );
            expect( value.length ).toBeGreaterThanOrEqual( min );
            expect( value.length ).toBeLessThanOrEqual( max );
        }
    } );

    it( 'respects length with acceptable function', () => {

        const acceptableIf = function acceptableIf( chr: string ): boolean {
            return ( chr >= 'A' && chr <= 'Z' ) || ( chr >= '0' && chr <= '9' );
        };

        const min = 20, max = 200;
        for ( let i = 0, value; i < MAX_TESTS; ++i ) {
            value = randstr( { length: [ min, max ], acceptable: acceptableIf } );
            expect( value.length ).toBeGreaterThanOrEqual( min );
            expect( value.length ).toBeLessThanOrEqual( max );
        }
    } );

    it( 'respects character range', () => {
        const min = 20, max = 200;
        for ( let i = 0, value; i < MAX_TESTS; ++i ) {
            value = randstr( { length: [ min, max ], chars: [ 'A'.charCodeAt( 0 ), 'Z'.charCodeAt( 0 ) ] } );
            expect( value.length ).toBeGreaterThanOrEqual( min );
            expect( value.length ).toBeLessThanOrEqual( max );
        }
    } );

    it( 'respects characters', () => {
        const min = 20, max = 200;
        for ( let i = 0, value; i < MAX_TESTS; ++i ) {
            value = randstr( { length: [ min, max ], chars: 'ABC123' } );
            expect( value.length ).toBeGreaterThanOrEqual( min );
            expect( value.length ).toBeLessThanOrEqual( max );
        }
    } );

} );