"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "dendron",
			"path": "dendron/dendron.js",
			"file": "dendron.js",
			"module": "dendron",
			"author": "Richeve S. Bebedor",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/dendron.git",
			"global": true,
			"class": true
		}
	@end-module-configuration

	@module-documentation:
		Internal and external core, inter- and extra- communication
			procedures separated from myelin.

		Engine references are immutable when it operates on a single document.
	@end-module-documentation

	@include:
		{
			"_": "lodash",
			"ate": "ate",
			"called": "called",
			"cobralize": "cobralize",
			"crypto": "crypto",
			"diatom": "diatom",
			"doubt": "doubt",
			"EventEmitter": "events",
			"fnord": "fnord",
			"harden": "harden",
			"hashid": "hashids",
			"heredito": "heredito",
			"llamalize": "llamalize",
			"loosen": "loosen",
			"Olivant": "olivant",
			"optcall": "optcall",
			"optfor": "optfor",
			"petrifi": "petrifi",
			"raze": "raze",
			"shardize": "shardize",
			"silph": "silph",
			"snapd": "snapd",
			"symbiote": "symbiote",
			"tinge": "tinge",
			"titlelize": "titlelize",
			"U200b": "u200b",
			"uuid": "node-uuid"
		}
	@end-include
*/

const _ = require( "lodash" );
const ate = require( "ate" );
const called = require( "called" );
const cobralize = require( "cobralize" );
const crypto = require( "crypto" );
const diatom = require( "diatom" );
const doubt = require( "doubt" );
const EventEmitter = require( "events" );
const falzy = require( "falzy" );
const fnord = require( "fnord" );
const harden = require( "harden" );
const hashid = require( "hashids" );
const heredito = require( "heredito" );
const llamalize = require( "llamalize" );
const loosen = require( "loosen" );
const Olivant = require( "olivant" );
const optcall = require( "optcall" );
const optfor = require( "optfor" );
const petrifi = require( "petrifi" );
const protype = require( "protype" );
const raze = require( "raze" );
const shardize = require( "shardize" );
const silph = require( "silph" );
const snapd = require( "snapd" );
const symbiote = require( "symbiote" );
const tinge = require( "tinge" );
const titlelize = require( "titlelize" );
const truu = require( "truu" );
const U200b = require( "u200b" );
const uuid = require( "node-uuid" );

const Dendron = diatom( "Dendron" );

harden( "registry", Dendron.registry || { }, Dendron );

Dendron.prototype.initialize = function initialize( engine, option ){
	/*;
		@meta-configuration:
			{
				"engine": [
					"string",
					"function"
				],
				"option": "object"
			}
		@end-meta-configuration
	*/

	/*;
		Trying to wrap optcall during initalization.
		This is just to ensure all option-callback methods are properly wrapped.
	*/
	optcall( this );

	engine = optfor( arguments, FUNCTION ) || optfor( arguments, STRING );

	if( protype( engine, FUNCTION ) || protype( engine, STRING ) ){
		let name = engine.name || ( ( protype( engine, STRING ) )? engine : "" );
		name = shardize( name );

		if( name in Dendron.registry ){
			harden( "engine", name, this );
			harden( name, Dendron.registry[ name ], this );

			return this;
		}

		option = optfor( arguments, OBJECT ) || { };

		if( name ){
			option = option || { "name": name };

			this.wrap( engine, option );
		}
	}

	if( protype( arguments[ 0 ], OBJECT ) ){
		if( !this.rootEngine ){
			option = arguments[ 0 ];

			this.load( option );

		}else{
			let engine = this.rootEngine;

			option = arguments[ 0 ];

			option.engine = engine;

			this.load( option );
		}

	}else if( this.rootEngine ){
		let option = { "engine": this.rootEngine };

		this.load( option );
	}

	return this;
};

