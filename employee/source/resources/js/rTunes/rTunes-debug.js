Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '../js/thirdpartylib/extjs/ux/');
Ext.require([
    'Ext.slider.*', 
    'Ext.form.*',
    'Ext.window.Window',
    'Ext.window.MessageBox',
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.util.*',
    'Ext.ux.data.PagingMemoryProxy',
    'Ext.toolbar.Paging',
    'Ext.ux.SlidingPager'
]);

var localSongIndex = 0;
var userPlayList = "";
var playerContext = "ITUNES";
var plyNextSong = function(){
	playerContext = "SYSTEM_PLAYLIST";
	localSongIndex++;
	var str = Ext.data.StoreManager.lookup('tracksStore');
	var rec = str.getAt(localSongIndex);
	if(!rec){
		localSongIndex = 1;
	}
	var cmd = "trackLocation " + localSongIndex + " " + userPlayList;
	var playerCmp = Ext.getCmp('rTunes-player');
	playerCmp.update('<audio autoplay="autoplay" controls="controls" onended="javascript:plyNextSong();"><source src="'+appBaseUrl+'?userName='+userName+'&command='+ cmd +'" />Your browser does not support the audio element.</audio>');
	playerCmp.updateStatus();
	//var player = ;
};
var plyUserNextSong = function(){
	playerContext = "USER_PLAYLIST";
	var plgrd = Ext.getCmp('user-playlist-grid');
	var recIn = plgrd.recIn + 1;
	var plStore = Ext.data.StoreManager.lookup('user-playlist-store');
	var rec = plStore.getAt(recIn);
	if(!rec){
		recIn = 0;
		rec = plStore.getAt(recIn);
	}
	var cmd = "trackLocation " + rec.data.id + " " + rec.data.component;
	plgrd.songId = rec.data.id;
	//localSongIndex = rec.data.id;
	userPlayList = rec.data.component;
	var playerCmp = Ext.getCmp('rTunes-player');
	playerCmp.update('<audio autoplay="autoplay" controls="controls" onended="javascript:plyUserNextSong();"><source src="'+appBaseUrl+'?userName='+userName+'&command='+ cmd +'" />Your browser does not support the audio element.</audio>');
	playerCmp.updateStatus();
	plgrd.recIn = recIn;
	plgrd.getSelectionModel().select(recIn);
	//var player = ;
};



