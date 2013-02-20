Ext.require([
    'Ext.slider.*', 
    'Ext.form.*',
    'Ext.window.Window',
    'Ext.window.MessageBox',
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.util.*'//,
    //'Ext.ux.data.PagingMemoryProxy',
    //'Ext.toolbar.Paging',
    //'Ext.ux.SlidingPager'
]);

Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime()+(1000*60*60*24*7)), //7 days from now
}));
var localSongIndex = 0;
var userPlayList = "";
var currentSong = "";
var playerContext = "ITUNES";
var imageSearch;
var imageCount =0;
var playerHtmlTemplate = 
	"<div id='jp_container_1' class='jp-video jp-video-270p'>" +
		"<div class='jp-type-playlist'>" +
			"<div id='jquery_jplayer_1' class='jp-jplayer'></div>" +
			"<div class='jp-gui'>" +
				"<div class='jp-video-play'>" +
					"<a href='javascript:;' class='jp-video-play-icon' tabindex='1'>play</a>" +
				"</div>" +
				"<div class='jp-interface'>" +
					"<div class='jp-controls-holder'>" +
		        		"<ul class='jp-controls'>" +
			        		"<li><a href='javascript:;' class='jp-previous' tabindex='1'>previous</a></li>" +
			        		"<li><a href='javascript:;' class='jp-play' tabindex='1'>play</a></li>" +
			        		"<li><a href='javascript:;' class='jp-pause' tabindex='1'>pause</a></li>" +
			        		"<li><a href='javascript:;' class='jp-next' tabindex='1'>next</a></li>" +
			        		"<!--li><a href='javascript:;' class='jp-stop' tabindex='1'>stop</a></li-->" +
			        		"<li><a href='javascript:;' class='jp-mute' tabindex='1' title='mute'>mute</a></li>" +
			        		"<li><a href='javascript:;' class='jp-unmute' tabindex='1' title='unmute'>unmute</a></li>" +
			        		"<div class='jp-volume-bar'><div class='jp-volume-bar-value'></div></div>" +
			        		"<li><a href='javascript:;' class='jp-volume-max' tabindex='1' title='max volume'>max volume</a></li>" +
		        		"</ul>" +
		        		"<ul>" +
		        		"</ul>" +
		        		"<ul class='jp-toggles'>" +
		        			"<!--li><a href='javascript:;' class='jp-full-screen' tabindex='1' title='full screen'>full screen</a></li>" +
			        		"<li><a href='javascript:;' class='jp-restore-screen' tabindex='1' title='restore screen'>restore screen</a></li-->" +
			        		"<!--li><a href='javascript:;' class='jp-shuffle' tabindex='1' title='shuffle'>shuffle</a></li>" +
			        		"<li><a href='javascript:;' class='jp-shuffle-off' tabindex='1' title='shuffle off'>shuffle off</a></li>" +
			        		"<li><a href='javascript:;' class='jp-repeat' tabindex='1' title='repeat'>repeat</a></li>" +
			        		"<li><a href='javascript:;' class='jp-repeat-off' tabindex='1' title='repeat off'>repeat off</a></li-->" +
			        	"</ul>" +
			        "</div>" +
					"<div class='song-detail'>" +
						"<div id='jp-track-status' class='jp-track-status'></div>" +
						"<div class=''>" +
							"<div class='jp-current-time'></div>" +
							"<div class='jp-duration'></div>" +
							"<div class='jp-progress'>" +
								"<div class='jp-seek-bar'>" +
									"<div class='jp-play-bar'></div>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
	        	"</div>" +
	       	"</div>" +
	       	"<div class='jp-no-solution'>" +
	       		"<span>Update Required</span>To play the media you will need to either update your browser to a recent version or update your <a href='http://get.adobe.com/flashplayer/' target='_blank'>Flash plugin</a>" +
	       	"</div>" +
		  "</div>" +
	  "</div>";

var plySong = function(trackNo, playlist){
	var cmd = "trackLocation " + trackNo + " " + playlist;
	var playerCmp = Ext.getCmp('rTunes-player');
	rTunesJQPlayer.setPlaylist([{
		mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
	}]);
	rTunesJQPlayer.play(0);
	playerCmp.updateStatus(trackNo, playlist);
	//var player = ;
};

var plyNextSong = function(reverse){
	playerContext = "SYSTEM_PLAYLIST";
	if(reverse){
		localSongIndex--;
	}else{
		localSongIndex++;
	}
	var str = Ext.data.StoreManager.lookup('tracksStore');
	var rec = str.getAt(localSongIndex);
	if(!rec){
		localSongIndex = 1;
	}
	var cmd = "trackLocation " + localSongIndex + " " + userPlayList;
	var playerCmp = Ext.getCmp('rTunes-player');
	rTunesJQPlayer.setPlaylist([{
		mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
	}]);
	rTunesJQPlayer.play(0);
	playerCmp.updateStatus();
};

var plyUserNextSong = function(reverse){
	playerContext = "USER_PLAYLIST";
	var plgrd = Ext.getCmp('user-playlist-grid');
	var recIn = plgrd.recIn + 1;
	if(reverse){
		recIn = plgrd.recIn - 1;
	}
	var plStore = Ext.data.StoreManager.lookup('user-playlist-store');
	var rec = plStore.getAt(recIn);
	if(!rec){
		recIn = 0;
		rec = plStore.getAt(recIn);
	}
	var cmd = "trackLocation " + rec.data.id + " " + rec.data.component;
	plgrd.songId = rec.data.id;
	userPlayList = rec.data.component;
	var playerCmp = Ext.getCmp('rTunes-player');
	rTunesJQPlayer.setPlaylist([{
		mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
	}]);
	rTunesJQPlayer.play(0);
	playerCmp.updateStatus();
	plgrd.recIn = recIn;
	plgrd.getSelectionModel().select(recIn);
};

