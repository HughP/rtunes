<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>rTunes Mobile - ver 1.0B</title>
		<link rel="shortcut icon" href="images/icons/1.png"> 
	    <link rel="stylesheet" type="text/css" href="js/thirdpartylib/jquery/css/smoothness/jquery-ui.css" />
	    <link rel="stylesheet" type="text/css" href="js/thirdpartylib/jquery/jPlayer/skin/blue.monday/jplayer.blue.monday.css" />
	    <!--link rel="stylesheet" type="text/css" href="js/thirdpartylib/extjs/resources/css/ext-all-gray.css">
	    <link rel="stylesheet" type="text/css" href="js/thirdpartylib/shared/example.css">
	    
	    <link rel="stylesheet" type="text/css" href="themes/sky/rTunes.css">
	    <link rel="stylesheet" type="text/css" href="css/rTunes.css">
	    <script type="text/javascript" src="js/thirdpartylib/extjs/ext-all.js"></script-->



		<link rel="stylesheet" type="text/css" href="js/thirdpartylib/sencha/resources/css/apple.css">
    	<link rel="stylesheet" type="text/css" href="themes/mobile/rTunes.css">
    	<script type="text/javascript" src="js/thirdpartylib/sencha/sencha-touch-all-debug.js"></script>
		<script type="text/javascript" src="js/util/commonUtil.js"></script>
	    <script type="text/javascript">
	    	var userName = rt.cookies.get('userName');
			var sysVolume = rt.cookies.get('sysVolume');
	    </script>
		<script type="text/javascript" src="js/thirdpartylib/jquery/js/jquery.min.js"></script>
		<script type="text/javascript" src="js/thirdpartylib/jquery/jPlayer/jquery.jplayer.js"></script>
		<script type="text/javascript" src="js/thirdpartylib/jquery/jPlayer/add-on/jplayer.playlist.js"></script>
		<script type="text/javascript" src="js/thirdpartylib/socket/socket.io.js"></script>
    	<script type="text/javascript" src="js/rTunes/rTunesMobile.js"></script>
    	<script>
			//Ext.Loader.setConfig({enabled: true});
			//Ext.Loader.setPath('Ext.ux', 'js/thirdpartylib/extjs/ux/');
			var appBaseUrl = "rTunesAction.do";
			var doLoadMobile = function(){
				//<debug>
				Ext.Loader.setPath({
				    'Ext': '../../src'
				});
				//</debug>

				/**
				 * This is a simple demo of the TabPanel component in Sencha Touch.
				 *
				 * This is similar to the other tabs example, only the tabbar is docked to the bottom.
				 */
				Ext.application({
				    startupImage: {
				        '320x460': 'resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
				        '640x920': 'resources/startup/640x920.png', // Retina iPhone and iPod touch
				        '640x1096': 'resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
				        '768x1004': 'resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
				        '748x1024': 'resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
				        '1536x2008': 'resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
				        '1496x2048': 'resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
				    },

				    isIconPrecomposed: false,
				    icon: {
				        57: 'resources/icons/icon.png',
				        72: 'resources/icons/icon@72.png',
				        114: 'resources/icons/icon@2x.png',
				        144: 'resources/icons/icon@144.png'
				    },

				    //require any components we use in the application
				    requires: [],

				    /**
				     * The launch function is called when the browser and the framework is ready
				     * for the application to launch.
				     *
				     * All we are going to do is create a simple tabpanel with some items, and add
				     * it to the global Ext.Viewport instance.
				     */
				    launch: function() {
				        //we send a config block into the Ext.Viewport.add method which will
				        //create our tabpanel
				        var mainPanel = Ext.create('rTunesMobile', {

				        });
				        Ext.Viewport.add(mainPanel);
				    }
				});
			};
			Ext.require([
			    'Ext.form.*',
			    'Ext.Panel',
			    'Ext.data.*'
			]);
			Ext.onReady(function(){
				doLoadMobile();/*
				if(userName && userName !== ""){
					doLoadMobile();
				}else{
					var userNameCmp = Ext.create('Ext.form.TextField',{
							xtype:'textfield',
							width:200,
							enableKeyEvents:true,
							listeners	: 	{
								'keypress':	function(field,e){
									var key = e.getKey();
									if(key === e.ENTER){
										userName = field.getValue();
										if(userName !== ""){
											// name, value, expires, path, domain, secure
											rt.cookies.set('userName', userName, 7, '/', '', '' );
											doLoadMobile();
											win.close();
										}
									}
								}
							},
							emptyText:"Enter Your Name aka Aliase...!!",
							value:userName
						});
					var win = Ext.create('Ext.Panel', {
						title:'Welcome',
						modal:true,
						autoShow:false,
						listeners:{
							'afterrender':function(){
								
							}
						},
						items:[userNameCmp]
					});
					win.show();
					userNameCmp.focus(true, 500);
				}*/
	        });
		</script>
	</head>
	<body>

	</body>
</html>