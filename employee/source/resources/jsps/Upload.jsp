<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/taglibs/jstl/c" prefix="c"%>
<%@page import="com.extjs.commonentity.UserDetail"%>
<%@page import="com.extjs.commonentity.UserSettings"%>

<%@page import="com.extjs.commonentity.Media"%>
<%@page import="sun.org.mozilla.javascript.internal.Undefined"%><html>
<%
	UserSettings userSettings = (UserSettings) session.getAttribute("userSettings");
	String name = userSettings.getFirstName() + " " + userSettings.getLastName();
	Media med = (Media) request.getAttribute("media");
%>
	<head>
		<title>Rhushi-Upload</title>
		<link rel="stylesheet" type="text/css" href="/css/form.css" />
		<script type="text/javascript" src="/js/thirdpartylib/jquery/jqGrid/js/jquery.min.js"></script>
		<script type="text/javascript" src="/js/thirdpartylib/jquery/jqTools/jquery.tools.min.js"></script>
		<style type="text/css">
			.container .sort {
				display: inline-block;
			}
			
			.sort {
				border: 0px solid #333;
				color: #000;
				cursor: pointer;
				width: 100px;
			}
			
			.panel1 span {
				width: 200px;
				display: inline-block;
			}
			
			.panel span {
				width: 200px;
				display: inline-block;
			}
		</style>
	</head>
	<body>
	Welcome : <%=name%>
	<form action="/UploadAction.do" enctype="multipart/form-data"
		method="post">
		<div class="panel" style="width: 5400px;">
			<span class="sort">
				<input name="file" type="file" id="txtFile" title="FILE" /> 
			</span>
			<span class="sort">
				<button type="submit">Import</button>
			</span>
		</div>
	</form>
	<!--div class="panel1" style="width: 5700px;"><span>MEDIA_ID</span> <span>TITLE</span>
		<span>ALBUM</span> <span>YEAR</span> <span>ARTIST</span> <span>COMPOSER</span>
		<span>GROUPING</span> <span>LYRICS</span> <span>LYRICIST</span> <span>TRACK_NO</span>
		<span>GENRE_ID</span> <span>COMMENTS</span> <span>ADDED_BY</span> <span>UPDATED_BY</span>
		<span>FILE_ID</span> <span>FILE_LOCATION</span> <span>PLAY_COUNT</span>
		<span>TAGS</span> <span>ARTWORK_LOCACTION</span> <span>ARTWORK_ID</span>
		<span>LINKS</span> <span>EQUALIZER</span> <span>RATING</span> <span>CATEGORY</span>
		<span>File</span> <span>Action</span>
	</div>
	
	
	<form action="/UpdateAction.do" enctype="multipart/form-data" method="post">
		<div class="panel" style="width: 5400px;">
			<span class="sort"><input
			name="mediaId" type="text" title="MEDIA_ID"
			value="S<%=med.getMediaId() %>" /></span> <span class="sort"><input
			name="title" type="text" title="TITLE" value="<%=med.getTitle() %>" /></span>
			<span class="sort"><input name="album" type="text" title="ALBUM"
			value="<%=med.getAlbum() %>" /></span> <span class="sort"><input
			name="year" type="text" title="YEAR" value="<%=med.getYear() %>" /></span> <span
			class="sort"><input name="artist" type="text" title="ARTIST"
			value="<%=med.getArtist() %>" /></span> <span class="sort"><input
			name="composer" type="text" title="COMPOSER"
			value="<%=med.getComposer() %>" /></span> <span class="sort"><input
			name="grouping" type="text" title="GROUPING"
			value="<%=med.getGrouping() %>" /></span> <span class="sort"
			style="width: 300px;"><textarea style="" name="lyrics"
			title="LYRICS"><%=med.getLyrics() %></textarea></span> <span class="sort"><input
			name="lyricist" type="text" title="LYRICIST"
			value="<%=med.getLyricist() %>" /></span> <span class="sort"><input
			name="trackNo" type="text" title="TRACK_NO"
			value="<%=med.getTrackNo() %>" /></span> <span class="sort"><input
			name="genreId" type="text" title="GENRE_ID"
			value="<%=med.getGenreId() %>" /></span> <span class="sort"><input
			name="comments" type="text" title="COMMENTS"
			value="<%=med.getComments() %>" /></span> <span class="sort"><input
			name="addedBy" type="text" title="ADDED_BY"
			value="<%=med.getAddedBy() %>" /></span> <span class="sort"><input
			name="updatedBy" type="text" title="UPDATED_BY"
			value="<%=med.getUpdatedBy() %>" /></span> <span class="sort"><input
			name="fileId" type="text" title="FILE_ID" value="<%=med.getFileId() %>" /></span>
			<span class="sort"><input name="fileLocation" type="text"
			title="FILE_LOCATION" value="<%=med.getFileLocation() %>" /></span> <span
			class="sort"><input name="playCount" type="text"
			title="PLAY_COUNT" value="<%=med.getPlayCount() %>" /></span> <span
			class="sort"><input name="tags" type="text" title="TAGS"
			value="<%=med.getTags() %>" /></span> <span class="sort"><input
			name="artworkLocaction" type="text" title="ARTWORK_LOCACTION"
			value="<%=med.getArtworkLocaction() %>" /></span> <span class="sort"><input
			name="artworkId" type="text" title="ARTWORK_ID"
			value="<%=med.getArtworkId() %>" /></span> <span class="sort"><input
			name="links" type="text" title="LINKS" value="<%=med.getLinks() %>" /></span>
			<span class="sort"><input name="equalizer" type="text"
			title="EQUALIZER" value="<%=med.getEqualizer() %>" /></span> <span
			class="sort"><input name="rating" type="text" title="RATING"
			value="<%=med.getRating() %>" /></span> <span class="sort"><input
			name="category" type="text" title="CATEGORY"
			value="<%=med.getCategory() %>" /></span> <span class="sort">
			<button type="submit">Update</button>
			</span>
		</div>
	</form-->
	<div id="initializing" style="visibility: hidden; position: absolute; top: 100px;">
		<table width="100%" style="border: 1px; background-color: black;">
			<tr>
				<td>
				<table width="100%"
					style="border: 1px; background-color: black; color: white;">
					<tr>
						<td align="center"><b>Initializing Upload...</b></td>
					</tr>
				</table>
				</td>
			</tr>
		</table>
	</div>
	
	<div id="progressBarTable" style="visibility: hidden; position: absolute; top: 100px;">
		<table width="100%" style="border: 1px; color: white;">
			<tr>
				<td>
				<table id="progressBar" width="100%">
					<tr>
						<td>&nbsp;</td>
					</tr>
				</table>
				</td>
			</tr>
		</table>
		<table width="100%" style="background-color: white; color: black;">
			<tr>
				<td align="center" nowrap="nowrap"><span id="bytesRead"
					style="font-weight: bold;">&nbsp;</span></td>
			</tr>
		</table>
	</div>
	
	<div id="percentCompleteTable" align="center" style="visibility: hidden; position: absolute; top: 100px;">
		<table width="100%" style="border: 1px;">
			<tr>
				<td>
				<table width="100%" style="border: 1px;">
					<tr>
						<td align="center" width="100%"><span id="percentComplete"
							style="color: blue; font-weight: bold; width: 100%">&nbsp;</span></td>
					</tr>
				</table>
				</td>
			</tr>
		</table>
	</div>
	
	
	
	
	<form action="/UpdateAction.do" id="myform" class="cols" method="post">
		<h3>Update Media : <%=med.getTitle() %></h3>
		<fieldset>
			<label> Title * <input type="text" name="title" required="required" value="<%=med.getTitle() %>"/> </label>
			<label> Album * <input type="text" name="album" required="required" value="<%=med.getAlbum() %>"/> </label>
			<label> Artist * <input type="text" name="artist" required="required" value="<%=med.getArtist() %>"/> </label>
			<label> Director * <input type="text" name="albumArtist" required="required" value="<%=med.getArtist() %>"/> </label>
			<label> Producer * <input type="text" name="producer" value="<%=med.getArtist() %>"/> </label>
			<label> Year <input type="text" name="year" value="<%=med.getYear() %>"/> </label>
			<label> Banner / Distributer  <input type="text" name="banner" value="<%=med.getBanner() %>"/> </label>
			<label> Composer * <input type="text" name="composer" value="<%=med.getComposer() %>"/> </label>
			<label> Grouping * <input type="text" name="grouping" value="<%=med.getGrouping() %>"/> </label>
			<label> Track No * <input type="text" name="trackNo" value="<%=med.getTrackNo() %>"/> </label>
			<label> Genre Id * <input type="text" name="genreId" value="<%=med.getGenreId() %>"/> </label>
			<label> Comments * <input type="text" name="comments" value="<%=med.getComments() %>"/> </label>
			<label> Added by * <input type="text" name="addedBy" value="<%=med.getAddedBy() %>"/> </label>
			<label> Updated By * <input type="text" name="updatedBy" value="<%=med.getUpdatedBy() %>"/> </label>
			<label> File Id * <input type="text" name="fileId" required="required" value="<%=med.getFileId() %>"/> </label>
			<label> File Location * <input type="text" name="fileLocation" value="<%=med.getFileLocation() %>"/> </label>
			<label> Plays * <input type="text" name="playCount" value="<%=med.getPlayCount() %>"/> </label>
			<label> Tags <input type="text" name="tags" value="<%=med.getTags() %>"/> </label>
			<label> Artwork Location * <input type="text" name="artworkLocaction" value="<%=med.getArtworkLocaction() %>"/> </label>
			<label> Artwork Id * <input type="text" name="artworkId" value="<%=med.getArtworkId() %>"/> </label>
			<label> Links * <input type="url" name="links" value="<%=med.getLinks() %>"/> </label>
			<label> Equalizer * <input type="text" name="equalizer" value="<%=med.getEqualizer() %>"/> </label>
			<label> Rating * <input type="text" name="rating" value="<%=med.getRating() %>"/> </label>
			<label> Category * <input type="text" name="category" required="required" value="<%=med.getCategory() %>"/> </label>
			<label> Media Id * <input type="text" name="mediaId" required="required" value="<%=med.getMediaId() %>"/> </label>
		</fieldset>
		<fieldset>
			<label> Lyricist  <input type="text" name="lyricist" required="required" value="<%=med.getLyricist() %>"/> </label>
			<label> Lyrics <div><%=med.getLyrics() %></div> </label>
		</fieldset>
		<div class="clear"></div>
		<button type="submit">Submit form</button>
	</form>
</body>
</html>
<!--label> website * <input type="url" required="required" /> </label>
<label> age <input type="number" name="age" size="4" maxlength="3" /> </label>
<label> time <input type="time" name="time" maxlength="8" /> </label-->