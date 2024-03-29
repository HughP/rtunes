<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@page import="com.extjs.commonentity.UserDetail"%>
<%@page import="com.extjs.commonentity.UserSettings"%>
<%@page import="com.extjs.commonentity.Media"%><html>
<%@page import="java.util.List"%>

<head>
	<title>Me-Music Player</title>

	<!--link rel="stylesheet" type="text/css" href="/js/thirdpartylib/jquery/css/smoothness/jquery-ui.css" /-->
	<!--link rel="stylesheet" type="text/css" href="/js/thirdpartylib/jquery/jPlayer/jplayer.blue.monday.css" /-->
	<link href="/js/thirdpartylib/jquery/jPlayer/skin/pink.flag/jplayer.pink.flag.css" rel="stylesheet" type="text/css" />
	<!--link href="/js/thirdpartylib/jquery/jPlayer/skin/blue.monday/jplayer.blue.monday.css" rel="stylesheet" type="text/css" /-->
	<script type="text/javascript" src="/js/thirdpartylib/jquery/js/jquery.min.js"></script>
    <!--script type="text/javascript" src="/js/thirdpartylib/jquery/js/jquery-ui-1.8.19.custom.min.js"></script-->
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js"></script>
	<script type="text/javascript" src="/js/thirdpartylib/jquery/jPlayer/jquery.jplayer.min.js"></script>
	<script type="text/javascript" src="/js/thirdpartylib/jquery/jPlayer/add-on/jplayer.playlist.min.js"></script>
	<%
    	UserSettings userSettings = (UserSettings) session.getAttribute( "userSettings");
		String name = userSettings.getFirstName() + " " + userSettings.getLastName();
	%>
	<script type="text/javascript">
		//<![CDATA[
		$(document).ready(function(){
			new jPlayerPlaylist({
		
				jPlayer: "#jquery_jplayer_1",
		
				cssSelectorAncestor: "#jp_container_1"
		
			}, [
		<%	
			List<Media> media = (List<Media>) request.getAttribute("media");
			Integer count = 0;
			for(Media med : media){
				String title = med.getTitle();
		        String album = med.getAlbum();
		        String artist = med.getArtist();
		        String lyrics = med.getLyrics();
		        Integer mediaId = med.getMediaId();
		%>
					{
						title:"<%= title %>",
						artist:"<%= artist %>",
						album:"<%= album %>",
						//free:true,
						mp3:"/GetMediaByIdAction.do?mediaId=<%= mediaId %>",
						poster: "/images/poster.png"
		<%
				count = count + 1; 
				if(count < media.size()){
		%>	
					},
		<%
				}else{
		%>
					}
		<%
				}
			}
		%>
			], {
		
				swfPath: "/js/thirdpartylib/jquery/jPlayer",
				enableRemoveControls:false,
				//supplied: "webmv, ogv, m4v, oga, mp3"
				supplied: "webmv, ogv, mp3"
		
			});
		
		});
		
		//]]>
	</script>
</head>
<body>
Landed Player User:
<%=name %>
<div id="jp_container_1" class="jp-video jp-video-270p">

			<div class="jp-type-playlist">

				<div id="jquery_jplayer_1" class="jp-jplayer"></div>

				<div class="jp-gui">

					<div class="jp-video-play">

						<a href="javascript:;" class="jp-video-play-icon" tabindex="1">play</a>

					</div>

					<div class="jp-interface">

						<div class="jp-progress">

							<div class="jp-seek-bar">

								<div class="jp-play-bar"></div>

							</div>

						</div>

						<div class="jp-current-time"></div>

						<div class="jp-duration"></div>

						<div class="jp-title">

							<ul>

								<li></li>

							</ul>

						</div>

						<div class="jp-controls-holder">

							<ul class="jp-controls">

								<li><a href="javascript:;" class="jp-previous" tabindex="1">previous</a></li>

								<li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li>

								<li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li>

								<li><a href="javascript:;" class="jp-next" tabindex="1">next</a></li>

								<li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li>

								<li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li>

								<li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li>

								<li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li>

							</ul>

							<div class="jp-volume-bar">

								<div class="jp-volume-bar-value"></div>

							</div>

							<ul class="jp-toggles">

								<li><a href="javascript:;" class="jp-full-screen" tabindex="1" title="full screen">full screen</a></li>

								<li><a href="javascript:;" class="jp-restore-screen" tabindex="1" title="restore screen">restore screen</a></li>

								<li><a href="javascript:;" class="jp-shuffle" tabindex="1" title="shuffle">shuffle</a></li>

								<li><a href="javascript:;" class="jp-shuffle-off" tabindex="1" title="shuffle off">shuffle off</a></li>

								<li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li>

								<li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li>

							</ul>

						</div>

					</div>

				</div>

				<div class="jp-playlist">

					<ul>

						<!-- The method Playlist.displayPlaylist() uses this unordered list -->

						<li></li>

					</ul>

				</div>

				<div class="jp-no-solution">

					<span>Update Required</span>

					To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.

				</div>

			</div>

		</div>
<form action="/ViewUploadAction.do" method="post">
	<button type="submit">Upload</button>
</form>
</body>
</html>