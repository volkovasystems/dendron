"use strict";

const dendron = require( "./dendron.js" );

const diatom = require( "diatom" );
const heredito = require( "heredito" );
const optcall = require( "optcall" );

const Computation = diatom( "Computation" );
const MerchantCompute = diatom( "MerchantCompute" );

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

heredito( MerchantCompute, Computation );
