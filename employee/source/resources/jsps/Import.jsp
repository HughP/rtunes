<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/taglibs/jstl/c" prefix="c"%>
<%@page import="com.extjs.commonentity.UserDetail"%>
<%@page import="com.extjs.commonentity.UserSettings"%>

<%@page import="java.util.List"%>

<%@page import="java.util.Iterator"%>
<%@page import="com.extjs.commonentity.Media"%><html>
<head>
<title>Rhushi-Testing</title>
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
<script type="text/javascript" src="/resources/mootools-core.js"></script>
<script type="text/javascript" src="/resources/mootools-more.js"></script>
<script type="text/javascript">
window.addEvent('domready', function(){

	  var container = document.id('container'),  //cache sort container
	    queuedElems = [];            //used to track what elements to swap on click

	  var sorter = new Fx.Sort($$('#container .panel'), {
	    duration: document.id('duration').get('value'),
	    transition: Fx.Transitions[document.id('fxTransition').value][document.id('fxEase').value],
	    mode: 'vertical',
	    onComplete: function(){
	      displayDOM();  // update the UI DOM visual on each sort
	    }
	  });

	  displayDOM();  //update the UI DOM visual on domready

	  //sort based on text of element that was clicked (forward, backward, reverse)
	  $$('.fireSort').addEvent('click', function(event){
	    event.stop();
	    sorter[this.get('text')]();
	  });

	  document.id('order').addEvent('click', function(event){
	    event.stop();
	    alert(sorter.currentOrder);
	  });

	  document.id('reorderDOM').addEvent('click', function(event){
	    event.stop();
	    sorter.rearrangeDOM();
	    displayDOM();  //onComplete isn't fire so update UI DOM visual manually
	  });

	  document.id('mode').addEvent('change', function(){
	    sorter.rearrangeDOM();  //rearrange DOM first so that elements stack properly
	    sorter.options.mode = (this.checked) ? 'vertical' : 'horizontal';
	    container.toggleClass('container');
	    displayDOM();  //onComplete isn't fire so update UI DOM visual manually
	  });

	  document.id('swap').addEvent('click', function(event){
	    event.stop();
	    var elems = container.getChildren();
	    sorter.swap(elems[0], elems[elems.length - 1]);
	  });

	  document.id('sort').addEvent('click', function(event){
	    event.stop();
	    sorter.sort([1, 3, 0, 2, 4]);
	  });

	  $$('#fxTransition, #fxEase').addEvent('change', function(){
	    var transition = document.id('fxTransition').get('value'),
	      easing = document.id('fxEase').get('value');
	    sorter.options.transition = Fx.Transitions[transition][easing];
	  });

	  document.id('duration').addEvent('keyup', function(){
	    sorter.options.duration = this.value.toInt();
	  });

	  //allows users to click on elements to swap their positions
	  $$('.sort').addEvent('click', function(){
	    if (queuedElems.length > 0) sorter.swap(queuedElems.pop(), this);
	    else queuedElems.push(this);
	  });

	  //helper function, displays the DOM visually to see how the sort effects it
	  function displayDOM(){
	    var str = '';
	    container.getChildren().each(function(item){
	      str += '<div style="' + item.style.cssText + '">' + item.get('text') + '</div>\n';
	    });
	    document.id('output').set('text',  str);
	  }
	});
</script>
</head>
<body>
<%
	UserSettings userSettings = (UserSettings) session
			.getAttribute("userSettings");
	String name = userSettings.getFirstName() + " "
			+ userSettings.getLastName();

	List<Media> media = (List<Media>) request.getAttribute("media");
%>
Import :
<%=name%>
<form action="/ImportDirectoryAction.do" method="post">DIR : <input
	type="text" name="directory" title="DIR" />
<button type="submit">Submit</button>
</form>
<iframe id="uploadFrameID" name="uploadFrame" height="0" width="0"
	frameborder="0" scrolling="yes"></iframe>
<div id="container">
<div class="panel1" style="width: 5700px;"><span
	style="width: 300px;">LOCATION</span> <span>MEDIA_ID</span> <span>TITLE</span>
<span>ALBUM</span> <span>YEAR</span> <span>ARTIST</span> <span>COMPOSER</span>
<span>GROUPING</span> <span style="width: 300px;">LYRICS</span> <span>LYRICIST</span>
<span>TRACK_NO</span> <span>GENRE_ID</span> <span>COMMENTS</span> <span>ADDED_BY</span>
<span>UPDATED_BY</span> <span>FILE_ID</span> <span>FILE_LOCATION</span>
<span>PLAY_COUNT</span> <span>TAGS</span> <span>ARTWORK_LOCACTION</span>
<span>ARTWORK_ID</span> <span>LINKS</span> <span>EQUALIZER</span> <span>RATING</span>
<span>CATEGORY</span> <span>File</span> <span>Action</span></div>

<%
		for (Media med : media) {
	%>
<form action="/UploadAction.do" enctype="multipart/form-data"
	method="post" target="uploadFrame">
<div class="panel" style="width: 5400px;"><span class="sort"
	style="width: 300px;"><input name="file" type="file"
	title="FILE" multiple /><%=med.getLocation() %></span> <span class="sort"><input
	name="mediaId" type="text" title="MEDIA_ID"
	value="<%=med.getMediaId() %>" /></span> <span class="sort"><input
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
<button type="submit">Import</button>
</span></div>
</form>
<%
		}
	%>
</div>
<div id="output" style="display: none;"></div>
<select id="fxTransition" style="width: 100px;">
	<option value="linear">Linear</option>
	<option value="Quad">Quadratic</option>
	<option value="Cubic">Cubic</option>
	<option value="Quart">Quartic</option>
	<option value="Quint">Quintic</option>
	<option value="Sine">Sinusoidal</option>
	<option value="Expo">Exponential</option>
	<option value="Circ">Circular</option>
	<option value="Bounce">Bouncing</option>
	<option value="Back" selected="">Back</option>
	<option value="Elastic">Elastic</option>
</select>

<select id="fxEase" style="width: 100px;">
	<option value="easeIn">easeIn</option>
	<option value="easeOut">easeOut</option>
	<option value="easeInOut" selected="">easeInOut</option>
</select>

<label for="duration">duration</label>
<input type="text" id="duration" value="1000" style="width: 60px;" />

<input id="mode" type="checkbox" value="vertical" checked />
<p><a href="#" class="fireSort"
	title="Arrange the items in the original order reversed (...3,2,1,0)">backward</a>
| <a href="#" class="fireSort"
	title="Arrange the items in the original order (0,1,2,3,etc)">forward</a>
| <a href="#" class="fireSort"
	title="Arrange the items in the current order reversed">reverse</a> | <a
	href="#" id="sort"
	title="Rearranges the items visually into a new order">Sort
[1,3,0,2,4]</a> | <a href="#" id="swap"
	title="Swaps the position of one item with another">Swap first and
last child</a> | <a href="#" id="order"
	title="Retrieves the current sort order">Current order</a> | <a
	href="#" id="reorderDOM"
	title="Rearranges the DOM to the current sort order">rearrangeDOM</a></p>
</body>
</html>