Ext.define('rTunes.App', {
    extend: 'Ext.container.Viewport',
    playOnSelection:false,
    currentPlaylist : '',
    playLocally:true,
    inSyncWithItunes:true,
    initComponent: function(){
		var me = this;
		
		Ext.define('rTunesModel', {
		    extend: 'Ext.data.Model',
		    fields: ['id', 'album', 'name', 'component']
		});
		
		Ext.define('TrackInfo', {
		    extend: 'Ext.data.Model',
		    fields: ['id', 'title', 'artist', 'album', 'albumartist', 'lyrics', 'year', 'component']
		});

		this.cont = Ext.create('Ext.panel.Panel',{
			height:250,
			border:false,
			region:'south',
			cls:'rtunes-console',
			id:'rtunes-chat-cntainer',
			title:'Chat...',//' <i>in Progress</i>',
			split:true,
			autoScroll:true,
			collapsible:true,
			stateful:true,
			collapsed:false,
			tbar:[{
				xtype:'displayfield',
				value:'Use ">" as type message to dedicate song on chat...'
			}],
			bbar:[{
				xtype	: 	'textfield',
				id 		: 	'rtunes-chat-data',
				name 	: 	'data',
				enableKeyEvents:true,
				listeners	: 	{
					scope 	: 	me,
					'keypress':	function(field,e){
						var key = e.getKey();
						if(key === e.ENTER){
							var message = Ext.getCmp('rtunes-chat-data');
							doSendMessage(message.getValue());
							message.setValue('');
						}
					}
				},
				width	: 	'80%',
				emptyText: 	'Type your message...'
			},{
				xtype	: 	'button',
				id 		: 	'datasend',
				text 	: 	'Send',
				handler	: 	function(){
					var message = Ext.getCmp('rtunes-chat-data');
					doSendMessage(message.getValue());
					message.setValue('');
				}
			}],
			html:'<div><div id="rooms"></div></div><div id="conversation"></div></div>'
			//html:'<span class="value"><b>Added Special 26 : Check Recently Added songs playlist. </b>For bugs / feature request please use <a href="http://code.google.com/p/rtunes/issues" target="_blank"> rTunes </a> Non HTML5 browser support added & Coming up next Play in sync with iTunes....</span>'
		});

		me.player = Ext.create('Ext.panel.Panel',{
			id:'rTunes-player',
			cls:'rtunes-player',
			region:'north',
			split:true,
			border:false,
			height:360,
			autoScroll:true,
			frame:false,
			padding:'5',
			updateStatus:function(trackNo, playlist){
				me.updateStatus(trackNo, playlist);
			},
			html:''
		});
		
		
		this.search = Ext.create('Ext.form.TextField',{
			flex:2,
			border:false,
			enableKeyEvents:true,
			listeners	: 	{
				scope 	: 	me,
				'keypress':	function(field,e){
					var key = e.getKey();
					if(key === e.ENTER){
						me.doSearch();
					}
				}
			},
			emptyText:"Search Song Title / Album /Artist  ...(Rhushiraj Patil's Library)",
    		value:''
    	});
		
		/*
		this.status = Ext.create('Ext.form.DisplayField',{
			fieldLabel : '',
			flex:2,
			hidden:true,
			labelAlign:'right',
    		value:''
    	});
		*/
		this.userPlaylistStore = Ext.create('Ext.data.Store', {
			storeId: 'user-playlist-store',
	        model: 'rTunesModel'
	    });

	    //var plRecs = [];
		try{
			plRecs = rt.cookies.get('userPlaylist');
			plRecs = plRecs.split('`');
			for (var i = plRecs.length - 1; i >= 0; i--) {
				var recStr = Ext.decode(plRecs[i]);
				var model = Ext.create('rTunesModel', recStr);
				me.userPlaylistStore.add(model);
				model.commit()
			};
			//this.userPlaylistStore.loadData(plRecs);
		}catch(e){}
	    // create the destination Grid
	    this.userPlaylistGrid = Ext.create('Ext.grid.Panel', {
	    	region:'center',
	    	frame:false,
	    	border:false,
	    	//width:300,
	    	cls:'rtunes-userplaylist-grid',
	    	id:'user-playlist-grid',
	    	recIn  : 0,
	    	multiSelect: true,
	    	forceFit:true,
	    	hideHeaders:true,
	    	bbar:['->', {
				xtype:'button',
				//width:160,
				checked:false,
				handler: function(chkBox, newValue, oldValue, eOpts ){
					//me.playOnSelection = newValue;
	    			var selModel = me.userPlaylistGrid.getSelectionModel();
	    			var rec = selModel.getSelection();
	    			if(rec && rec[0] && rec[0].data){
	    				var dataObj = rec[0].data;
	    				var index = me.userPlaylistStore.find('name', dataObj.name.trim());
	    				me.userPlaylistGrid.recIn = index + 1;
	    				me.userPlaylistGrid.songId = dataObj.id;
	    				playerContext = "USER_PLAYLIST";
	    				var cmd = "trackLocation " + dataObj.id + " " + dataObj.component;
						//me.player.update('<audio autoplay="false" controls="controls" onended="javascript:plyUserNextSong();"><source src="'+appBaseUrl+'?userName='+userName+'&command='+ cmd +'" />Your browser does not support the audio element.</audio>');
	    				rTunesJQPlayer.setPlaylist([{
							mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
						}]);
						rTunesJQPlayer.play(0);
						me.updateStatus();
	    			}
				},
				text:'Play'
			},{
				xtype:'button',
				//width:160,
				checked:false,
				handler: function(chkBox, newValue, oldValue, eOpts ){
					//me.playOnSelection = newValue;
				},
				text:'Stop'
			},{
				xtype:'button',
				//width:160,
				checked:false,
				handler: function(chkBox, newValue, oldValue, eOpts ){
					var selModel = me.userPlaylistGrid.getSelectionModel();
	    			var recs = selModel.getSelection();
	    			try{
	    				if(recs && recs.length > 0){
	    					me.msg("Songs removed from Playlist", recs.length + "songs removed...!");
	    					me.userPlaylistStore.remove(recs);
	    				}
	    			}catch(e){
	    				//
	    			}
				},
				text:'Remove Selected...'
			}],
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'firstGridDDGroup',
	                dropGroup: 'firstGridDDGroup'
	            },
	            listeners: {
	            	itemdblclick :	function( gridView, record, item, index, e, eOpts ){
	            		playerContext = "USER_PLAYLIST";
	            		me.inSyncWithItunes = false;
	    				var dataObj = record.data;
	    				var index = me.userPlaylistStore.find('name', dataObj.name.trim());
	    				var cmd = "trackLocation " + dataObj.id + " " + dataObj.component;
	    				userPlayList = dataObj.component;
	    				me.userPlaylistGrid.recIn = index;
	    				me.userPlaylistGrid.songId = dataObj.id;
	    				//me.player.update('<audio autoplay="false" controls="controls" onended="javascript:plyUserNextSong();"><source src="'+appBaseUrl+'?userName='+userName+'&command='+ cmd +'" />Your browser does not support the audio element.</audio>');
	    				rTunesJQPlayer.setPlaylist([{
							mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
						}]);
						rTunesJQPlayer.play(0);
						me.updateStatus();
					},
	                drop: function(node, data, dropRec, dropPosition) {
	                	var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty playlist';
	                    me.msg("Song added to playlist", 'Added ' + data.records[0].get('name') + dropOn);
	                    if(me.userPlaylistStore.count() > 0){
	                    	var plString = new Array();
	                    	me.userPlaylistStore.each(function(record){
	                    		var rec = record.data;
	                    		plString.push('{"name": "' + rec.name + '", "id":"' + rec.id + '", "component":"' + rec.component +'"}');
	                    	});
	                    	rt.cookies.set('userPlaylist', plString.join("`"), 7, '/', '', '' );
	                	}
	                }
	            }
	        },
	        store            : me.userPlaylistStore,
	        columns          : [{ 
							    	text: 'ID',
							    	hidden:true,
							    	dataIndex: 'id'
							    }, { 
							    	text: 'Name',
							    	align:'right', 
							    	dataIndex: 'name'
							    }, { 
							    	text: 'Component',
							    	hidden:true,
							    	dataIndex: 'component',
							    	renderer:function(value){
							        	return value.replace(/\^/gi, " ");
							        }
							    }],
	        stripeRows       : true
	    });
	    
		me.playlistStore = Ext.create('Ext.data.ArrayStore', {
		    // store configs
		    autoDestroy: true,
		    storeId: 'myStore',
		    // reader configs
		    idIndex: 0,
		    fields: ['name']
		});
		
		me.searchStore = Ext.create('Ext.data.ArrayStore', {
		    autoDestroy: true,
		    idIndex: 0,
		    fields: ['name']
		});
		
		me.tracksStore = Ext.create('Ext.data.Store', {
	        storeId: 'tracksStore',
	        model: 'rTunesModel',
	        //groupField: 'album',
	        pageSize: 10
	    });
		
		me.searchGrid = Ext.create('Ext.grid.Panel', {
			store : me.searchStore,
			title: 'Search',
			region:'north',
			hidden:true,
			cls:'rtunes-search-grid',
			split:true,
			border:false,
			collapsible:true,
			stateful:true,
			height:170,
			showLines:false,
		    forceFit:true,
		    tbar:[{
				xtype:'textfield',
				id:'rtunes-property',
				emptyText :'Property'
			},{
				xtype:'textfield',
				id:'rtunes-replace',
				emptyText :'Search string',
				enableKeyEvents:true,
				listeners	: 	{
					scope 	: 	me,
					'keyup':	function(field,e){
						var key = e.getKey();
						if(key === e.ENTER){
							var val = field.getValue();
							var property = Ext.getCmp('rtunes-property').getValue();
							if(val && val !== "" && property && property !== ""){
								Ext.Ajax.request({
									url: appBaseUrl+'?userName='+userName+'&command=propertysearch Music ' + property.trim().replace(/\s/gi, "^") + " " + val.trim().replace(/\s/gi, "^"),
									method: 'GET',
									success: function(response){
										me.searchStore.removeAll();
										response.responseText = response.responseText.replace(/\[H|\[2J/gi, "");
										var resp = response.responseText.split(",");
										for(var i=0; i < resp.length; i++){
											var model = Ext.create('rTunesModel', {
												name : resp[i].trim(),
												id	 :	i + 1
											});
											me.searchStore.add(model);
										}
									},
									failure: function(resp){
									}
								});
							}
						}
					}
				}
			},{
				xtype:'textfield',
				id:'rtunes-replace-str',
				emptyText :'Replace with'
			},{
				xtype:'button',
				text:'Load',
				enableKeyEvents:true,
				handler:function(){
					var val = Ext.getCmp('rtunes-replace').getValue();
					var property = Ext.getCmp('rtunes-property').getValue();
					if(val && val !== "" && property && property !== ""){
						Ext.Ajax.request({
							url: appBaseUrl+'?userName='+userName+'&command=propertysearch Music ' + property.trim().replace(/\s/gi, "^") + " " + val.trim().replace(/\s/gi, "^"),
							method: 'GET',
							success: function(response){
								me.searchStore.removeAll();
								response.responseText = response.responseText.replace(/\[H|\[2J/gi, "");
								var resp = response.responseText.split(",");
								for(var i=0; i < resp.length; i++){
									var model = Ext.create('rTunesModel', {
										name : resp[i].trim(),
										id	 :	i + 1
									});
									me.searchStore.add(model);
								}
							},
							failure: function(resp){
							}
						});
					}
				}
			},{
				xtype:'button',
				text:'Replace',
				enableKeyEvents:true,
				handler:function(){
					var val = Ext.getCmp('rtunes-replace').getValue();
					var property = Ext.getCmp('rtunes-property').getValue();
					if(val && val !== "" && property && property !== ""){
						me.searchStore.each(function(rec){
							var data = rec.data;
							//if(a==1){
								var newName = data.name.trim().replace(val, "");
								Ext.Ajax.request({
									url: appBaseUrl+'?userName='+userName+'&command=update ' +property.trim().replace(/\s/gi, "^") + ' ' + data.id + ' rtunes ' + newName.trim().replace(/\s/gi, "^"),
									method: 'GET',
									success: function(response){
										//
									},
									failure: function(resp){
									}
								});
						}, this);
					}
				}
			}],
			hideHeaders:false,
			border:false,
		    columns: [{ 
		    	text: 'Name', 
		    	dataIndex: 'name'
		    }]
		});

		me.playlistsGrid = Ext.create('Ext.grid.Panel', {
			store : me.playlistStore,
			title: 'Playlists',
			region:'west',
			cls:'rtunes-playlist-grid',
			split:true,
			border:false,
			collapsible:true,
			stateful:true,
			width:170,
			showLines:false,
		    forceFit:true,
		    listeners:{
				itemclick:	function(gridView, record, item, index, e, eOpts){
					var grid = Ext.getCmp('rtunes-tracks-grid');
					var myMask = new Ext.LoadMask(Ext.getBody(), {
						msg:"Please wait..."
					});
					myMask.show();
					me.currentPlaylist = record.data.name;
					me.loadPlaylist(me.currentPlaylist, function(){
						myMask.hide();
						myMask.destroy();
					});
				},
				itemdblclick:	function( gridView, record, item, index, e, eOpts ){
					me.currentPlaylist = record.data.name;
					var cmd = "webplaylist " + me.currentPlaylist.trim().replace(/\s/gi, "^") + " play";
					me.rTunesCall({
						command		:	cmd,
						updateStatus:	true,
						success		: 	function(response){
							me.updateStatus();
						},
						failure		: 	function(resp){
							me.cont.update(resp.responseText);
						}
					});
				}
			},
			hideHeaders:true,
			bbar:[{
				xtype:'textfield',
				emptyText:'Filter Playlist...',
				enableKeyEvents:true,
				listeners	: 	{
					scope 	: 	me,
					'keyup':	function(field,e){
						var val = field.getValue();
						if(val && val !== ""){
							me.playlistStore.filter("name", val);
						}else{
							me.playlistStore.clearFilter();
						}
					},
					'keypress':	function(field,e){
						var val = field.getValue();
						if(val && val !== ""){
							me.playlistStore.filter("name", val);
						}else{
							me.playlistStore.clearFilter();
						}
					}
				},
				value:''
			}],
			border:false,
		    columns: [{ 
		    	text: 'Name', 
		    	dataIndex: 'name'
		    }]
		});
		
		me.lyrics = Ext.create('Ext.form.Panel',{
			//title: 'Track Information',
			region:'center',
			cls:'rtunes-track-info',
			padding:'10 10 10 10',
			border:false,
			bbar:[{
				xtype:'button',
				text:'Edit',
				handler:function(){
					var filterString = ["<unknown>", "unknown", "artist", "www", "songspk", "songs.pk", "www.songs.pk", "track"];
					var isDisabled = function(value){
						var retVal = true;
						try{
							if(playerContext === "USER_PLAYLIST" || playerContext === "SYSTEM_PLAYLIST"){
								var recVal = me.lyrics.data[value].toLowerCase();
								if(recVal === ""){
									return false;
								}
								for (var i = filterString.length - 1; i >= 0; i--) {
									retVal = recVal.indexOf(filterString[i]) !== -1;
									if(retVal){
										return false;
									}
								};
							}
							return true;
						}catch(e){
							return true;
						}
					};
					var trackFrm = Ext.create('Ext.form.Panel',{
							defaults:{
								xtype:'textfield',
								labelAlign:'right',
								width:500
							},
							items:[{
								fieldLabel:'Title',
								name:'title',
								emptyText:"Enter Title",
								disabled : isDisabled('title'),
								value: me.lyrics.data.title
							},{
								fieldLabel:'Artist',
								name:'artist',
								emptyText:"Enter Artist",
								disabled : isDisabled('artist'),
								value:me.lyrics.data.artist
							},{
								fieldLabel:'Album Artist',
								name:'album^artist',
								emptyText:"Enter Director / Album Artist",
								disabled : isDisabled('albumartist'),
								value:me.lyrics.data.albumartist
							},{
								fieldLabel:'Album',
								name:'album',
								emptyText:"Enter Album",
								disabled : isDisabled('album'),
								value:me.lyrics.data.album
							},{
								fieldLabel:'Actors',
								name:'grouping',
								emptyText:"Enter Actors performed by...",
								disabled : isDisabled('grouping'),
								value:me.lyrics.data.grouping
							},{
								fieldLabel:'Year',
								name:'year',
								emptyText:"Year Released",
								value:me.lyrics.data.year
							},{
								fieldLabel:'Composer',
								name:'composer',
								emptyText:"Enter Composer",
								disabled : isDisabled('composer'),
								value:me.lyrics.data.composer
							},{
								xtype:'textarea',
								name:'lyrics',
								fieldLabel:'Lyrics',
								height:200,
								emptyText:"Enter lyrics",
								//disabled : isDisabled('lyrics'),
								value:me.lyrics.data.lyrics
							}]
					});
					var win = Ext.create('Ext.window.Window', {
						title:'Edit Track Meta...!!',
						modal:true,
						autoShow:false,
						playerContext:playerContext,
						localSongIndex:localSongIndex,
						userPlayList:userPlayList,
						buttons:[{
							text: 'Submit',
							handler : function(){
								var prperties = ["title", "artist", "year", "album^artist", "album", "grouping", "composer", "lyrics"];
								var values = trackFrm.getForm().getValues();
								if(win.playerContext === "USER_PLAYLIST" || win.playerContext === "SYSTEM_PLAYLIST"){
									for (var i = prperties.length - 1; i >= 0; i--) {
										var value = values[prperties[i]];
										if(value && (value !== "" || val !== "0")){
											value = value.trim().replace(/\s/gi, "^");
											var cmd = "update " + prperties[i] + " " + win.localSongIndex + " " + win.userPlayList + " " + value;
											me.rTunesCall({
												command		:	cmd,
												updateStatus:	false,
												success		: 	function(resp){
													win.close();
						 						},
												failure		: 	function(resp){
						        					
												}
											});
										}
									}
								}else{

								}
							}
						}],
						items:[trackFrm]
					});
					win.show();
				}
			}, '->',{
				xtype:'button',
				text:'Mobile..',
				handler:function(){
					window.location.href="rTunesMobileAction.do?command=switchToMobile&userName=" + userName;
				}
			}],
			/*tpl:Ext.create('Ext.XTemplate',
				    '<tpl for=".">',
				    	'<span class="label"></span><span class="value">{title}</span></br>',
				        '<span class="label"></span><span class="value">{artist}</span></br>',
				        '<span class="label"></span><span class="value">{album} ({year})</span></br>',
				        '<span class="label"></span><span class="value">{albumartist}</span></br>',
				        '<span class="label"></span><span class="value">{grouping}</span></br>',
				        '<span class="label"></span><span class="value">{genre}</span></br>',
				        '<span class="label"></span><span class="value">{lyrics}</span></br>',
				        '<span class="label">Location : </span><span class="value">{location}</span></br>',
				    '</tpl>'*/
			tpl:Ext.create('Ext.XTemplate',
				    '<tpl for=".">',
				    	'<span class="label">Title : </span><span class="value">{title}</span></br>',
				        '<span class="label">Artist : </span><span class="value">{artist}</span></br>',
				        '<span class="label">Album : </span><span class="value">{album}</span></br>',
				        '<span class="label">Album Artist : </span><span class="value">{albumartist}</span></br>',
				        '<span class="label">Year Released: </span><span class="value">{year}</span></br>',
				        '<span class="label">Grouping : </span><span class="value">{grouping}</span></br>',
				        '<span class="label">Lyrics : </span><span class="value">{lyrics}</span></br>',
				        '<span class="label">Location : </span><span class="value">{location}</span></br>',
				    '</tpl>'
			),
			autoScroll:true
    	});


		var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
            hideGroupedHeader: true,
            startCollapsed: false,
            id: 'albumGrouping'
        });
		
		me.tracksGrid = Ext.create('Ext.grid.Panel', {
			store : me.tracksStore,
	        region:'west',
	        width:340,
	        split:true,
			id:'rtunes-tracks-grid',
			cls:'rtunes-songs-grid',
			loadMask: true,
			border:false,
			hideHeaders:true,
			//features: [groupingFeature],
			multiSelect: true,
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'firstGridDDGroup',
	                dropGroup: 'firstGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    me.msg("Song updated from Playlist", data.records[0].get('name'));
	                }
	            }
	        },
			//width:250,
		    forceFit:true,
		    listeners:{
				itemdblclick:	function( gridView, record, item, index, e, eOpts ){
					var recId = record.data.id;
					var plist = me.currentPlaylist.trim().replace(/\s/gi, "^");
					if(me.playLocally){
						var cmd = "trackLocation " + recId + " " + plist;
						localSongIndex = recId;
						userPlayList = plist;
						playerContext = "SYSTEM_PLAYLIST";
						me.inSyncWithItunes = false;
						//rtunes-player-audio
						//me.player.update('<audio autoplay="false" controls="controls" onended="javascript:plyNextSong();"><source src="'+appBaseUrl+'?userName='+userName+'&command='+ cmd +'" />Your browser does not support the audio element.</audio>');
						
//						$("#jquery_jplayer_1").jPlayer("setMedia", {
//			                mp3: appBaseUrl+'?userName='+userName+'&command='+ cmd
//			            });
						
						rTunesJQPlayer.setPlaylist([{
							mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
						}]);
						rTunesJQPlayer.play(0);
				
						//document.getElementById("rtunes-player-audio-src").src=appBaseUrl+'?userName='+userName+'&command='+ cmd;
						//document.getElementById("rtunes-player-audio").load();
						//document.getElementById("rtunes-player-audio").play();
						me.updateStatus();
						/*me.rTunesCall({
							command		:	cmd,
							updateStatus:	true,
							success		: 	function(resp){
								var location = resp.responseText;
	        					me.cont.update();
	        					me.player.update('<audio autoplay="false" controls="controls"><source src="http://link1.songspk.pk/song1.php?songid=9633" />Your browser does not support the audio element.</audio>');
	 						},
							failure		: 	function(resp){
	        					me.cont.update(resp.responseText);
							}
						});*/
					}
					if(me.playOnSelection){
						var cmd = "playlistplay " + plist;
						cmd += " " + recId;
						playerContext === "ITUNES";
						me.rTunesCall({
							command		:	cmd,
							updateStatus:	true,
							success		: 	function(resp){
	        					me.cont.update(resp.responseText);
							},
							failure		: 	function(resp){
	        					me.cont.update(resp.responseText);
							}
						});
					}
				},
				itemclick:	function( gridView, record, item, index, e, eOpts ){
					/*var cmd = "playlistplay " + me.currentPlaylist;
					cmd += " " + record.data.id;
					me.rTunesCall({
						command		:	cmd,
						updateStatus:	true,
						success		: 	function(resp){
        					me.cont.update(resp.responseText);
						},
						failure		: 	function(resp){
        					me.cont.update(resp.responseText);
						}
					});*/
				}
			},
			//bbar:[],
		    columns: [{ 
		    	text: 'Track Number', 
		    	//width:10,
		    	hidden:true,
		    	dataIndex: 'id'
		    }, { 
		    	text: 'Name', 
		    	dataIndex: 'name',
		    	renderer:function(value){
		    		return value.replace(/,/gi, "");
		    	}
		    }, { 
		    	text: 'Album', 
		    	dataIndex: 'album',
		    	renderer:function(value){
		    		return value.replace(/,/gi, "");
		    	}
		    }]
		});
		
		me.eastPanel = Ext.create('Ext.panel.Panel',{    
			width:300,
			region:'east',
			layout:'border',
			collapsible:true,
			stateful:true,
			cls:'rtunes-east-panel',
			title            : 'User Playlist',
			split:true,
			border:false,
			items:[me.userPlaylistGrid, this.cont]
		});

		me.southPanel = Ext.create('Ext.panel.Panel',{    
			height:160,
			region:'south',
			cls:'rtunes-south-panel',
			layout:'border',
			split:true,
			border:false,
			autoScroll:true,
            items:[]
		});
		
		me.centerPanel =  Ext.create('Ext.panel.Panel',{    
			//height:160,
			region:'center',
			layout:'border',
			cls:'rtunes-center-panel',
			border:false,
			tools:[this.search],
			bbar:[{
				xtype:'textfield',
				emptyText:'Filter Songs...',
				enableKeyEvents:true,
				listeners	: 	{
					scope 	: 	me,
					'keypress':	function(field,e){
						var val = field.getValue();
						if(val && val !== ""){
							me.tracksStore.filter("name", val);
						}else{
							me.tracksStore.clearFilter();
						}
					},
					'keyup':	function(field,e){
						var val = field.getValue();
						if(val && val !== ""){
							me.tracksStore.filter("name", val);
						}else{
							me.tracksStore.clearFilter();
						}
					}
				},
				value:''
			}, {
				xtype:'displayfield',
				value:'Double click to Play'
			}, '->'],
			title:'Songs',
            items:[me.searchGrid, me.tracksGrid, {
            	layout:'border',
            	region:'center',
            	items:[{
	            		region:'west',
	            		width:300,
	            		html:'<div id="rtunes-artwork"></div>'
	            	}, me.lyrics
	            ]
	        }]
		});
		
		Ext.apply(this, {
        	layout:'border',
        	cls:'rtunes-main-panel',
        	bodyStyle:'background-color: rgba(0, 0, 0, 0.23) !important;',
        	listeners:{
				'render' : function(){
					Ext.Ajax.request({
						url: appBaseUrl+'?responseType=json&userName='+userName+'&command=playlist',
						method: 'GET',
						success: function(response){
							startChat();
							response.responseText = response.responseText.replace(/\[H|\[2J/gi, "");
							var resp = response.responseText.split(",");
							for(var i=0; i < resp.length; i++){
								var model = Ext.create('rTunesModel', {
									name : resp[i].trim(),
									id	 :	i + 1
								});
								me.playlistStore.add(model);
							}
							
							var cmd = "trackLocation 12 Other";
							
							rTunesJQPlayer = new jPlayerPlaylist({
								jPlayer : "#jquery_jplayer_1",
								cssSelectorAncestor : "#jp_container_1",
								cssPlaylistSelector : ""
							}, [{
								title:"title",
								artist:"artist",
								album:"album",
								albumArtist:"albumArtist",
								artworkLocaction: "artworkLocaction",
								mediaId: "mediaId",
								//free:true,
								mp3:appBaseUrl+'?userName='+userName+'&command='+ cmd
							}], {
								swfPath : "js/thirdpartylib/jquery/jPlayer",
								// enableRemoveControls:false,
								// supplied: "webmv, ogv, m4v, oga, mp3"
								supplied : "mp3"
							});
						},
						failure: function(resp){
						}
					});
					var task = {
					    run: function(){
							me.updateStatus();
					    },
					    interval: 60000 //60 sec
					}
					Ext.TaskManager.start(task);
					me.TopCorner = Ext.create('Ext.tip.ToolTip', {
			    		target: 'rtunes-main-setting',
			    		//layout:'absolute',
						anchor:'left',
						autoHide:false,
						closable:true,
						border:false,
						cls:'rtunes-settings',
						//renderTo:Ext.getBody(),
						items:[{
							xtype:'checkbox',
							width:160,
							fieldCls:'value',
							checked:true,
							listeners:{
								'change' : function(chkBox, newValue, oldValue, eOpts ){
									me.inSyncWithItunes = newValue;
								}
							},
							boxLabel:'Sync with iTunes',
							value:''
						},{
							xtype:'checkbox',
							width:160,
							checked:false,
							listeners:{
								'change' : function(chkBox, newValue, oldValue, eOpts ){
									me.playOnSelection = newValue;
								}
							},
							boxLabel:'Play on iTunes',
							value:''
						},{
							xtype:'checkbox',
							width:160,
							checked:true,
							listeners:{
								'change' : function(chkBox, newValue, oldValue, eOpts ){
									me.playLocally = newValue;
									if(!newValue){
										//me.player.update('<audio autoplay="false" controls="controls">Your browser does not support the audio element.</audio>');
									}
								}
							},
							boxLabel:'Play Locally',
							value:''
						},{
							title:'Themes',
							layout:'auto',
							items:[{
								xtype:'button',
								text:'Default',
								handler:function(){
									Ext.getBody().dom.className="x-body x-webkit x-chrome x-mac x-reset rtunes-main-panel x-border-layout-ct x-container";
									rt.cookies.set('rTunes-theme', "", 7, '/', '', '' );
								}
							},{
								xtype:'button',
								text:'Jungle',
								handler:function(){
									Ext.getBody().dom.className="jungle x-body x-webkit x-chrome x-mac x-reset rtunes-main-panel x-border-layout-ct x-container";
									rt.cookies.set('rTunes-theme', "jungle", 7, '/', '', '' );
								}
							},{
								xtype:'button',
								text:'Black',
								handler:function(){
									Ext.getBody().dom.className="black x-body x-webkit x-chrome x-mac x-reset rtunes-main-panel x-border-layout-ct x-container";
									rt.cookies.set('rTunes-theme', "black", 7, '/', '', '' );
								}
							},{
								xtype:'button',
								text:'Valentines',
								handler:function(){
									Ext.getBody().dom.className="valentine x-body x-webkit x-chrome x-mac x-reset rtunes-main-panel x-border-layout-ct x-container";
									rt.cookies.set('rTunes-theme', "valentine", 7, '/', '', '' );
								}
							},{
								xtype:'button',
								text:'Sky',
								handler:function(){
									Ext.getBody().dom.className="sky x-body x-webkit x-chrome x-mac x-reset rtunes-main-panel x-border-layout-ct x-container";
									rt.cookies.set('rTunes-theme', "sky", 7, '/', '', '' );
								}
							}]
						}]
					});
				}
			},
            items: [{
            	region:'north',
            	height:85,
            	split:true,
            	//bodyStyle:'background-color:#eee;',
            	//style:'background-color:#eee;',
            	items:[{
            		xtype:'button',
            		text:'',
            		border:false,
            		id:'rtunes-main-setting',
            		handler:function(btn){
            			//me.TopCorner.show();
            		}
            	}, {
            		html: playerHtmlTemplate
            	}, {
            		border:false,
            		layout: {
	                    type: 'hbox',
	                    padding:'10',
	                    pack:'center',
	                    align:'middle'
	                },
            		items : [{
		            		xtype:'button',
		            		id:'rtunes-player-play',
		            		width:50,
		            		text:'Play',
		            		handler:function(){
		            			if(me.playOnSelection){
			            			me.rTunesCall({
			        					command		:	'play',
			        					updateStatus:	true,
				                        success: function(resp){
				                        	me.cont.update(resp.responseText);
				            			},
				                        failure: function(resp){
				            				me.cont.update(resp);
				            			}
				            		});
			            		}
		            		}
            		    },{
		            		xtype:'button',
		            		id:'rtunes-player-pause',
		            		width:50,
		            		text:'Pause',
		            		handler:function(){
		            			if(me.playOnSelection){
		            		    	me.rTunesCall({
			        					command		:	'pause',
			        					updateStatus:	true,
				                        success: function(resp){
		            		    			me.cont.update(resp.responseText);
				            			},
				                        failure: function(resp){
				            				me.cont.update(resp);
				            			}
				            		});
	            		    	}
		            		}
            		    },{
		            		xtype:'button',
		            		id:'rtunes-player-next',
		            		width:50,
		            		text:'Next',
		            		handler:function(){
		            			if(me.playOnSelection){
		            		    	me.rTunesCall({
			        					command		:	'next',
			        					updateStatus:	true,
				                        success: function(resp){
		            		    			me.cont.update(resp.responseText);
				            			},
				                        failure: function(resp){
				            				me.cont.update(resp);
				            			}
				            		});
	            		    	}else if(playerContext === "SYSTEM_PLAYLIST"){
		            				plyNextSong();
		            			}else if(playerContext === "USER_PLAYLIST"){
		            				plyUserNextSong();
		            			}
		            		}
            		    },{
		            		xtype:'button',
		            		id:'rtunes-player-prev',
		            		width:50,
		            		text:'Prev',
		            		handler:function(){
		            			if(me.playOnSelection){
		            		    	me.rTunesCall({
			        					command		:	'prev',
			        					updateStatus:	true,
				                        success: function(resp){
		            		    			me.cont.update(resp.responseText);
				            			},
				                        failure: function(resp){
				            				me.cont.update(resp);
				            			}
				            		});
		            		    }else if(playerContext === "SYSTEM_PLAYLIST"){
		            				plyNextSong(true);
		            			}else if(playerContext === "USER_PLAYLIST"){
		            				plyUserNextSong(true);
		            			}
		            		}
            		    },{
		            		xtype:'button',
		            		id:'rtunes-player-shuffle',
		            		width:80,
		            		text:'Shuffle on',
		            		handler:function(){
	            		    	me.rTunesCall({
		        					command		:	'shuffle on',
		        					updateStatus:	true,
			                        success: function(resp){
	            		    			me.cont.update(resp.responseText);
			            			},
			                        failure: function(resp){
			            				me.cont.update(resp);
			            			}
			            		});
		            		}
            		    },{
		            		xtype:'button',
		            		width:80,
		            		text:'Shuffle off',
		            		handler:function(){
	            		    	me.rTunesCall({
		        					command		:	'shuffle off',
		        					updateStatus:	true,
			                        success: function(resp){
	            		    			me.cont.update(resp.responseText);
			            			},
			                        failure: function(resp){
			            				me.cont.update(resp);
			            			}
			            		});
		            		}
            		    },{
            	            xtype:'sliderfield',
            		    	fieldLabel: 'Volume',
            		    	id:'rtunes-global-volume',
            		    	style:'background-color:#eee;',
            		    	padding:'0 0 0 10',
            		    	width:300,
            	            value: 50,
            	            listeners:{
                		    	'changecomplete' : function(slider){
            		    			if(me.playOnSelection){
	    	            		    	me.rTunesCall({
	    	            					command		:	'vol ' + slider.getValue(),
	    	            					updateStatus:	false,
	    			                        success: function(resp){
	    			            				
	    	            		    		},
	    			                        failure: function(resp){
	    			            			}
	    			            		});
            		    			}
            		    		},
            		    		'change'	:	function(slider, newValue, thumb, eOpts ){
            		    			if(me.playOnSelection){
	            		    			me.rTunesCall({
	    	            					command		:	'vol ' + slider.getValue(),
	    	            					updateStatus:	false,
	    			                        success: function(resp){
	    			            				
	    	            		    		},
	    			                        failure: function(resp){
	    			            			}
	    			            		});
            		    			}
            		    			if(playerContext === "USER_PLAYLIST" || playerContext === "SYSTEM_PLAYLIST"){
    	        		    			//var audio = Ext.get('rtunes-player-audio');
    	        		    			//audio.volume=newValue / 100;
            		    			}
            		    		}
                		    },
            	            anchor: '95%',
            	            tipText: function(thumb){
            	                return String(thumb.value) + '%';
            	            },
            	            name: 'volume'
            	        }]
            	}]
            },
            me.playlistsGrid, 
            me.centerPanel,
            //me.southPanel,
            me.eastPanel,
            me.userPlaylistCmp
            ]
        });
        this.callParent(arguments);
    },
    
    rTunesCall: function(params){
    	var me = this;
    	var responseType = params.responseType ? params.responseType : "html";
    	Ext.Ajax.request({
			url: params.url ? params.url : appBaseUrl+ '?responseType='+responseType + '&userName='+userName+'&command=' + (params.command ? params.command : 'status'),
            method: params.method ? params.method : 'GET',
            success: function(resp){
    			if(params.success){
    				params.success(resp);
    			} 
    			if(params.updateStatus){
    				me.updateStatus();
    			}
			},
            failure: function(resp){
				if(params.failure){
					params.failure(resp);
    			}
				if(params.updateStatus){
					me.updateStatus();
    			}
			}
		});
    },
    
    updateStatus: function(trackNo, playlist){
    	var me = this;
    	var cmd = appBaseUrl+'?userName='+userName+'&command=status';
    	if(trackNo && trackNo !== "" && playlist && playlist !== ""){
    		cmd =appBaseUrl+'?userName='+userName+'&command=trackinfo ' + trackNo + " " + playlist;
    	}else if(me.playLocally  && playerContext == "SYSTEM_PLAYLIST" && !me.inSyncWithItunes){
    		cmd =appBaseUrl+'?userName='+userName+'&command=trackinfo ' + localSongIndex + " " + userPlayList;
    	}else if(me.playLocally && playerContext == "USER_PLAYLIST" && !me.inSyncWithItunes){
    		var plgrd = Ext.getCmp('user-playlist-grid');
    		var recIn = plgrd.songId;
    		cmd =appBaseUrl+'?userName='+userName+'&command=trackinfo ' + recIn + " " + userPlayList;
    	}
		Ext.Ajax.request({
			url: cmd,
            method: 'GET',
            success: function(resp){
				var respObj = Ext.decode(resp.responseText);
				me.lyrics.data = respObj;
				try{
					respObj.location = respObj.location.replace("alias Macintosh:Users:learning:Music:iTunes:iTunes Media:", "");
					respObj.location = respObj.location.replace("Macintosh:Users:learning:Music:iTunes:iTunes Media:", "");
					respObj.location = respObj.location.replace(/:/gi, "\\");
				}catch(e){

				}
				//rtunes-artwork
				doImageSearch(respObj.album + " " + respObj.year + " " + respObj.genre);
				if(trackNo && trackNo !== "" && playlist && playlist !== ""){
					var status = "<b>" + respObj.title + "</b> by " + respObj.artist;// + " " + respObj.album + ((respObj.year) ? " <i>(" + respObj.year + ")</i>" : "");
					if(respObj.playlist && respObj.playlist != ""){
						status += " from playlist <b>" + respObj.playlist + "</b>";
					}
					Ext.get('jp-track-status').update(status);
					try{
						me.lyrics.update(respObj);
					}catch(e){
						//console.log(e);
					}
				}else if(respObj.state == "playing" || (me.playLocally && (playerContext === "USER_PLAYLIST" || playerContext === "SYSTEM_PLAYLIST"))){
					var status = "<span class='song-name'>" + respObj.title + "</span> by <span class='song-artist'>" + respObj.artist + "</span>";// + " " + respObj.album + ((respObj.year) ? " <i>(" + respObj.year + ")</i>" : "");
					if(respObj.playlist && respObj.playlist != ""){
						status += " from playlist <span class='song-name'>" + respObj.playlist + "</span>";
					}
					Ext.get('jp-track-status').update(status);
					try{
						me.lyrics.update(respObj);
					}catch(e){
						//console.log(e);
					}
					if(me.currentPlaylist === ""){
						me.currentPlaylist = respObj.playlist;
						var plIndex = me.playlistStore.find('name', me.currentPlaylist);
						if(plIndex !== -1){
							me.playlistsGrid.getSelectionModel().select(plIndex);
						}	
						var index = me.tracksStore.find('name', respObj.title.trim());
						me.loadPlaylist(respObj.playlist, function(){
							var grid = Ext.getCmp('rtunes-tracks-grid');
							var index = me.tracksStore.find('name', respObj.title.trim());
							if(index !== -1){
								grid.getSelectionModel().select(index);
								var rec = me.tracksStore.getAt(index);
								var plist = me.currentPlaylist.trim().replace(/\s/gi, "^");
								var cmd = "trackLocation " + rec.data.id + " " + plist;
								var recId = rec.data.id;
								localSongIndex = recId;
								userPlayList = plist;
								playerContext = "SYSTEM_PLAYLIST";
								rTunesJQPlayer.setPlaylist([{
									mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
								}]);
								rTunesJQPlayer.play(0);
								rTunesJQPlayer.pause(0);
							}
						});
					}else{
						try{
							var grid = Ext.getCmp('rtunes-tracks-grid');
							var index = me.tracksStore.find('name', respObj.title.trim());
							if(index !== -1){
								grid.getSelectionModel().select(index);
							}
						}catch(e){
	
						}
					}
				}else{
					Ext.get('jp-track-status').update(respObj.state);
				}
				if(respObj.volume && respObj.volume != ""){
					sysVolume = respObj.volume;
					
				}
			},
            failure: function(resp){
				var respObj = Ext.decode(resp.responseText);
				Ext.get('jp-track-status').update(respObj.title);
				me.lyrics.update(respObj.title);
			}
		});
    },

    loadPlaylist: function(playlist, callback){
    	var me = this;
    	var pListName = playlist.trim().replace(/\s/gi, "^");
		var cmd = "webplaylist " + pListName;
		me.rTunesCall({
			command		:	cmd,
			updateStatus:	false,
			success		: 	function(response){
				try{
					me.tracksStore.removeAll();
				}catch(e){
					//
				}
				var songs = response.responseText.split(",");
				var records = [];
				for(var i=0; i < songs.length; i++){
					var model1 = Ext.create('rTunesModel', {
					    name : songs[i].trim(),
					    component:pListName,
					    id	 :	i + 1
					});
					records.push(model1);
				}
				me.tracksStore.loadData(records);				
				if(callback){
					callback();
				}
			},
			failure		: 	function(resp){
				me.cont.update(resp.responseText);
			}
		});
    },
    
    doSearch:function(){
    	var me = this;
    	var searchStr = me.search.getValue();
    	if(searchStr.length < 3){
    		me.msg("Search..", "<span style='color:red;'>Please enter Song title / Artist / Album...!</span>");
    		return false;
    	}
    	var myMask = new Ext.LoadMask(Ext.getBody(), {
			msg:"Searching..."
		});
		myMask.show();
    	me.rTunesCall({
			command		:	'search ' + searchStr,
			updateStatus:	true,
			success: function(resp){
    			me.cont.update("Searching " + me.search.getValue());
    			me.currentPlaylist = "rTunes";
    			me.loadPlaylist("rTunes", function(){
					myMask.hide();
					myMask.destroy();
				});
    		},
    		failure: function(resp){
				me.cont.update(resp);
			}
    	});
    },

    msg : function(title, format){
    	var msgCt = Ext.get('msg-div');
        function createBox(t, s){
           return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
        }
        if(!msgCt){
            msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
        }
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var m = Ext.core.DomHelper.append(msgCt, createBox(title, s), true);
        m.hide();
        m.slideIn('t').ghost("t", { delay: 2500, remove: true});
    }
});


