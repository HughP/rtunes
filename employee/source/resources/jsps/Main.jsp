<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/taglibs/jstl/c" prefix="c"%>
<%@page import="com.extjs.commonentity.UserDetail"%>
<%@page import="com.extjs.commonentity.UserSettings"%>

<%@page import="java.util.List"%>

<%@page import="java.util.Iterator"%>
<%@page import="com.extjs.commonentity.Media"%><html>
<%

    UserSettings userSettings = (UserSettings) session.getAttribute( "userSettings");
	String name = userSettings.getFirstName() + " " + userSettings.getLastName();
%>
	<head>
		<title>me-music - ver 1.0</title>
		<link rel="stylesheet" type="text/css" href="/js/thirdpartylib/jquery/css/smoothness/jquery-ui.css" />
		<link rel="stylesheet" type="text/css" href="/js/thirdpartylib/jquery/jqGrid/plugins/searchFilter.css" />
		<link rel="stylesheet" type="text/css" href="/js/thirdpartylib/jquery/jqGrid/src/css/ui.multiselect.css" />
		<link rel="stylesheet" type="text/css" href="/js/thirdpartylib/jquery/jqGrid/src/css/ui.jqgrid.css" />
		<link rel="stylesheet" type="text/css" href="/js/thirdpartylib/jquery/jPlayer/skin/circle.skin/circle.player.css" />
		<!--link rel="stylesheet" type="text/css" href="/js/thirdpartylib/jquery/jPlayer/skin/pink.flag/jplayer.pink.flag.css" /-->
		<script type="text/javascript">
			var currentUser = '<%=name %>';
		</script>
		<script type="text/javascript" src="/js/thirdpartylib/socket/socket.io.js"></script>
		<script type="text/javascript" src="/js/thirdpartylib/jquery/jqGrid/js/jquery.min.js"></script>
	    <script type="text/javascript" src="/js/thirdpartylib/jquery/js/jquery-ui-1.8.19.custom.min.js"></script>
	    <script type="text/javascript" src="/js/thirdpartylib/jquery/jqGrid/plugins/ui.multiselect.js"></script>
	    <script type="text/javascript" src="/js/thirdpartylib/jquery/jqGrid/js/i18n/grid.locale-en.js"></script>
	    <script type="text/javascript" src="/js/thirdpartylib/jquery/jqGrid/js/jquery.jqGrid.src.js"></script>
	    <script type="text/javascript" src="/js/thirdpartylib/jquery/jPlayer/jquery.jplayer.min.js"></script>
		<script type="text/javascript" src="/js/thirdpartylib/jquery/jqGrid/plugins/jquery.transform3d.js"></script>
		<script type="text/javascript" src="/js/thirdpartylib/jquery/jqGrid/plugins/jquery.grab.js"></script>
		<script type="text/javascript" src="/js/thirdpartylib/jquery/jqGrid/plugins/mod.csstransforms.min.js"></script>
		<script type="text/javascript" src="/js/thirdpartylib/jquery/jPlayer/add-on/jplayer.circle.js"></script>
		<!--script type="text/javascript" src="/js/thirdpartylib/id3/binaryajax.js"></script>
		<script type="text/javascript" src="/js/thirdpartylib/id3/id3.js"></script-->
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/base64.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/binaryajax.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/bufferedbinaryajax.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/id3.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/id3v1.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/id3v2.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/id3v2frames.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/id4.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/id3/stringutils.js"></script> 
		<script lang="javascript" type="text/javascript" src="http://sveinbjorn.org/files/code/jsid3/base64.js"></script>
		<script type="text/javascript" src="/js/media/media.js"></script>
	</head>
	<body>
		Welcome <i>Idiots</i> : <%=name %>
		<form action="/ViewUserDetailAction.do" method="post">
			<button type="submit">New UI</button>
		</form>
		<div>
		    <table id="tblTop"></table>
		    <div id="divTopPager"></div>
			<div id="pagernav" style="width: 630px; " class="ui-state-default ui-jqgrid-pager ui-corner-bottom" dir="ltr">
			</div>
	    </div>
		<!-- The jPlayer div must not be hidden. Keep it at the root of the body element to avoid any such problems. -->
		<div id="jquery_jplayer_1" class="cp-jplayer"></div>
		<!-- The container for the interface can go where you want to display it. Show and hide it as you need. -->
		<div id="cp_container_1" class="cp-container">
			<div class="cp-buffer-holder"> <!-- .cp-gt50 only needed when buffer is > than 50% -->
				<div class="cp-buffer-1"></div>
				<div class="cp-buffer-2"></div>
			</div>
			<div class="cp-progress-holder"> <!-- .cp-gt50 only needed when progress is > than 50% -->
				<div class="cp-progress-1"></div>
				<div class="cp-progress-2"></div>
			</div>
			<div class="cp-circle-control"></div>
			<ul class="cp-controls">
				<li><a href="#" class="cp-play" tabindex="1">play</a></li>
				<li><a href="#" class="cp-pause" style="display:none;" tabindex="1">pause</a></li> <!-- Needs the inline style here, or jQuery.show() uses display:inline instead of display:block -->
			</ul>
		</div>
		<form id="showMedia" action="/ViewAndUpdateMediaAction.do" method="post">
			<input type="text" name="mediaId" id="mediaId" />
			<button type="submit">Upload</button>
		</form>
		<form action="/ViewMediaAction.do" method="post">
			<button type="submit">Show Media</button>
		</form>
		<div id="timeval">00:00</div>
		<!--div id="content"></div>
	    <div>
	        <span id="status">Connecting...</span>
	        <input type="text" id="input" disabled="disabled" />
	    </div>
	    <script src="/js/chat-frontend.js"></script-->
	
		<div style="float:left;width:100px;border-right:1px solid black;height:300px;padding:10px;overflow:scroll-y;">
			<b>Available Users</b>
			<div id="rooms"></div>
		</div>
		<div style="float:left;width:300px;height:250px;overflow:scroll-y;padding:10px;">
			<div id="conversation"></div>
			<input id="data" style="width:200px;" />
			<input type="button" id="datasend" value="send" />
		</div>
		
		<div style="float:left;width:300px;height:250px;overflow:scroll-y;padding:10px;">
			
			<p>
				<strong>
					Title: <a id="id3_title"></a>
					<br>
					Artist: <a id="id3_artist"></a>
					<br>
					Album: <a id="id3_album"></a>
				</strong>
			</p>
			<img id="albumcover" width="200" height="200" src="" style="border: 1px solid black;  -webkit-box-reflect:below 5px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0.5, transparent), to(white)); -webkit-transition: opacity 1s linear; visibility: hidden;">
			
			<br>
			<input type="button" onClick="getAlbumArt();" value="send" />
		</div>
		<table id="table1" />
		<table id="table2" />
		<table id="table3" />
		<table id="table4" />
	</body>
</html>