/*;
	@method-documentation:
		Wraps a function or create a dendron engine from a namespace.
	@end-method-documentation

	@option:
		{
			"mold:required": "object",
			"model": "object",
			"name": "string",
			"salt": "string",
			"initialize": "function"
		}
	@end-option
*/
Dendron.prototype.wrap = function wrap( engine, option ){
	/*;
		@meta-configuration:
			{
				"engine:required": [
					"string",
					"function"
				],
				"option:required": "object"
			}
		@end-meta-configuration
	*/

	option = option || { };

	let name = engine;
	if( protype( engine, FUNCTION ) ){
		name = engine.name;
	}

	if( "name" in option && protype( option.name, STRING ) ){
		name = option.name;
	}

	name = name || "document";

	if( !protype( name, STRING ) ){
		Fatal( "invalid engine name", engine, option );

		return this;
	}

	name = shardize( name );
	this.name = name;

	if( name in Dendron.registry ){
		Warning( "engine already created", name )
			.silence( )
			.prompt( );

		harden( "engine", name, this );
		harden( name, Dendron.registry[ name ], this );

		return this;
	}

	let alias = llamalize( name, true );
	this.alias = alias;

	let label = llamalize( name );
	this.label = label;

	let title = titlelize( name );
	this.title = title;

	let Engine = diatom( alias );

	Engine.prototype.name = name;
	Engine.prototype.label = label;
	Engine.prototype.title = title;
	Engine.prototype.alias = alias;

	Engine.prototype.salt = option.salt || this.sodium( );

	Engine.prototype.initialize = option.initialize ||
		( protype( engine, FUNCTION ) && ( engine.prototype.initialize || engine ) ) ||
		function initialize( option, callback ){
			called.bind( this )( callback )( null, this, option );
			return this;
		};
	ate( "name", "initialize", Engine.prototype.initialize );

	if( protype( engine, FUNCTION ) ){
		let engineProperty = Object.getOwnPropertyNames( engine.prototype );
		engineProperty.forEach( function onEachProperty( property ){
			Engine.prototype[ property ] = engine.prototype[ property ];
		} );
	}

	heredito( Engine, this.constructor );

	//: Wrap in optcall before symbiosis.
	optcall( Engine );

	symbiote( Engine );

	let mold = `${ this.alias }Mold`;
	mold = option.mold || global[ mold ] || { };

	let model = option.model || mold.model || { };

	let rootEngine = Engine( {
		"engine": {
			"mold": mold,
			"model": model
		}
	} );
	rootEngine.rootEngine = rootEngine;

	Engine.prototype.rootEngine = rootEngine;

	harden( "engine", rootEngine, Engine );

	//: Register the engine to the Dendron registry.
	harden( name, Engine, Dendron.registry );

	//: Do not be confused on this.
	harden( "engine", name, this );
	harden( name, Engine, this );

	return this;
};

