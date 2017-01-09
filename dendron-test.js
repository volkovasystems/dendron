const Dendron = require( "./dendron.js" );

"use strict";

const diatom = require( "diatom" );
const optcall = require( "optcall" );

const Computation = diatom( "Computation" );

Computation.prototype.initialize = function initialize( option, callback ){

    return this;

};


Computation.prototype.compute = function compute( option, callback ) {
	console.log( "compute" );

    callback( null, null, option );

    return this;

};

Computation.prototype.applySomeThing = function applySomeThing( option, callback ) {

    console.log( "apply something", option );

    callback( null, null, option );

    return this;

};

Computation.prototype.done = function done( option, callback ) {

    console.log( "done" );

	callback( null, null, option );

    return this;

};

optcall( Computation );

heredito( Computation, Dendron );
