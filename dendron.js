"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
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
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/dendron.git",
			"global": true,
			"class": true
		}
	@end-module-configuration

	@module-documentation:
		Internal and external core, inter- and extra- communication
			procedures separated from myelin.
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
			"raze": "raze",
			"shardize": "shardize",
			"silph": "silph",
			"snapd": "snapd",
			"symbiote": "symbiote",
			"Olivant": "olivant",
			"optcall": "optcall",
			"optfor": "optfor",
			"tinge": "tinge",
			"titlelize": "titlelize",
			"U200b": "u200b",
			"uuid": "node-uuid"
		}
	@end-include
*/

var _ = require( "lodash" );
var ate = require( "ate" );
var called = require( "called" );
var cobralize = require( "cobralize" );
var crypto = require( "crypto" );
var diatom = require( "diatom" );
var doubt = require( "doubt" );
var EventEmitter = require( "events" );
var fnord = require( "fnord" );
var harden = require( "harden" );
var hashid = require( "hashids" );
var heredito = require( "heredito" );
var llamalize = require( "llamalize" );
var loosen = require( "loosen" );
var Olivant = require( "olivant" );
var optcall = require( "optcall" );
var optfor = require( "optfor" );
var raze = require( "raze" );
var shardize = require( "shardize" );
var silph = require( "silph" );
var snapd = require( "snapd" );
var symbiote = require( "symbiote" );
var tinge = require( "tinge" );
var titlelize = require( "titlelize" );
var U200b = require( "u200b" );
var uuid = require( "node-uuid" );

