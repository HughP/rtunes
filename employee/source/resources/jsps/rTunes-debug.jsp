<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Debug - rTunes web - ver B1.0</title>
		<link rel="shortcut icon" href="../images/rTunes2.png"> 
	    <link rel="stylesheet" type="text/css" href="../js/thirdpartylib/extjs/resources/css/ext-all-gray.css">
	    <link rel="stylesheet" type="text/css" href="../js/thirdpartylib/shared/example.css">
		<script type="text/javascript" src="../js/thirdpartylib/extjs/ext-all.js"></script>
		<script type="text/javascript" src="../js/util/commonUtil.js"></script>
		<script type="text/javascript" src="../js/rTunes/rTunes-debug.js"></script>
    	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    	<!--link rel="stylesheet" type="text/css" href="js/thirdpartylib/sencha/resources/css/sencha-touch.css"-->
		<script type="text/javascript">
			var userName = rt.cookies.get('userName');
			
			var appBaseUrl = "/rtunes/rTunesAction.do";
			Ext.onReady(function(){
				if(userName && userName !== ""){
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
										// name, value, expires, path, domain, secure
										rt.cookies.set('userName', userName, 7, '/', '', '' );
										var app = new rTunes.App();
										win.close();
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
	</head>
	<!-- root element for everything -->
	<body>
	</body>
</html>