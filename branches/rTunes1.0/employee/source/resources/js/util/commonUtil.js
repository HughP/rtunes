/*!
 *  rTunes 1.0.0
 *  Application object defining common functions and attribute 
 */

(function(){
	
	// Private vars
	var version="1.0.0";
	var dictionary={}; //Dictionary object that contains all the translations
	
	// Main rTunes object - we'll expose it later
	var rTunes={
		version: version,
		enableAutoRun: true,
		onReady: domReady,
		loadJavascript: injectJS,
		resources : {
			defaultImg 			: '/resources/images/default',
			imgPath 			: '/resources/images',
			iconPath 			: '/resources/images/icons',
			logoPath 			: '/resources/images/logos',
			fileFormatPath 		: '/resources/images/formats',
			documentsImg 		: '/resources/images/pol/documents',
			activitiesImg 		: '/resources/images/pol/activities',
			homeImg 			: '/resources/images/icons/home',
			homeCssPath			: '/resources/css/pol/home',
			activitiesCssPath	: '/resources/css/pol/activities',
			documentsCssPath	: '/resources/css/pol/documents',
			cssPath 			: '/resources/css',
			jsPath 				: '/resources/js'
		},
		
		/*
		 * Genrate Image with Path
		 * @param pathUrl
		 * @param fileName with Extension
		 * @return String for image dom element
		 */
				
		getImage : function(pathUrl, fileName, id, height, width, styleClass, altText, onClick, title) {
			
			
			var imgEl="<img";
			if(id) imgEl += " id='" + id + "'";
			imgEl += " src='" + pathUrl +"/"+fileName + "'";
			if(height && height != "") imgEl += " height='" + height + "'";
			if(width && width != "") imgEl += " width='" + width + "'";
			if(styleClass && styleClass != "") imgEl += " class='" + styleClass + "'";
			if(altText && altText != "") imgEl += " alt='" + altText + "'";
			if(onClick) imgEl += " onclick='" + onClick + "'";
			if(title) imgEl += " title='" + title + "'";
			imgEl += " />"
			return imgEl;
		},
		
		/**
		 * Standard rTunes function
		 */
		constants: {
		  EMPTY_TITLE: "&nbsp;"
	    },
	    
	    /**
	     * Utility methods such as dom manipulations etc - can be added to via the base classes
	     */
	    util: {
	    	
	    	/**
	    	 * Allows bulk operations to be peformed on dom nodes 
	    	 * @param {string} 		One of Enable / Disable / Mask
	    	 * @param {array}		String array of item ids against which the action is performed
	    	 * @return {element}	 None
	    	 */	    	
	    	bulk: function(_action, _items){
	    		
				for(var i =0; i < _items.length; i++){
					var item = rt.util.getCmp(_items[i]);
					switch (_action){
						case "disable": item.disable(); break;
						case "enable": item.enable(); break;
						case "mask": util.maskItem(_items[i]); break;
					}
				}
	    	},
	    	
	    	/**
	    	 * Masks a supplied object
	    	 * @param {string} 		_id The id of the required dom element to be masked for an AJAX call.
	    	 * 						EXT removes the mask upon the AJAX return.
	    	 * @return {element}	 None
	    	 */	    	
	    	maskItem : function(_id){
				var myMask = new Ext.LoadMask(_id, {msg:$w("global","loadMaskText_loadWait")});
				myMask.show();
	    	},
	    	
	    	/**
	    	 * Returns a DOM element based on its ID or returns null if not found
	    	 * @param {string} _el The id of the required dom element
	    	 * @return {element} The required dom element or null if not found
	    	 */
	    	get: function(_el){
	    		return document.getElementById(_el) || null;
	    	},
	    	
	    	/**
	    	 * Generates a dialog box in one of 3 abstract sizes (small, medium or large) whilst taking into account the user's screen dimensions
	    	 * @param {string} _size One of "small", "medium" or "large".  Small = 25% of region size, Medium = 50% of region size, Large = 90% of region size
	    	 * @param {string} _xy One of "x","y" or "xy".  x returns the width, y returns the height and xy returns an object containing both
	    	 * 					{
	    	 * 						x: value,
	    	 * 						y: value
	    	 * 					}
	    	 * 					 
	    	 * @param {string} _region The id of the required region - defaults to "center"
	    	 * @return {element} Height, Width or object containing both
	    	 */	    	
	    	generateDialogSize: function(_size, _xy, _region){
	    		
	    		var wSmall = hSmall = .25;
	    		var wMedium = hMedium = .5;
	    		var wLarge = hLarge = .9;
	    		
	    		//If not equal to one of small, medium or large then default to medium
	    		var size = /small|medium|large/.test(_size)?_size:"medium";
	    		
	    		//Default to xy if not one of x, y or xy
	    		var xy = /x|y|xy/.test(_xy)?_xy:"xy";
	    		
	    		//Test for the _region and if it exists use it, otherwise default it to center
	    		var region = document.getElementById(_region)?_region:"center";
	    		
	    		var x, y, ret;
	    		
	    		//Get the width and height of the region 
	    		var r_width=document.getElementById(region).offsetWidth;
	    		var r_height=document.getElementById(region).offsetHeight;
	    		
	    		//Calculate the return x and y values based on the chosen size - whilst defaulting to medium
	    		switch(size){
	    			case "small":
	    				x=r_width * wSmall;
	    				y=r_height * wSmall;
	    				break;
	    			case "large":
	    				x=r_width * wLarge;
	    				y=r_height * wLarge;
	    				break;	    			
	    			default: 
	    				x=r_width * wMedium;
	    				y=r_height * wMedium;
	    				break;	    			
	    		}
	    		
	    		//If x and y are requested then return an object - otherwise return the required param
	    		if(xy=="xy"){
	    			ret={x:x, y:y}
	    		}
	    		else {
	    			ret = (xy == "x"?x:y);
	    		}
	    		
	    		return ret;
	    		
	    	},
	    	
	    	isActionSucessful: function(_el, config){
	    		var currNode = _el.getElementsByTagName("success")[0];
				/*var isSuccess = Ext.DomQuery.selectValue(
										"success @isActionSucessful",
										_el);*/
	    		var recordType = currNode.attributes[0].nodeValue;
				var actionSuccess = (recordType == "true") ? true : false;
				var display = (config && config.display == 'none') ? false : true;
				var errormessage = rt.util.getMessage(_el) == "" ? $w('global', 'saveDone') : rt.util.getMessage(_el);
				
				if(actionSuccess){
					if(display){
						var notifyWin = app.desktop.showNotification({
							iconCls		: 	(config && config.iconCls)? config.iconCls : 'x-icon-done',
							hideDelay	: 	(config && config.hideDelay) ? config.hideDelay : 2000,
							bodyCssClass: 	(config && config.bodyCssClass)? config.bodyCssClass : 'fs-action-success',
							title		:	(config && config.title) ? config.title : $w('global', 'actionSuccess'),
							html		: 	(config && config.msg) ? config.msg : errormessage,
							height		: 	(config && config.height) ? config.height : 50,
							width		: 	(config && config.width) ? config.width : 300
						});
					}
				}else{
					if (display) {
						var notifyWin = app.desktop.showNotification({
							iconCls		: 	(config && config.errorIconCls) ? config.errorIconCls : 'x-icon-alert',
							hideDelay	: 	(config && config.hideDelay) ? config.hideDelay : 3000,
							bodyCssClass: 	(config && config.errorBodyCssClass) ? config.errorBodyCssClass : 'fs-action-alert',
							title		: 	(config && config.title) ? config.title : $w('global', 'actionFailed'),
							html		: 	(config && config.errorMsg) ? config.errorMsg : $w('global', 'saveError'),
							height		: 	(config && config.height) ? config.height : 50,
							width		: 	(config && config.width) ? config.width : 300
						});
					}
				}
	    		return actionSuccess;
	    	},
	    	getSucessfulActionKey: function(_el){
	    		if(Ext.isIE){
	    			return _el.childNodes[0].text
	    		}else{
	    			return _el.childNodes[0].textContent
	    		}
	    	},
	    	getErrorRecordsByXml: function(_el){
	    		var errorsStore = new Ext.data.Store({
					reader : rt.readers.commonError
				})
				errorsStore.loadData(_el);
				return errorsStore.data.items;
	    	},
	    	showMessages: function(_el, _errorpanel){
	    		var errormessage = rt.util.getMessage(_el);
				if(errormessage != ""){
					_errorpanel.addCommonError(errormessage);
					_errorpanel.setStatus({
		                text	:	$w("global", "errorPanelShowDetailsText"),
		                iconCls	:	'x-status-error'
		            });
				}
	    	},
	    	getMessage : function(_el){
	    		var errorsStore = new Ext.data.Store({
					reader : rt.readers.commonError
				})
				errorsStore.loadData(_el);
				errormessage = "";
				errorsStore.each(function(rec){
					errormessage =  errormessage +  $w(rec.get('namespace'),rec.get('identifier'),rec.get('params')) + "<br>";
				});
				return errormessage;
	    	},
	    	
	    	/**
	    	 * Sends a log message to the debug console for Firefox or Opera
	    	 * @param {string} _str The string to display
	    	 * @param {string} _type One of info, warning or error [optional]
	    	 */
	    	log: function(_str, _type){

	    		try{
		    		//Firefox uses console
		    		if(window.console){
		    			switch(_type){
		    				case "info": console.info(_str); break;
		    				case "warning":console.warning(_str); break;
		    				case "error":console.error(_str); break;
		    				default: console.info(_str); break;
		    			}
		    		}
		    		else{
		    			
		    			//Opera uses post.error
		    			if(window.opera){
		    				window.opera.postError(_type?(_type + ": " + _str):_str)
		    			}
		    		}
	    		}
	    		catch(e){}
	    	},
			
			getRadioValue: function(el){
				var retVal="";
				if(el && el.length > 0 && el[0].type=="radio"){  //test if an object has been passed in, whether it has a length and then if we’re even looking at a radio button – if not then bail out
					for(var i=0; i<el.length; i++){
						if(el[i].checked){
							retVal=el[i].value;
							break;
						}
					}
				}
				return retVal;
			},
			
			trim: function(str, chars) {
				return rt.util.ltrim(rt.util.rtrim(str, chars), chars);
			},
			 
			ltrim: function(str, chars) {
				chars = chars || "\\s";
				return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
			},
			 
			rtrim: function(str, chars) {
				chars = chars || "\\s";
				return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
			},
			
			//Returns true if the browser can create an IE only 
			//ActiveX object.
			isActiveX: function () {
				var is_activex_enabled = "undefined";
			
				if (is_activex_enabled == "undefined") {
					
					try {
						var dict = new ActiveXObject("Scripting.Dictionary");
					} catch (e) {
						is_activex_enabled = false;
						return false;
					}
			
					if (dict != null) {
						is_activex_enabled = true;
						return true;
					}
					is_activex_enabled = false;
					return false;
				} 
				return is_activex_enabled;
			}
	    	
	    },
	    
		/**
		 * Standard rTunes function.
		 */
		lang:{
			/**
			 * Returns seconds as milliseconds.
			 * @param value	The value to convert.
			 */
			seconds: function(value) {
				return value * 1000;
			},
			
			/**
			 * Returns minutes as milliseconds.
			 * @param value	The value to convert.
			 */
			minutes: function(value) {
				return this.seconds(value) * 60;
			},
			
			/**
			 * Returns hours as milliseconds.
			 * @param value	The value to convert.
			 */
			hours: function(value) {
				return this.minutes(value) * 60;
			},
			
			/**
			 * Takes a source string containing a set of placeholder tokens like "this is my {1} string
			 * and replaces the {n} values with the string in position n in the array
			 * Example: rt.format.tokenize("this {1} my {2}",["is","string"] returns, "this is my string"
			 * 
			 * @param _string string A string containing place holders marked in {n} format
			 * @param _tokens array An array of strings that are copied into the source string - if any of the items are not strings
			 * 						they will be blanked
			 */
			tokenize: function(_string,_tokens){
				var str=_string;
				if(_tokens  && lang.isArray(_tokens)){
					for(var iCount=0; iCount< _tokens.length; iCount++){
						//Replace the token with the string at position in the array.  If the array item n is not a string then
						//replace the token with a blannk string
						str=str.replace("{" + (iCount+1) + "}", typeof _tokens[iCount]==="string"?_tokens[iCount]:"");
					}
				}
				return str;
				 
			},
			
			/**
			 * Tests if a supplied object is an array or not
			 * @param {any} The object to be tested 
			 * @return {boolean} The result
			 */
			isArray: function(o){
				return !!o.push;
			},
			
			/**
			 * Tests if a supplied object is a number or not
			 * @param {any} The object to be tested
			 * @return {boolean} The result
			 */
			isNumber: function(o){
				return typeof o === "number";
			},

			/**
			 * Tests if a supplied object is an integer or not
			 * @param {any} The object to be tested
			 * @return {boolean} The result
			 */			
			isInteger: function(o){
				var inp = Math.floor(o);
                return rt.lang.isNumber(inp);
                //return Math.floor(o) == this ? true : false;
			},
			
			/**
			 * Test is a supplied object is a boolean or not
			 * @param {any} o The object being tested
			 * @return {boolean} The result
			 */
			isBoolean: function(o){
				return typeof o === "boolean"
			},
			
			/**
			 * Test is a supplied object is a string or not
			 * @param {any} o The object being tested
			 * @return {boolean} The result
			 */
			isString: function(o){
				return typeof o === "string"
			},

			/**
			 * Test is a supplied object is undefined or not
			 * @param {any} o The object being tested
			 * @return {boolean} The result
			 */
			isUndefined: function(o){
				return typeof o === "undefined"
			},
			
			/**
			 * Test is a supplied object is null or not
			 * @param {any} o The object being tested
			 * @return {boolean} The result
			 */
			isNull: function(o){
				return o === null;
			},
			
			/**
			 * Test is a supplied object is a function or not
			 * @param {any} o The object being tested
			 * @return {boolean} The result
			 */
			isFunction: function(o){
				return /Function/.test(Object.prototype.toString.apply(o));
			},
			
			/**
			 * Check if the given object is of type date.
			 * @param 	{any} o The object being tested.
			 * @return 	{boolean} The result. 
			 */
			isDate: function(o) {
				return Object.prototype.toString.apply(o) === '[object Date]';
			},
			
			/**
			 * Test is a supplied object is empty or not
			 * @param {any} o The object being tested
			 * @return {boolean} The result
			 */
			isEmpty: function(o){
			    for(var prop in o) {
			        if(o.hasOwnProperty(prop))
			            return false;
			    }
			    return true;				
			},
				    	
	    	/*
	    	 * Replaces all occurances in string.
	    	 */
		    replaceStr: function (src, find, strRep){
		       return src.replace(new RegExp(find,"g"), strRep);
			},
			
			/**
			 * Test is a supplied string is empty or not
			 * @param {any}sToCheck The string being tested
			 * @return {boolean} The result
			 */
			isStringEmpty: function(sToCheck) {
			   var sTest;
			   sTest = sToCheck.trim();
			   if (sTest == null || sTest == "") {
			      return true;
			   }
			   return false;
			}
		},
		
		/**
		 * Locale based functions such as getting and setting values, example of use are:
		 * 
		 * 	//Set the locale from the global file	
		 *	rt.locale.setLocale("en-en");
		 *
		 *	//Global language items
		 * 	rt.locale.loadNamespace("global",{
		 *		"open": "open",
		 * 		"close": "close"	
		 *	});
		 *
		 *	rt.locale.loadNamespace("documents", {
		 *		"welcome": "Welcome to {1}"
		 *	});
		 */
		locale:{
			
			/**
			 * Returns the required word based on a supplied key.  If additional params are supplied then these
			 * become the token keys in phrase generation, additional params can either be a group of strings separated
			 * be a comma or an array of strings
			 * 
			 * Examples:
			 * 	write("global", "open");  --> gets the translation for "open" from the "global" namespace
			 * 	write("documents", "welcome", [workspace]) --> might return "Welcome to Normal-Workspace" where 
			 * 		"Normal-Workspace" was passed as a string workspace
			 * 
			 * @param _namespace	Mandatory string that dictates the required namespace from which to pull
			 * 					 	the key from.  
			 * @param _key  		Mandatory string indicating the key
			 * @param (optional) 	An array of strings that will match locations in the source string
			 * @return string 		The string matching the supplied namespace and key - or a tokenized version of it 
			 * 
			 */
			write: function(_namespace, _key){
			
				var str="";
			
				if(dictionary.hasOwnProperty(_namespace)){
					
					var str=dictionary[_namespace][_key];
					str = str==undefined?_key:str;
				
					//Don't tokenize if no additional arguments are supplied and then only tokenize if the third
					//parameter is an array
					if(arguments.length == 3 && lang.isArray(arguments[2])){
						str=lang.tokenize(str, arguments[2])
					}
				}else{
					// if namespace does not exist - return the key
					return _key
				}
				
				//If the key doesn't exist - pass back a blank
				return str;
			},
			
			/**
			 * Returns the locale code for the currently loaded language, e.g. en-gb
			 * @return string containing language code
			 */
			getLocale: function(){
				return dictionary.languageCode||"xx-xx"; 
			},
			
			/**
			 * Allows the locale string to be set.  Usually called from the local-****-global.js file
			 * @param _lang string containing language code 
			 */
			setLocale: function(_lang){
				if(lang.isString(_lang))dictionary.languageCode=_lang;
			},
			
			/**
			 * 
			 */
			loadNamespace: function(_namespace, _values){
				dictionary[_namespace]=_values;
			},
			
			/**
			 * 
			 */
			removeNamespace: function(_namespace){
				dictionary.remove(_namespace);
			}
			
		},
		style: {
			set: 
				function setActiveStyleSheet(title) {
					var i, a, main;
					for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
						if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
							a.disabled = true;
						if(a.getAttribute("title") == title) a.disabled = false;
						}
					}
					
					//Set the cookie with the changed style - TODO: this will get replaced with a server side call
					cookies.set("fsstyle",title,9999,"/","","");
				}			
		},
		
		
		/*
		 * Handler for retaining sets of values between sessions and workspaces
		 */
		settings : {
		},
		localStorage : {
			clearForWorkspace : function(){
			 	var sp = Ext.state.Manager.getProvider();
				sp.clear(String(rt.projectSettings.projectId));
			}
		},
		cookies : {
			/** Old Cookie implementation 
			 * 
			 * SAMPLE CODE AT BOTTOM!!!
			 *
			 * You need to put the name and values in quotes when you call the function, like this:
			 * rt.cookies.set( 'mycookie', 'visited 9 times', 30, '/', '', '' );. Don't forget to put in empty quotes for the unused parameters or
			 * you'll get an error when you run the code. This makes the cookie named 'mycookie', with the value of 'visited 9 times', and with 
			 * a life of 30 days, and the cookie is set to your root folder.
			 *
			 * The rt.cookies.set values for 'domain' and 'secure' are not utilized. Use 'domain' on the Javascript cookie if you are using it on a 
			 * subdomain, like widgets.yoursite.com, where the cookie is set on the widgets subdomain, but you need it to be accessible over the
			 * whole yoursite.com domain.
			 *
			 * It's good practice to not assume the path to the site root will be set the way you want it by default, so do this manually as a 
			 * rule, '/'. If no value is set for expires, it will only last as long as the current session of the visitor, and will be automatically 
			 * deleted when they close their browser. 
			 */
			set: function(name, value, expires, path, domain, secure){
				// set time, it's in milliseconds
				var today = new Date();
				today.setTime( today.getTime() );
				/*
				if the expires variable is set, make the correct 
				expires time, the current script below will set 
				it for x number of days, to make it for hours, 
				delete * 24, for minutes, delete * 60 * 24
				*/
				if ( expires )
				{
				expires = expires * 1000 * 60 * 60 * 24;
				}
				var expires_date = new Date( today.getTime() + (expires) );
				
				document.cookie = name + "=" +escape( value ) +
				( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + 
				( ( path ) ? ";path=" + path : "" ) + 
				( ( domain ) ? ";domain=" + domain : "" ) +
				( ( secure ) ? ";secure" : "" );
			},
			/*
			 * This will retrieve the cookie by name, if the cookie does not exist, it will return false, so you can do things like 
			 * if ( rt.cookies.get( 'your_cookie' ) ) do something.
			 */
			get: function(name) {
				var start = document.cookie.indexOf(name + "=");
				var len = start + name.length + 1;
				var retVal;
				
				if ((!start) && (name != document.cookie.substring(0, name.length )))
				{
					return null;
				}
				if (start == -1) return null;
				var end = document.cookie.indexOf(";", len);
				if (end == -1) end = document.cookie.length;
				
				//Document cookie reading returns a string of "null" rather than a real null
				//If we get back "null" then convert it to is real null for the benefit of calling apps
				retVal=unescape(document.cookie.substring(len, end));
				return (retVal==="null")?null:retVal;
				
			},
			/*
			 * Here all you need to do is put in: rt.cookies.remove('cookie name', '/', '') and the cookie will be deleted. Remember to match 
			 * the cookie name, path, and domain to what you have it in Set_Cookie exactly, or you may get some very hard to diagnose errors.
			 */
			// this deletes the cookie when called
			remove: function(name, path, domain) {
				if(rt.cookies.get(name)) document.cookie = name + "=" + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
			},
			
			/**
			 * Remove all cookies that relate to THIS DOCUMENT ONLY.  It does not removes all the cookies
			 * on the browser
			 * @param _all whether to remove ALL cookies including the session cookie or just the layout cookies
			 * @return nothing
			 */
			removeAll : function(_msg, _all){
				
				//Get all the cookies
				var tmp = document.cookie
				
				//Put them into an array
				var aCookies = tmp.split(";");
				
				
				//Iterate through the cookies and remove them
				for(var cookie = 0; cookie < aCookies.length; cookie++){
					
					var tmpCookie = aCookies[cookie];
					var key = tmpCookie.substring(0,tmpCookie.indexOf("=")).replace(/^\s*|\s*$/,"");
					
					if(_all || (!_all && /^ys/.test(key))){
						cookies.set(key,"",0,"/","","");
					}
				}
				
				return (_all ? "All cookies removed" : _msg);
			}
			
			
			/*
			 * SAMPLE CODE FOR COOKIES
			 *
			 * <script type="text/javascript">
			 * // remember, these are the possible parameters for rt.cookies.set():
			 * // name, value, expires, path, domain, secure
			 * rt.cookies.set( 'test', 'it works', '', '/', '', '' );
			 * if ( rt.cookies.get( 'test' ) ) alert( rt.cookies.get('test'));
			 * // and these are the parameters for Delete_Cookie:
			 * // name, path, domain
			 * // make sure you use the same parameters in Set and Remove Cookie.
			 * rt.cookies.remove('test', '/', '');
			 * ( rt.cookies.get( 'test' ) ) ? alert( rt.cookies.get('test')) : 
			 * alert( 'it is gone');
			 * </script>
			 */
		},
		changeTheme:function(theme){
			if(!theme){
				theme = {			
					id:'xtheme',
					name:'xtheme',
					path:'../../resources/themes/xtheme'
				};
			}
		}
	}
	
	
	//
	//Private methods
	//
	var lang=rTunes.lang;
	var util=rTunes.util;
	var cookies=rTunes.cookies;
	
	
	/**
	 * Injects a script javascript file into the dom at runtime applying an id against it, removing
	 * the current script node with the same ID first (if it exists).  When the file has loaded  
	 * @param _params A json object consisting of src , id and a function
	 * 					e.g. {
	 * 							id:"myscript", 
	 * 							src:"", 
	 * 							fn: function(){alert("hello")}
	 * 						}
	 *			 
	 * @return false
	 */
	function injectJS(_params){
		//var isJsLoaded = false;
		//Do nothing if the function hasn't been passed in a src
		if(typeof _params.src === "string"){
			
			var elHead=document.getElementsByTagName("head")[0];
			var src=_params.src;
			var id=_params.id|"";  //If an ID hasn't been passed in, default it to an empty string
			
			//If the old script exists then remove it from the dom
			if(id != ""){
				var oldScript=document.getElementById(id); //Get handle on existing script
				if(oldScript) elHead.removeChild(oldScript);
			}
			
			//Create a new script node in the head and set its src to load the new script
			var js=document.createElement("script");
			js.setAttribute("type", "text/javascript");
			js.setAttribute("id", id);
			js.setAttribute("src", src);
			elHead.appendChild(js);
			
			//Set up the call-backs.  These execute the passed in function (if supplied)
			//when the js file has loaded.  IE uses onreadystatechange and others use onload
			if(typeof _params.fn == "function"){
				js.onreadystatechange=function(){
					if(/complete[d]?|loaded/.test(js.readyState)){
						isJsLoaded = true;
						_params.fn();
					}
				}
				js.onload=function(){
					isJsLoaded = true;
					_params.fn();
				}
			}
		}
		return false;
	}
	
	/**
	 * The domReady and isDomReady functions are used to allow the user to fire code when the page's dom has loaded.
	 * This is not the same as window.onload which fires when everything on the page loaded which means that we'd
	 * have to wait until all images are loaded as well. The dom can be manipulated before the images are loaded and 
	 * that's what this function allows.  Also, it removes the requirement to rely on a framework's isReady event.
	 * It determines if the dom is ready by checking if functions such as getElemetsByTagName are accessible as they 
	 * are not before the dom is fully loaded.
	 */
	function domReady(f){
		if(domReady.done)return f();
		if(domReady.timer){
			domReady.push(f);
		}
		else{
			addEvent(window,"load",isDOMReady);
			domReady.ready=[f];
			domReady.timer=setInterval(isDOMReady,13);
		}
	}
	
	function isDOMReady(){
		if(domReady.done)return false;
		if(document && document.getElementsByTagName &&
				document.getElementById && document.body){
			clearInterval(domReady.timer);
			domReady.timer=null;
			for(var i=0; i<domReady.length; i++){
				domReady.ready[i]();
			}
			domReady.ready=null;
			domReady.done=true;
		}
	}
	
	/**
	 * A cross platform method to add event handling to objects.  It also adds a cache object that removes all the 
	 * events on unloading the page.  This is to stop memory leaks as IE remembers all event handlers even if the page
	 * is refreshed. 
	 */
	function addEvent( obj, type, fn ) {
		if (obj.addEventListener) {
			obj.addEventListener( type, fn, false );
			EventCache.add(obj, type, fn);
		}
		else if (obj.attachEvent) {
			obj["e"+type+fn] = fn;
			obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
			obj.attachEvent( "on"+type, obj[type+fn] );
			EventCache.add(obj, type, fn);
		}
		else {
			obj["on"+type] = obj["e"+type+fn];
		}
	}

	var EventCache = function(){
		var listEvents = [];
		return {
			listEvents : listEvents,
			add : function(node, sEventName, fHandler){
				listEvents.push(arguments);
			},
			flush : function(){
				var i, item;
				for(i = listEvents.length - 1; i >= 0; i = i - 1){
					item = listEvents[i];
					if(item[0].removeEventListener){
						item[0].removeEventListener(item[1], item[2], item[3]);
					};
					if(item[1].substring(0, 2) != "on"){
						item[1] = "on" + item[1];
					};
					if(item[0].detachEvent){
						item[0].detachEvent(item[1], item[2]);
					};
					item[0][item[1]] = null;
				};
			}
		};
	}();
	addEvent(window,'unload',EventCache.flush);	
	
	// Defining global namespace for rTunes
	window.rt=rTunes;
	
})()


		
/**
 * Shortcut rt.locale.write - saves time and file size...
 */
	var $w=rt.locale.write;

/**
 * Shortcut rt.util.log - saves time...
 */
	var $l = rt.util.log;