var Dendron = diatom( "Dendron" );

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

	optcall( this );

	engine = optfor( arguments, FUNCTION ) || optfor( arguments, STRING );

	if( typeof engine == FUNCTION || typeof engine == STRING ){
		var name = engine.name || ( ( typeof engine == STRING )? engine : "" );
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

	if( typeof arguments[ 0 ] == OBJECT ){
		if( !this.rootEngine ){
			option = arguments[ 0 ];

			this.load( option );

		}else{
			var engine = this.rootEngine;

			option = arguments[ 0 ];

			option.engine = engine;

			this.load( option );
		}
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

	var name = engine;
	if( typeof engine == FUNCTION ){
		name = engine.name;
	}

	if( "name" in option && typeof option.name == "string" ){
		name = option.name;
	}

	name = name || "document";

	if( typeof name != STRING ){
		Fatal( "invalid engine name", engine, option );

		return this;
	}

	name = shardize( name );

	if( name in Dendron.registry ){
		Warning( "engine already created", name )
			.silence( )
			.prompt( );

		harden( "engine", name, this );
		harden( name, Dendron.registry[ name ], this );

		return this;
	}

	var alias = llamalize( name, true );
	var label = llamalize( name );
	var title = titlelize( name );

	let Engine = diatom( alias );

	Engine.prototype.name = name;
	Engine.prototype.label = label;
	Engine.prototype.title = title;
	Engine.prototype.alias = alias;

	Engine.prototype.salt = option.salt || this.sodium( );

	Engine.prototype.initialize = option.initialize ||
		( typeof engine == FUNCTION && ( engine.prototype.initialize || engine ) ) ||
		function initialize( option, callback ){
			called.bind( this )( callback )( null, this, option );
			return this;
		};
	ate( "name", "initialize", Engine.prototype.initialize );

	if( typeof engine == "function" ){
		var engineProperty = Object.getOwnPropertyNames( engine.prototype );
		var enginePropertyLength = engineProperty.length;
		for( let index = 0; index < enginePropertyLength; index++ ){
			var property = engineProperty[ index ];

			Engine.prototype[ property ] = engine.prototype[ property ];
		}
	}

	heredito( Engine, this.constructor );

	Engine = symbiote( Engine, this.constructor );

	//: Register the engine to the Dendron registry.
	harden( name, Engine, Dendron.registry );

	//: Do not be confused on this.
	harden( "engine", name, this );
	harden( name, Engine, this );

	var rootEngine = Engine( {
		"engine": {
			"mold": option.mold,
			"model": option.model
		}
	} );
	harden( "engine", rootEngine, Engine );

	Engine.prototype.rootEngine = rootEngine;

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

	var engine = option.engine || option;

	if( !engine ){
		Fatal( "no engine given", engine )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	if( _.isEmpty( engine ) ){
		Fatal( "empty engine", engine )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	this.name = engine.name || this.name;
	this.label = engine.label || this.label;
	this.title = engine.title || this.title;
	this.alias = engine.alias || this.alias;

	var mold = `${ this.alias }Mold`;
	this.mold = engine.mold || global[ mold ];

	if( ( !this.mold || _.isEmpty( this.mold ) ) &&
		( !engine.model || _.isEmpty( engine.model ) ) )
	{
		Fatal( "empty mold", option )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	snapd.bind( this )
		( function bindEngine( ){
			if( this.mold.attachEngine &&
				typeof this.mold.attachEngine == FUNCTION )
			{
				this.mold.attachEngine( this );
			}
		} );

	this.model = this.mold.model || engine.model;

	if( !this.model || _.isEmpty( this.model ) ){
		Fatal( "empty model", option )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	this.salt = engine.salt || this.salt || this.sodium( );

	if( typeof this.salt != STRING ){
		Fatal( "invalid salt", option )
			.remind( "cannot load engine" )
			.pass( callback, null, option );

		return this;
	}

	if( !this.salt ){
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

	var entity = option.data || option[ this.label ] || { };

	if( !doubt( entity ).ARRAY ){
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

	var label = this.label;

	var array = option.list || option[ label ] || [ ];

	if( doubt( array ).ARRAY ){
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

	var data = loosen( option.data );

	var factor = ( option.factor.length && option.factor ) ||
		Object.keys( ( this.mold && this.mold.factor ) || { } )
			.map( ( function onEachFactor( point ){
				if( point == "model" ){
					return this.name;
				}

				return silph( data, point );
			} ).bind( this ) );

	factor = factor
		.filter( function onEachFactor( point ){
			return ( typeof point != UNDEFINED &&
				point !== null &&
				point !== "" &&
				!isNaN( point ) );
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

	var element = [ ];
	for( let property in option.data ){
		let data = option.data[ property ];

		if( doubt( data ).ARRAY ){
			data.forEach( function onEachElement( item ){
				var type = typeof item;

				if( type == OBJECT ){
					element.push( {
						"type": type,
						"property": property,
						"value": item,

						"name": property
					} );

				}else{
					element.push( {
						"type": type,
						"property": property,
						"value": item,

						"reference": item.reference,
						"name": item.name,
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

	var array = { };
	for( let property in option.data ){
		let data = option.data[ property ];

		if( doubt( data ).ARRAY ){
			data.forEach( function onEachArray( item ){
				var type = typeof item;

				if( type != OBJECT ){
					array[ property ] = array[ property ] || [ ];
					array[ property ].property = property;

					array[ property ].push( item );
				}
			} );
		}
	}

	if( !_.isEmpty( array ) ){
		option.array = array;

		this.set( "array", option.array );
	}

	return this;
};

Dendron.prototype.restrictData = function restrictData( option ){
	option = option || this.option;

	if( this.mold &&
		this.mold.restrict &&
		typeof this.mold.restrict == FUNCTION )
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

	if( option.data && option.identity ){
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
	if( typeof method != FUNCTION ){
		Fatal( "invalid method", method );

		return this;
	}

	if( !this.engine ){
		Fatal( "engine not configured" );

		return this;
	}

	var property = method.name;
	method = optcall.wrap( method );

	var Engine = this[ this.engine ];

	if( !Engine ){
		Fatal( "engine does not exists" );

		return this;
	}

	Engine.prototype[ property ] = method;

	var rootEngine = Engine.engine;

	if( !rootEngine ){
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

	if( typeof this[ action ] == FUNCTION ){
		return this[ action ].bind( this );
	}

	name = name || this.label;

	var parameter = _( raze( arguments )
		.concat( [ name ] )
		.map( function onEachParameter( parameter ){
			return shardize( parameter ).split( "-" );
		} ) )
		.flatten( )
		.compact( )
		.uniq( )
		.value( )
		.join( "-" );

	var methodName = llamalize( parameter );

	if( typeof this[ methodName ] == FUNCTION ){
		return this[ methodName ].bind( this );

	}else if( typeof this[ methodName ] != FUNCTION && name != "document" ){
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
	if( !this.engine ){
		Fatal( "engine is not configured" );

		return null;
	}

	var Engine = this[ this.engine ];

	if( !Engine ){
		Fatal( "engine does not exists" );

		return null;
	}

	harden( this.engine, Engine, global );

	return Engine;
};

/*;
	@method-documentation:
		Default salt creation.
	@end-method-documentation
*/
Dendron.prototype.sodium = function sodium( ){
	var salt = cobralize( `${ this.name }-salt` );

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

	if( !option.factor ){
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
	var factor = [ ].concat( option.factor );

	//: Hash uniqueness factor to differentiate from other models.
	if( this.difference ){
		factor.push( this.difference );
	}

	var hash = crypto.createHash( "sha512" );

	hash.update( JSON.stringify( _.compact( factor ) ) );

	hash = hash.digest( "hex" );

	option.set( "hash", hash );

	option.identity = option.identity || { };
	option.identity.hash = hash;

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

	if( !option.factor ){
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

	//: Preserve the reference of array.
	var factor = [ ].concat( option.factor );

	factor.push( uuid.v1( ) );

	factor.push( uuid.v4( ) );

	var reference = this.root( 1 ).createHash( { "factor": factor } );

	option.set( "reference", reference );

	option.identity = option.identity || { };
	option.identity.reference = reference;

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

	if( !option.factor ){
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

	var hash = this.root( 1 ).createHash( option );

	var salt = option.get( "salt" ) || option.salt || this.salt;

	var stamp = tinge( {
		"factor": option.factor,
		"indexed": true
	} );

	option.set( "stamp", stamp );

	var short = tinge( {
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

	option.identity = option.identity || { };
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
	if( typeof arguments[ 0 ] == OBJECT ){
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

heredito( Dendron, EventEmitter );

module.exports = Dendron;