/*;
	@method-documentation:
		Loads the engine options.
	@end-method-documentation

	@option:
		{
			"engine": {
				"name": "string",
				"title": "string",
				"mold": Lemuria,
				"model": mongoose.Model,
				"salt": "string",
				"difference": "string"
			},

			"name": "string",
			"title": "string",
			"mold": Lemuria,
			"model": mongoose.Model,
			"salt": "string",
			"difference": "string"
		}
	@end-option
*/
Dendron.prototype.load = function load( option, callback ){
	/*;
		@meta-configuration:
			{
				"option:required": "object",
				"callback:required": "function"
			}
		@end-meta-configuration
	*/

	let engine = option.engine || option;

	if( falzy( engine ) ){
		Fatal( "no engine given", engine )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	this.name = engine.name || this.name;
	this.label = engine.label || this.label;
	this.title = engine.title || this.title;
	this.alias = engine.alias || this.alias;

	let rootEngine = this.rootEngine || this;
	this.rootEngine = rootEngine;

	let mold = `${ this.alias }Mold`;
	this.mold = engine.mold || rootEngine.mold || global[ mold ];

	if( falzy( this.mold ) && falzy( engine.model ) ) {
		Fatal( "empty mold", option )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	//: We cannot attach the engine to mold if it is not existing.
	if( falzy( this.mold.engine ) && falzy( this.mold.rootEngine ) ){
		snapd.bind( this )
			( function bindEngine( ){
				if( this.rootEngine &&
					this.mold.attachEngine &&
					protype( this.mold.attachEngine, FUNCTION ) )
				{
					this.mold.attachEngine( this );

				}else{
					Warning( "cannot attach engine to mold", this )
						.prompt( );
				}
			} );

	}else{
		Prompt( "engine and root engine already attached", this );
	}

	this.model = this.mold.model || engine.model;

	if( falzy( this.model ) ){
		Fatal( "empty model", option )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	this.salt = engine.salt || this.salt || this.sodium( );

	if( !protype( this.salt, STRING ) ){
		Fatal( "invalid salt", option )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	if( falzy( this.salt ) ){
		Warning( "empty salt", option )
			.remind( "data conflict may arise" )
			.silence( )
			.prompt( );
	}

	this.difference = engine.difference || this.difference || this.name;

	callback( null, this, option );

	return this;
};

/*;
	@method-documentation:
		Extract data from option.
	@end-method-documentation

	@option:
		{
			"data:required": "object"
		}
	@end-option
*/
Dendron.prototype.resolveData = function resolveData( option ){
	option = option || this.option;

	let entity = option.data;
	if( _.isEmpty( entity ) ){
		entity = option[ this.label ];
	}

	if( _.isEmpty( entity ) ){
		entity = { };
	}

	if( !doubt( entity ).ARRAY &&
		!_.isEmpty( entity ) )
	{
		option.data = entity;

		this.set( "data", entity );
	}

	return this;
};

/*;
	@method-documentation:
		Extract list from option.
	@end-method-documentation

	@option:
		{
			"list:required": Array,
			"data": Array
		}
	@end-option
*/
Dendron.prototype.resolveList = function resolveList( option ){
	option = option || this.option;

	let array = option.list;
	if( _.isEmpty( array ) ){
		array = option[ this.label ];
	}

	if( _.isEmpty( array ) ){
		array = [ ];
	}

	if( doubt( array ).ARRAY &&
		!_.isEmpty( array ) )
	{
		option.list = array;

		this.set( "list", array );
	}

	return this;
};

/*;
	@method-documentation:
		Extract and format factor from option.
	@end-method-documentation

	@option:
		{
			"data:required": "object",
		}
	@end-option
*/
Dendron.prototype.resolveFactor = function resolveFactor( option ){
	option = option || this.option;

	this.resolveData( option );

	let data = loosen( option.data );

	option.factor = option.factor || [ ];

	let factor = ( option.factor.length && option.factor ) ||
		Object.keys( ( this.mold && this.mold.factor ) || { } )
			.map( ( function onEachFactor( point ){
				if( point == "model" ){
					return this.name;
				}

				return silph( data, point );
			} ).bind( this ) );

	factor = factor
		.filter( function onEachFactor( point ){
			if( protype( point, NUMBER ) && !isNaN( point ) ){
				return true;
			}

			return ( !protype( point, UNDEFINED ) &&
				!protype( point, NULL ) &&
				point !== "" );
		} );

	if( doubt( factor ).ARRAY && factor.length ){
		option.factor = factor;

		this.set( "factor", factor );
	}

	return option.factor;
};

/*;
	@method-documentation:
		Extract and format element from option.
	@end-method-documentation

	@option:
		{
			"data:required": "object",
		}
	@end-option
*/
Dendron.prototype.resolveElement = function resolveElement( option ){
	option = option || this.option;

	let element = [ ];
	for( let property in option.data ){
		let data = option.data[ property ];

		if( doubt( data ).ARRAY ){
			data.forEach( function onEachElement( item ){

				if( protype( item, OBJECT ) ){
					element.push( {
						"type": type,
						"property": property,
						"value": item,

						"reference": item.reference,
						"name": item.name,
					} );

				}else{
					element.push( {
						"type": type,
						"property": property,
						"value": item,

						"name": property
					} );
				}
			} );
		}
	}

	if( element.length ){
		option.element = element;

		this.set( "element", option.element );
	}

	return this;
};

Dendron.prototype.resolveArray = function resolveArray( option ){
	option = option || this.option;

	let array = { };
	for( let property in option.data ){
		let data = option.data[ property ];

		if( doubt( data ).ARRAY ){
			data.forEach( function onEachArray( item ){

				if( !protype( item, OBJECT ) ){
					array[ property ] = array[ property ] || [ ];
					array[ property ].property = property;

					array[ property ].push( item );
				}

			} );
		}
	}

	if( truu( array ) ){
		option.array = array;

		this.set( "array", option.array );
	}

	return this;
};

Dendron.prototype.restrictData = function restrictData( option ){
	option = option || this.option;

	if( truu( this.mold ) &&
		truu( this.mold.restrict ) &&
		protype( this.mold.restrict, FUNCTION ) )
	{
		this.resolveData( option );

		option.data = this.mold.restrict( option.data );

		this.set( "data", option.data );
	}

	return this;
};

/*;
	@method-documentation:
		Merge identity to data.
	@end-method-documentation
*/
Dendron.prototype.mergeIdentity = function mergeIdentity( option ){
	option = option || this.option;

	if( truu( option.data ) && truu( option.identity ) ){
		option.data.reference = option.data.reference || option.identity.reference;
		option.data.hash = option.data.hash || option.identity.hash;
		option.data.stamp = option.data.stamp || option.identity.stamp;
		option.data.short = option.data.short || option.identity.short;
		option.data.code = option.data.code || option.identity.code;
		option.data.path = option.data.path || option.identity.path;
	}

	return this;
};

/*;
	@method-documentation:
		Initiate method chaining.
	@end-method-documentation
*/
Dendron.prototype.chain = function chain( ){
	this.chainMode = true;

	return this;
};

/*;
	@method-documentation:
		Disable method chaining.
	@end-method-documentation
*/
Dendron.prototype.loose = function loose( ){
	if( this.chainTimeout ){
		clearTimeout( this.chainTimeout );

		delete this.chainTimeout;
	}

	delete this.chainMode;

	delete this.callStack;

	return this;
};

/*;
	@method-documentation:
		Append the method in the prototype chain.

		The method is pre-configured.
	@end-method-documentation
*/
Dendron.prototype.use = function use( method ){
	if( !protype( method, FUNCTION ) ){
		Fatal( "invalid method", method );

		return this;
	}

	if( falzy( this.engine ) ){
		Fatal( "engine not configured" );

		return this;
	}

	let property = method.name;
	method = optcall.wrap( method );

	let Engine = this[ this.engine ];

	if( falzy( Engine ) ){
		Fatal( "engine does not exists" );

		return this;
	}

	Engine.prototype[ property ] = method;

	let rootEngine = Engine.engine;

	if( falzy( rootEngine ) ){
		Fatal( "root engine not created" );

		return this;
	}

	if( !( property in rootEngine ) ){
		rootEngine[ property ] = method.bind( rootEngine );
	}

	if( !( property in this ) ){
		this[ property ] = method.bind( this );
	}

	return this;
};

/*;
	@method-documentation:
		Calls the overridden method.
	@end-method-documentation
*/
Dendron.prototype.method = function method( action, name ){
	/*;
		@meta-configuration:
			{
				"action:required": [
					"string",
					"..."
				],
				"name:required": [
					"string",
					"..."
				]
			}
		@end-meta-configuration
	*/

	if( protype( this[ action ], FUNCTION ) ){
		return this[ action ].bind( this );
	}

	name = name || this.label;

	let parameter = _( raze( arguments )
		.concat( [ name ] )
		.map( function onEachParameter( parameter ){
			return shardize( parameter ).split( "-" );
		} ) )
		.flatten( )
		.compact( )
		.uniq( )
		.value( )
		.join( "-" );

	let methodName = llamalize( parameter );

	if( protype( this[ methodName ], FUNCTION ) ){
		return this[ methodName ].bind( this );

	}else if( !protype( this[ methodName ], FUNCTION ) && name != "document" ){
		Warning( "no method override", methodName, parameter )
			.remind( "reuse parent method" )
			.silence( )
			.prompt( );

		action = parameter.replace( `-${ name }`, "" );

		return this.method.bind( this )( action, "document" );

	}else{
		return called.bind( this )( );
	}
};

/*;
	@method-documentation:
		This will return a spawn of the engine constructor.
	@end-method-documentation
*/
Dendron.prototype.spawn = function spawn( ){
	if( this.engine ){
		return this[ this.engine ];

	}else if( this.rootEngine ){
		return this.rootEngine.constructor;

	}else if( this.constructor.name != "Dendron" ){
		return this.constructor;

	}else{
		Fatal( "cannot spawn engine", this );
	}
};

/*;
	@method-documentation:
		This will publish the registry globally.

		And return the created engine;
	@end-method-documentation
*/
Dendron.prototype.publish = function publish( ){
	if( falzy( this.engine ) ){
		Fatal( "engine is not configured" );

		return null;
	}

	let Engine = this[ this.engine ];

	if( falzy( Engine ) ){
		Fatal( "engine does not exists" );

		return null;
	}

	harden( this.alias, Engine, global );

	return Engine;
};

/*;
	@method-documentation:
		Default salt creation.
	@end-method-documentation
*/
Dendron.prototype.sodium = function sodium( ){
	let salt = cobralize( `${ this.name }-salt` );

	return ( global[ salt ] ||
		U200b( fnord( [
			0x0aaa, 0x0bbb, 0x0bbb, 0x0ccc, 0x0ddd,
			0x0eee, 0x0fff, 0x0fad, 0x0bad, 0x0bed,
			0x0fed, 0x0abe, 0xdead, 0xbeef, 0xdeaf,
			0xcafe, 0xfeed, 0xfade, 0xbead, 0xdeed,
			0xaaaa, 0xbbbb, 0xcccc, 0xdddd, 0xffff
		] ) ).toString( ) );
};

/*;
	@method-documentation:
		Creates unique hash of the document.

		This hash represents the document and changes when the document changes.
	@end-method-documentation

	@option:
		{
			"factor:required": "[*]",
			"identity": "object",
			"self": "object"
		}
	@end-option
*/
Dendron.prototype.createHash = function createHash( option, callback ){
	/*;
		@meta-configuration:
			{
				"option:required": "object",
				"callback:required": "function"
			}
		@end-meta-configuration
	*/

	if( falze( option.factor ) ){
		Warning( "no factor given", option )
			.remind( "cannot create hash" )
			.pass( callback, null, option );

		return null;
	}

	if( !doubt( option.factor ).ARRAY ){
		Warning( "invalid factor", option )
			.remind( "cannot create hash" )
			.pass( callback, null, option );

		return null;
	}

	if( !option.factor.length ){
		Warning( "empty factor", option )
			.remind( "cannot create hash" )
			.pass( callback, null, option );

		return null;
	}

	//: Preserve the reference of the array.
	let factor = [ ].concat( option.factor );

	//: Hash uniqueness factor to differentiate from other models.
	if( this.difference ){
		factor.push( this.difference );
	}

	let hash = crypto.createHash( "sha512" );

	hash.update( JSON.stringify( _.compact( factor ) ) );

	hash = hash.digest( "hex" );

	option.set( "hash", hash );

	if( falze( option.identity.hash ) ){
		petrifi( "hash", hash, option.identity );
	}

	callback( null, hash, option );

	return hash;
};

/*;
	@method-documentation:
		Creates unique reference of the document.

		This reference never changes even if the document changes.
	@end-method-documentation

	@option:
		{
			"factor:required": "[*]",
			"identity": "object",
			"self": "object"
		}
	@end-option
*/
Dendron.prototype.createReference = function createReference( option, callback ){
	/*;
		@meta-configuration:
			{
				"option:required": "object",
				"callback:required": "function"
			}
		@end-meta-configuration
	*/

	if( falze( option.factor ) ){
		Warning( "no factor given", option )
			.remind( "cannot create reference" )
			.pass( callback, null, option );

		return null;
	}

	if( !doubt( option.factor ).ARRAY ){
		Warning( "invalid factor", option )
			.remind( "cannot create reference" )
			.pass( callback, null, option );

		return null;
	}

	if( !option.factor.length ){
		Warning( "empty factor", option )
			.remind( "cannot create reference" )
			.pass( callback, null, option );

		return null;
	}

	if( option.identity.reference ){
		Prompt( "reference exists", option )
			.remind( "return existing reference" )
			.pass( callback, option.identity.reference, option );

		return option.identity.reference;
	}

	//: Preserve the reference of array.
	let factor = [ ].concat( option.factor );

	factor.push( uuid.v1( ) );

	factor.push( uuid.v4( ) );

	let reference = this.root( 1 ).createHash( { "factor": factor } );

	factor.pop( );

	factor.pop( );

	option.set( "reference", reference );

	if( falze( option.identity.reference ) ){
		petrifi( "reference", reference, option.identity );
	}

	callback( null, reference, option );

	return reference;
};

/*;
	@method-documentation:
		Create stamp and short code.

		Stamp code are path safe code.

		Short codes are half representation of stamp codes.

		Take note that stamps are shortened unique representation of hashes.
	@end-method-documentation

	@option:
		{
			"factor:required": "[*]",
			"identity": "object"
		}
	@end-option
*/
Dendron.prototype.createStamp = function createStamp( option, callback ){
	/*;
		@meta-configuration:
			{
				"option:required": "object",
				"callback:required": "function"
			}
		@end-meta-configuration
	*/

	if( falze( option.factor ) ){
		Warning( "no factor given", option )
			.remind( "cannot create stamp" )
			.pass( callback, null, option );

		return null;
	}

	if( !doubt( option.factor ).ARRAY ){
		Warning( "invalid data", option )
			.remind( "cannot create stamp" )
			.pass( callback, null, option );

		return null;
	}

	if( !option.factor.length ){
		Warning( "empty factor", option )
			.remind( "cannot create stamp" )
			.pass( callback, null, option );

		return null;
	}

	let hash = this.root( 1 ).createHash( option );

	let salt = option.get( "salt" ) || option.salt || this.salt;

	let stamp = tinge( {
		"factor": option.factor,
		"indexed": true
	} );

	option.set( "stamp", stamp );

	let short = tinge( {
		"factor": option.factor,
		"length": 6,
		"dictionary": [
			"abcdefghijklmnopqrstuvwxyz",
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"0123456789",
			"?!@$%#&*+=<>"
		].join( "" )
	} );

	option.set( "short", short );

	option.identity.stamp = stamp;
	option.identity.short = short;

	callback( null, stamp, option );

	return stamp;
};

/*;
	@method-documentation:
		Override instance option.
	@end-method-documentation
*/
Dendron.prototype.set = function set( property, value ){
	if( protype( arguments[ 0 ], OBJECT ) ){
		this.option = arguments[ 0 ];

	}else if( property == "option" ){
		this.option = value;

	}else{
		this.option[ property ] = value;
	}

	return this;
};

/*;
	@method-documentation:
		Attach immutable request, response to the engine instance.
	@end-method-documentation
*/
Dendron.prototype.register = function register( request, response ){
	harden( "request", request, this );
	harden( "response", response, this );

	return this;
};

optcall( Dendron );

heredito( Dendron, EventEmitter );

module.exports = Dendron;