var startChat = function(){
/***
 *
 *	Chat application using socket io
 *
 */

	//window.socket = io.connect('http://learning:8082');
	window.socket = io.connect('http://10.70.8.101:8082');

	// on connection to server, ask for user's name with an anonymous callback
	window.socket.on('connect', function() {
				// call the server-side function 'adduser' and send one parameter
				// (value of prompt)
				window.socket.emit('adduser', userName);
			});

	// listener, whenever the server emits 'updatechat', this updates the chat body
	window.socket.on('updatechat', function(username, data) {
				$('#conversation').append('<b>' + username + ':</b> ' + data
						+ '<br>');
			});

	// listener, whenever the server emits 'updatechat', this updates the chat body
	window.socket.on('play', function(username, data) {
				if (userName !== username) {
					inSync = true;
					plySong(data.trackNo, data.playlist);
				}
			});

	// listener, whenever the server emits 'getplay', this updates the chat body
	window.socket.on('getplay', function(username, data) {
				if (userName !== username) {
					inSync = true;
					myCirclePlayer.setMedia({
								mp3 : "/GetMediaByIdAction.do?mediaId="
										+ data.mediaId
							}, {
								swfPath : "/js/thirdpartylib/jquery/jPlayer",
								supplied : "mp3, m4a",
								cssSelectorAncestor : "#cp_container_1",
								wmode : "window"
							});
					currentMediaId = data.mediaId;
					myCirclePlayer.play(data.time + 1.65);
				}
			});

	window.socket.on('seekplay', function(username, data) {
				if (userName !== username) {
					inSync = true;
					myCirclePlayer.setMedia({
								mp3 : "/GetMediaByIdAction.do?mediaId="
										+ data.mediaId
							}, {
								swfPath : "/js/thirdpartylib/jquery/jPlayer",
								supplied : "mp3, m4a",
								cssSelectorAncestor : "#cp_container_1",
								wmode : "window"
							});
					myCirclePlayer.play();
					currentMediaId = data.mediaId;
					myCirclePlayer.player.jPlayer("playHead", data.time)
							.jPlayer("play");
				}
			});

	// listener, whenever the server emits 'updaterooms', this updates the room the
	// client is in
	window.socket.on('updaterooms', function(rooms, current_room) {
				$('#rooms').empty();
				$.each(rooms, function(key, value) {
								$('#rooms')
										.append('<div>* <a href="#" onclick="switchRoom(\''
												+ value
												+ '\')">'
												+ value
												+ '</a></div>');
						});
			});

	window.socket.on('updateusers', function(usernames, current_room) {
				$('#rooms').empty();
				$.each(usernames, function(key, value) {
							if (value == current_room) {
								$('#rooms').append('<div>' + value + '</div>');
							} else {
								$('#rooms')
										.append('<div><a href="#" onclick="switchRoom(\''
												+ value
												+ '\')">'
												+ value
												+ '</a></div>');
							}
						});
			});

	window.socket.onerror = function(error) {
		// just in there were some problems with conenction...
		$('#conversation').append('Sorry, but there\'s some problem with your connection or the server is down.</p>');
	};

	window.switchRoom = function(room) {
		window.socket.emit('switchRoom', room);
	}

	window.doSendMessage = function(message) {
		var isPlayCommand = (message.indexOf('>') == -1) ? false : true;
		if (isPlayCommand) {
			//alert(currentMedia.time);
			inSync = true;
			if(playerContext === "SYSTEM_PLAYLIST"){
				var cmd = {
					trackNo 	: 	localSongIndex,
					playlist 	: 	userPlayList
				};
			}else if(playerContext === "USER_PLAYLIST"){
				var plgrd = Ext.getCmp('user-playlist-grid');
				var plStore = Ext.data.StoreManager.lookup('user-playlist-store');
				var rec = plStore.getAt(recIn);
				if(!rec){
					recIn = 0;
					rec = plStore.getAt(recIn);
				}
				var cmd = {
					trackNo 	: 	rec.data.id,
					playlist 	: 	rec.data.component
				};
			}
			window.socket.emit('play', cmd);
		} else {
			// tell server to execute 'sendchat' and send along one parameter
			window.socket.emit('sendchat', message);
		}
	};
};
	
		var addPaginationLinks = function() {
			// To paginate search results, use the cursor function.
			var cursor = imageSearch.cursor;
			var curPage = cursor.currentPageIndex; // check what page the app is on
			var pagesDiv = document.createElement('div');
			for (var i = 0; i < cursor.pages.length; i++) {
				var page = cursor.pages[i];
				if (curPage == i) { 
					// If we are on the current page, then don't make a link.
					var label = document.createTextNode(' ' + page.label + ' ');
					pagesDiv.appendChild(label);
				} else {
					// Create links to other pages using gotoPage() on the searcher.
					var link = document.createElement('a');
					link.href="/image-search/v1/javascript:imageSearch.gotoPage("+i+');';
					link.innerHTML = page.label;
					link.style.marginRight = '2px';
					pagesDiv.appendChild(link);
				}
			}
			var contentDiv = document.getElementById('content');
			contentDiv.appendChild(pagesDiv);
		};

		var imageTask = {
		    run: function(){
		    	imageCount++;
				searchComplete();
		    },
		    interval: 20000 //20 sec
		};

      	var searchComplete = function() {
			try{	
				// Check that we got results
				if (imageSearch.results && imageSearch.results.length > 0) {

					// Grab our content div, clear it.
					var contentDiv = document.getElementById('rtunes-artwork');
					contentDiv.innerHTML = '';

					// Loop through our results, printing them to the page.
					var results = imageSearch.results;
					if(results.length < imageCount){
						imageCount = 0;
					}
					var result = results[imageCount];
					//result.titleNoFormatting;
					var newImg = document.createElement('img');
					// There is also a result.url property which has the escaped version
					newImg.id="rtunes-artwork-img";
					newImg.src=result.url;
					newImg.onerror = function(){
						imageCount++;
						searchComplete();
						//newImg.src=result.unescapedUrl;
					}
					// Put our title + image in the content
					contentDiv.appendChild(newImg);
					/*
					for (var i = 0; i < results.length; i++) {
					// For each result write it's title and image to the screen
					var result = results[i];
					var imgContainer = document.createElement('div');
					var title = document.createElement('div');

					// We use titleNoFormatting so that no HTML tags are left in the 
					// title
					title.innerHTML = result.titleNoFormatting;
					var newImg = document.createElement('img');

					// There is also a result.url property which has the escaped version
					newImg.src="/image-search/v1/result.tbUrl;"
					imgContainer.appendChild(title);
					imgContainer.appendChild(newImg);

					// Put our title + image in the content
					contentDiv.appendChild(imgContainer);
					}
					*/
					// Now add links to additional pages of search results.
					//addPaginationLinks(imageSearch);
				}
			}catch(e){}
		};

		var doImageSearch = function(albumTitle) {
			try{
				if(currentSong !== albumTitle){
					// Create an Image Search instance.
					imageCount = 0;
					imageSearch = new google.search.ImageSearch();
					imageSearch.setRestriction(
						google.search.Search.RESTRICT_SAFESEARCH,
						google.search.Search.SAFESEARCH_ON
					);
					// imageSearch.setRestriction(
					//   google.search.ImageSearch.RESTRICT_IMAGESIZE,
					//   google.search.ImageSearch.IMAGESIZE_MEDIUM
					// );
					// imageSearch.setRestriction(
					//   google.search.ImageSearch.RESTRICT_FILETYPE,
					//   google.search.ImageSearch.FILETYPE_JPG
					// );
					// Set searchComplete as the callback function when a search is 
					// complete.  The imageSearch object will have results in it.
					imageSearch.setSearchCompleteCallback(this, searchComplete, null);
					imageSearch.execute(albumTitle + " film poster");
					currentSong = albumTitle;
					// Include the required Google branding
					//google.search.Search.getBranding('branding');
					Ext.TaskManager.stop(imageTask);
					Ext.TaskManager.start(imageTask);
				}else{
					imageCount++;
					searchComplete();
				}
			}catch(e){}
		};