Ext.define('rTunes.App', {
    extend: 'Ext.container.Viewport',
    playOnSelection:false,
    currentPlaylist : '',
    playLocally:true,
    initComponent: function(){
		var me = this;
		
		Ext.define('rTunesModel', {
		    extend: 'Ext.data.Model',
		    fields: ['name', 'id', 'component']
		});
		
		Ext.define('TrackInfo', {
		    extend: 'Ext.data.Model',
		    fields: ['id', 'title', 'artist', 'album', 'director', 'lyrics', 'year', 'component']
		});

		this.cont = Ext.create('Ext.panel.Panel',{
			width:300,
			region:'east',
			title:'Console..',
			split:true,
			autoScroll:true,
            html:'Coming up next Non HTML5 browser support & Play in sync with iTunes....'
		});

		me.player = Ext.create('Ext.panel.Panel',{
			border:false,
			id:'rTunes-player',
			region:'north',
			updateStatus:function(){
				me.updateStatus();
			},
			height:40,
			frame:false,
			padding:'5',
        	html:'<audio id="rtunes-player-audio" controls="controls" onended="javascript:plyNextSong();"><source id="rtunes-player-audio-src" src="" />Your browser does not support the audio element.</audio>'
        });
		
		
		this.search = Ext.create('Ext.form.TextField',{
			flex:2,
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
		
		this.status = Ext.create('Ext.form.DisplayField',{
			fieldLabel : '',
			flex:2,
			labelAlign:'right',
    		value:''
    	});
		
		this.userPlaylistStore = Ext.create('Ext.data.Store', {
			storeId: 'user-playlist-store',
	        model: 'rTunesModel'
	    });

	    // create the destination Grid
	    this.userPlaylistGrid = Ext.create('Ext.grid.Panel', {
	    	region:'center',
	    	//width:300,
	    	id:'user-playlist-grid',
	    	recIn  : 0,
	    	forceFit:true,
	    	bbar:[{
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
	    				var cmd = "trackLocation " + dataObj.id + " " + dataObj.component;
						me.player.update('<audio autoplay="false" controls="controls" onended="javascript:plyUserNextSong();"><source src="'+appBaseUrl+'?userName='+userName+'&command='+ cmd +'" />Your browser does not support the audio element.</audio>');
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
			}],
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'secondGridDDGroup',
	                dropGroup: 'firstGridDDGroup'
	            },
	            listeners: {
					itemdblclick:	function( gridView, record, item, index, e, eOpts ){
	            		playerContext = "USER_PLAYLIST";
	    				var dataObj = record.data;
	    				var index = me.userPlaylistStore.find('name', dataObj.name.trim());
	    				var cmd = "trackLocation " + dataObj.id + " " + dataObj.component;
	    				userPlayList = dataObj.component;
	    				me.userPlaylistGrid.recIn = index;
	    				me.userPlaylistGrid.songId = dataObj.id;
	    				me.player.update('<audio autoplay="false" controls="controls" onended="javascript:plyUserNextSong();"><source src="'+appBaseUrl+'?userName='+userName+'&command='+ cmd +'" />Your browser does not support the audio element.</audio>');
						me.updateStatus();
					},
	                drop: function(node, data, dropRec, dropPosition) {
	                	var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty playlist';
	                    me.msg("Song added to PLaylist", 'Added ' + data.records[0].get('name') + dropOn);
	                }
	            }
	        },
	        store            : me.userPlaylistStore,
	        columns          : [{ 
							    	text: 'ID', 
							    	dataIndex: 'id'
							    }, { 
							    	text: 'Name', 
							    	dataIndex: 'name'
							    }, { 
							    	text: 'Component',
							    	dataIndex: 'component',
							    	renderer:function(value){
							        	return value.replace(/\^/gi, " ");
							        }
							    }],
	        stripeRows       : true,
	        title            : 'User Playlist'
	    });
	    
		this.lyrics = Ext.create('Ext.form.Panel',{
			title: 'Track Information',
			region:'center',
			split:true,
			collapsible:false,
			tpl:Ext.create('Ext.XTemplate',
				    '<tpl for=".">',
				        '<span>Title : </span><span>{title}</span>',
				        '<span>Artist : </span><span>{title}</span>',
				        '<span>Album : </span><span>{title}</span>',
				        '<span>Album Artist : </span><span>{title}</span>',
				        '<span>Year Released: </span><span>{title}</span>',
				        '<span>Name : </span><span>{title}</span>',
				    '</tpl>'
			),
			autoScroll:true
    	});
		
		me.playlistStore = Ext.create('Ext.data.ArrayStore', {
		    // store configs
		    autoDestroy: true,
		    storeId: 'myStore',
		    // reader configs
		    idIndex: 0,
		    fields: ['name']
		});
		
		
		me.tracksStore = Ext.create('Ext.data.Store', {
	        storeId: 'tracksStore',
	        model: 'rTunesModel',
	        pageSize: 10
	    });
		
		/*Ext.create('Ext.data.Store', {
		    // store configs
		    autoDestroy: true,
		    storeId: 'me.tracksStore',
		    // reader configs
		    idIndex: 0,
	        pageSize: 50,
	        // allow the grid to interact with the paging scroller by buffering
	        buffered: true,
	        // never purge any data, we prefetch all up front
	        purgePageCount: 0,
	        model: 'rTunesModel',
	        proxy: {
	            type: 'memory'
	        }
		});*/
		
		var playlists = Ext.create('Ext.grid.Panel', {
			store : me.playlistStore,
			title: 'Playlists',
			region:'west',
			split:true,
			width:200,
		    forceFit:true,
		    listeners:{
				itemclick:	function( gridView, record, item, index, e, eOpts ){
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
			tbar:[{
				xtype:'textfield',
				emptyText:'Search Playlist...',
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
		    columns: [{ 
		    	text: 'Name', 
		    	dataIndex: 'name'
		    }]
		});
		
		var tracksGrid = Ext.create('Ext.grid.Panel', {
			store : me.tracksStore,
	        region:'center',
			id:'rtunes-tracks-grid',
			title: 'Songs',
			loadMask: true,
			multiSelect: true,
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'firstGridDDGroup',
	                dropGroup: 'secondGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    me.msg("Song removed from PLaylist", data.records[0].get('name'));
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
						me.player.update('<audio autoplay="false" controls="controls" onended="javascript:plyNextSong();"><source src="'+appBaseUrl+'?userName='+userName+'&command='+ cmd +'" />Your browser does not support the audio element.</audio>');
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
						playerContext === "ITUNES"
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
			//hideHeaders:true,
			bbar:[{
				xtype:'displayfield',
				value:'Double click to Play'
			}, '->'],
			tbar:[{
				xtype:'textfield',
				emptyText:'Search Songs...',
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
			},'->',{
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
							me.player.update('<audio autoplay="false" controls="controls">Your browser does not support the audio element.</audio>');
						}
					}
				},
				boxLabel:'Play Locally',
				value:''
			}],
		    columns: [{ 
		    	text: 'Track Number', 
		    	width:10,
		    	dataIndex: 'id'
		    }, { 
		    	text: 'Name', 
		    	dataIndex: 'name'
		    }]
		});
		
		me.eastPanel = Ext.create('Ext.panel.Panel',{    
			width:300,
			region:'east',
			layout:'border',
			split:true,
			items:[me.player, me.userPlaylistGrid]
		});

		me.southPanel = Ext.create('Ext.panel.Panel',{    
			height:160,
			region:'south',
			layout:'border',
			split:true,
			autoScroll:true,
            items:[this.lyrics, this.cont]
		});

		
		Ext.apply(this, {
        	layout:'border',
        	listeners:{
				'render' : function(){
					Ext.Ajax.request({
						url: appBaseUrl+'?responseType=json&userName='+userName+'&command=playlist',
						method: 'GET',
						success: function(response){
							response.responseText = response.responseText.replace(/\[H|\[2J/gi, "");
							var resp = response.responseText.split(",");
							for(var i=0; i < resp.length; i++){
								var model = Ext.create('rTunesModel', {
									name : resp[i].trim(),
									id	 :	i + 1
								});
								me.playlistStore.add(model);
							}
						},
						failure: function(resp){
						}
					});
					var task = {
					    run: function(){
							me.updateStatus();
					    },
					    interval: 90000 //90 sec
					}
					Ext.TaskManager.start(task);
				}
			},
            items: [{
            	region:'north',
            	height:90,
            	split:true,
            	items:[{
            		border:false,
            		layout: {
	                    type: 'hbox',
	                    //padding:'10',
	                    pack:'right',
	                    align:'middle'
	                },
            		items:[this.status]
            	},{
            		border:false,
            		layout: {
	                    type: 'hbox',
	                    //padding:'10',
	                    pack:'center',
	                    align:'middle'
	                },
            		items : [{
            			flex:1,
            			border:false,
	            		layout: {
		                    type: 'hbox',
		                    pack:'center',
		                    align:'middle'
		                },
	            		items : [this.search/*, {
		            		xtype:'button',
		            		text:'Seach',
		            		handler:function(){
		            			me.doSearch();
		            		}
            		    }*/]
            		},{
        	            xtype:'sliderfield',
        		    	fieldLabel: 'Volume',
        		    	padding:'0 0 0 10',
        		    	width:300,
        	            value: 50,
        	            listeners:{
            		    	'changecomplete' : function(slider){
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
        	            anchor: '95%',
        	            tipText: function(thumb){
        	                return String(thumb.value) + '%';
        	            },
        	            name: 'volume'
        	        }]
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
		            		width:50,
		            		text:'Prev',
		            		handler:function(){
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
		            		}
            		    },{
		            		xtype:'button',
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
            		    }
            	]
            	}]
            },
            playlists, 
            tracksGrid, 
            me.southPanel,
            me.eastPanel,
            me.userPlaylistCmp
            ]
        });
        this.callParent(arguments);
    },
    
    rTunesCall: function(params){
    	var me = this;
    	Ext.Ajax.request({
			url: params.url ? params.url : appBaseUrl+ '?userName='+userName+'&command=' + (params.command ? params.command : 'status'),
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
    
    updateStatus: function(){
    	var me = this;
    	var cmd = appBaseUrl+'?userName='+userName+'&command=status';
    	if(me.playLocally  && playerContext == "SYSTEM_PLAYLIST"){
    		cmd =appBaseUrl+'?command=trackinfo ' + localSongIndex + " " + userPlayList;
    	}else if(me.playLocally && playerContext == "USER_PLAYLIST"){
    		var plgrd = Ext.getCmp('user-playlist-grid');
    		var recIn = plgrd.songId;
    		cmd =appBaseUrl+'?command=trackinfo ' + recIn + " " + userPlayList;
    	}
		Ext.Ajax.request({
			url: cmd,
            method: 'GET',
            success: function(resp){
				var respObj = Ext.decode(resp.responseText);
				if(respObj.state == "playing" || (me.playLocally && (playerContext === "SYSTEM_PLAYLIST" || playerContext === "SYSTEM_PLAYLIST"))){
					var status = "<b style='color:rgb(197, 1, 1)'>" + respObj.title + " </b>: " + respObj.artist + " : " + respObj.album + ((respObj.year) ? " <i>(" + respObj.year + ")</i>" : "");
					if(respObj.playlist && respObj.playlist != ""){
						status += " from playlist <b>" + respObj.playlist + "</b>";
					}
					me.status.setValue(status);
					try{
						me.lyrics.update(respObj.lyrics.replace(/\r\n|\n/, '<br />'));
						/*if(respObj.lyrics.length > 15){
							me.lyrics.expand("left", true);
						}else{
							me.lyrics.collapse('right', true);
						}*/
					}catch(e){
						if (me.lyrics){
							me.lyrics.update("...");
						}
					}
					if(me.currentPlaylist === ""){
						me.currentPlaylist = respObj.playlist;
						me.loadPlaylist(respObj.playlist, function(){
							var grid = Ext.getCmp('rtunes-tracks-grid');
							var index = me.tracksStore.find('name', respObj.title.trim());
							if(index !== -1){
								grid.getSelectionModel().select(index);
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
					me.status.setValue(respObj.state);
				}
			},
            failure: function(resp){
				var respObj = Ext.decode(resp.responseText);
				me.status.setText(respObj.title);
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
				var resp = response.responseText.split(",");
				var records = []
				for(var i=0; i < resp.length; i++){
					var model1 = Ext.create('rTunesModel', {
					    name : resp[i].trim(),
					    component:pListName,
					    id	 :	i + 1
					});
					records.push(model1);
				}
				/*me.tracksStore.setProxy({
                    type: 'pagingmemory',
                    data: {
                    	"success": true,
                    	total : records.length,
                    	records: [records]
                    },
                    reader: {
                        type: 'json',
                        totalProperty: 'total',
                        root: 'records',
                        successProperty: 'success'
                    }
                });
				me.tracksStore.load();
				
				*/
				me.tracksStore.add(records);
				//me.tracksStore.guaranteeRange(0, 49);
				
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
           // return ['<div class="msg">',
           //         '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
           //         '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
           //         '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
           //         '</div>'].join('');
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