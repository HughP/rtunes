<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>rTunes web - ver 1.0</title>
		<link rel="shortcut icon" href="images/icons/1.png"> 
	    <link rel="stylesheet" type="text/css" href="js/thirdpartylib/extjs/resources/css/ext-all-gray.css">
	    <link rel="stylesheet" type="text/css" href="js/thirdpartylib/shared/example.css">
	    <link rel="stylesheet" type="text/css" href="js/thirdpartylib/jquery/css/smoothness/jquery-ui.css" />
	    <link rel="stylesheet" type="text/css" href="js/thirdpartylib/jquery/jPlayer/skin/blue.monday/jplayer.blue.monday.css" />
	    <!-- link rel="stylesheet" type="text/css" href="themes/sky/rTunes.css"-->
	    <link rel="stylesheet" type="text/css" href="css/rTunes.css">
	    <link rel="stylesheet" type="text/css" href="themes/default/rTunes.css">
	    <link rel="stylesheet" type="text/css" href="themes/black/rTunes.css">
	    <link rel="stylesheet" type="text/css" href="themes/jungle/rTunes.css">
	    <link rel="stylesheet" type="text/css" href="themes/sky/rTunes.css">
	    <link rel="stylesheet" type="text/css" href="themes/valentine/rTunes.css">
	    <script type="text/javascript" src="js/thirdpartylib/extjs/ext-all.js"></script>
		<script type="text/javascript" src="js/util/commonUtil.js"></script>
	    <script type="text/javascript">
	    	var userName = rt.cookies.get('userName');
			var sysVolume = rt.cookies.get('sysVolume');
			var rTunesTheme = rt.cookies.get('rTunes-theme');
	    </script>
		<script type="text/javascript" src="js/thirdpartylib/jquery/js/jquery.min.js"></script>
		<script type="text/javascript" src="js/thirdpartylib/jquery/jPlayer/jquery.jplayer.js"></script>
		<script type="text/javascript" src="js/thirdpartylib/jquery/jPlayer/add-on/jplayer.playlist.js"></script>
		<script type="text/javascript" src="js/thirdpartylib/socket/socket.io.js"></script>
		<script type="text/javascript" src="js/thirdpartylib/google/jsapi.js"></script>
    	<!--link rel="stylesheet" type="text/css" href="js/thirdpartylib/sencha/resources/css/sencha-touch.css"-->
    	<script>
			Ext.Loader.setConfig({enabled: true});
			Ext.Loader.setPath('Ext.ux', 'js/thirdpartylib/extjs/ux/');
			var appBaseUrl = "rTunesAction.do";
			try{
				google.load('search', '1');
			}catch(e){}
			// Load google search
			Ext.onReady(function(){
				Ext.getBody().dom.className= rTunesTheme + " x-body x-webkit x-chrome x-mac x-reset rtunes-main-panel x-border-layout-ct x-container";
				var isMobile = {
				    Android: function() {
				        return navigator.userAgent.match(/Android/i);
				    },
				    BlackBerry: function() {
				        return navigator.userAgent.match(/BlackBerry/i);
				    },
				    iOS: function() {
				        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
				    },
				    Opera: function() {
				        return navigator.userAgent.match(/Opera Mini/i);
				    },
				    Windows: function() {
				        return navigator.userAgent.match(/IEMobile/i);
				    },
				    any: function() {
				        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
				    }
				};
				if(userName && userName !== ""){
					if(isMobile.any()){
						window.location.href="rTunesMobileAction.do?command=switchToMobile&userName=" + userName;
					}
					var app = new rTunes.App();
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
											if(isMobile.any()){
												window.location.href="rTunesMobileAction.do?command=switchToMobile&userName=" + userName;
											}
											var app = new rTunes.App();
											win.close();
										}
									}
								}
							},
							emptyText:"Enter Your Name aka Aliase...!!",
							value:userName
						});
					var win = Ext.create('Ext.window.Window', {
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
				}
	        });
		</script>
		<script type="text/javascript" src="js/rTunes/rTunes.js"></script>
	</head>
	<body id-"rtunes-body" class=""></body>
</html>