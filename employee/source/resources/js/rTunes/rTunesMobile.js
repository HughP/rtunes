var localSongIndex = 0;
var userPlayList = "";
var playerContext = "ITUNES";
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
                    //"<div id='jp-track-status' class='jp-track-status'></div>" +
                    "<div class='jp-current-time'></div>" +
                    "<div class='jp-duration'></div>" +
                    "<div class='jp-progress'>" +
                        "<div class='jp-seek-bar'>" +
                            "<div class='jp-play-bar'></div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>" +
            "<div class='jp-no-solution'>" +
                "<span>Update Required</span>To play the media you will need to either update your browser to a recent version or update your <a href='http://get.adobe.com/flashplayer/' target='_blank'>Flash plugin</a>" +
            "</div>" +
          "</div>" +
      "</div>";


var me = {
    playlistStore : Ext.create('Ext.data.Store', {
        // store configs
        autoDestroy: true,
        sorters: 'name',
        storeId: 'playlistStore',
        grouper: {
           groupFn: function(record) {
                try{
                    return record.get('name');
                }catch(e){
                    return "";
                }
           }
        },
        data:[{name:"2012"} , {name:"2013"}]
    }),

    tracksStore : Ext.create('Ext.data.Store', {
        // store configs
        autoDestroy: true,
        sorters: 'name',
        storeId: 'tracksStore',
        grouper: {
           groupFn: function(record) {
                try{
                    return record.get('name')[0];
                }catch(e){
                    return "";
                }
           }
        },
        data:[{name:"2012"} , {name:"2013"}]
    }),

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
    
    updateStatus: function(trackNo, playlist){
        var me = this;
        var cmd = appBaseUrl+'?userName='+userName+'&command=status';
        if(trackNo && trackNo !== "" && playlist && playlist !== ""){
            cmd =appBaseUrl+'?userName='+userName+'&command=trackinfo ' + trackNo + " " + playlist;
        }/*else if(me.playLocally  && playerContext == "SYSTEM_PLAYLIST" && !me.inSyncWithItunes){
            cmd =appBaseUrl+'?userName='+userName+'&command=trackinfo ' + localSongIndex + " " + userPlayList;
        }else if(me.playLocally && playerContext == "USER_PLAYLIST" && !me.inSyncWithItunes){
            var plgrd = Ext.getCmp('user-playlist-grid');
            var recIn = plgrd.songId;
            cmd =appBaseUrl+'?userName='+userName+'&command=trackinfo ' + recIn + " " + userPlayList;
        }*/
        Ext.Ajax.request({
            url: cmd,
            method: 'GET',
            success: function(resp){
                var respObj = Ext.decode(resp.responseText);
                var status = "<b>" + respObj.title + "</b> by " + respObj.artist;// + " " + respObj.album + ((respObj.year) ? " <i>(" + respObj.year + ")</i>" : "");
                if(respObj.playlist && respObj.playlist != ""){
                    status += " from playlist <b>" + respObj.playlist + "</b>";
                }
                //Ext.get('jp-track-status').update(status);
                try{
                    Ext.getCmp('rtunes-mobile-nowplaying').setData(respObj);//.lyrics.replace(/\r\n|\n/, '<br />'));
                    /*if(respObj.lyrics.length > 15){
                        me.lyrics.expand("left", true);
                    }else{
                        me.lyrics.collapse('right', true);
                    }*/
                }catch(e){
                    if (Ext.getCmp('rtunes-mobile-nowplaying')){
                        Ext.getCmp('rtunes-mobile-nowplaying').setData("...");
                    }
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
            command     :   cmd,
            updateStatus:   false,
            success     :   function(response){
                try{
                    me.tracksStore.removeAll();
                }catch(e){
                    //
                }
                var resp = response.responseText.split(",");
                var records = []
                for(var i=0; i < resp.length; i++){
                    records.push({
                        "name"      :   resp[i].trim(), 
                        "component" :   pListName, 
                        "id"        :   i + 1
                    });
                }
                me.tracksStore.add(records);
                if(callback){
                    callback();
                }
            },
            failure     :   function(resp){
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
            command     :   'search ' + searchStr,
            updateStatus:   true,
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
    }
};
Ext.define('rTunesModel', {
    extend: 'Ext.data.Model',
    fields: ['name', 'id', 'component']
});

Ext.define('TrackInfo', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title', 'artist', 'album', 'director', 'lyrics', 'year', 'component']
});

var plySong = function(trackNo, playlist){
    var cmd = "trackLocation " + trackNo + " " + playlist;
    rTunesJQPlayer.setPlaylist([{
        mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
    }]);
    rTunesJQPlayer.play(0);
    me.updateStatus(trackNo, playlist);
};

Ext.define('rTunesMobile', {
    extend: 'Ext.Container',
    requires: ['Ext.tab.Panel'],
    config: {
        fullscreen: true,
        layout: 'fit',
        listeners:{
            'painted' : function(view){
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
                rTunesJQPlayer.play(0);
                rTunesJQPlayer.pause(0);

                Ext.Ajax.request({
                    url: appBaseUrl+'?responseType=json&userName='+userName+'&command=playlist',
                    method: 'GET',
                    success: function(response){
                        startChat();
                        response.responseText = response.responseText.replace(/\[H|\[2J/gi, "");
                        var resp = response.responseText.split(",");
                        for(var i=0; i < resp.length; i++){
                            me.playlistStore.add({name:resp[i].trim()});
                        }
                        me.updateStatus();
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
                //var task = {
                //    run: function(){
                //        //me.updateStatus();
                //    },
                //    interval: 90000 //90 sec
                //}
                //Ext.TaskManager.start(task);
            }
        },
        items: [{
            //first we define the xtype, which is tabpanel for the Tab Panel component
            xtype: 'tabpanel',
            id:'rtunes-mobile-layout',
            //now we specify the tabBar configuration and give it a docked property of bottom
            //this will dock the tabbar of this tabpanel to the bottom
            tabBar: {
                docked: 'bottom'
            },

            //here we specify the ui of the tabbar to light
            ui: 'light',

            //defaults allow us to add default configuratons for each of the items added into
            //this container. adding scrollable true means that all items in this tabpanel will
            //be scrollable unless otherwise specified in the item configuration
            defaults: {
                scrollable: true
            },

            //next we define the items that will appear inside our tab panel
            items: [{
                    docked: 'top',
                    xtype: 'toolbar',
                    height: 80,
                    items: [{
                        xtype: 'component',
                        html: playerHtmlTemplate//'Pandora<br>Internet Radio'
                    }]
                },{
                    //each item in a tabpanel requires the title configuration. this is displayed
                    //on the tab for this item
                    title: 'Now Playing',
                    id:'rtunes-mobile-nowplaying',
                    cls:'rtunes-track-info',
                    tpl:Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                                '<span class="label">Title : </span><span class="value">{title}</span></br>',
                                '<span class="label">Artist : </span><span class="value">{artist}</span></br>',
                                '<span class="label">Album : </span><span class="value">{album}</span></br>',
                                '<span class="label">Album Artist : </span><span class="value">{director}</span></br>',
                                '<span class="label">Year Released: </span><span class="value">{year}</span></br>',
                                '<span class="label">Grouping : </span><span class="value">{grouping}</span></br>',
                                '<span class="label">Lyrics : </span><span class="value">{lyrics}</span></br>',
                            '</tpl>'
                    ),
                    autoScroll:true,
                    //specify the html to be displayed in this item
                    //html: 'In Progress',//<h1>Bottom Tabs</h1><p>Docking tabs to the bottom will automatically change their style. The tabs below are type="light" (default type is "dark"). Badges (like the 4 &amp; Long title below) can be added by setting <code>badgeText</code> when creating a tab/card or by using <code>setBadge()</code> on the tab later.</p>',
                    //the iconCls is the cls of the icon to be used on the tab (only works when the tab
                    //bar is docked to the bottom)
                    iconCls: 'info',
                    //custom cls to be added to the item
                    cls: 'card1'
                },
                {
                    title: 'Playlists',
                    //html: '<h1>Playlist goes here</h1>',
                    //items:[{
                    xtype:'list',
                    itemTpl: '<div class="value">{name}</div>',
                    store: me.playlistStore,
                    grouped: true,
                    indexBar    : true,
                    hideOnMaskTap: false,
                    listeners:{
                        'itemtap'   :   function(list, index, target, record, e, eOpts){
                            me.currentPlaylist = record.data.name;
                            me.loadPlaylist(me.currentPlaylist, function(){
                                var tracks = Ext.getCmp('rtunes-mobile-tracks');
                                tracks.show(true);
                                Ext.getCmp('rtunes-mobile-layout').setActiveItem(tracks);
                            });
                        }
                    },
                    //}],
                    iconCls: 'favorites',
                    cls: 'card2',

                    //the badgetext configuration allows us to add a badge/tooltip onto the tab
                    //this is useful when you want to notify users of new content in an unactive tab
                    badgeText: ''
                },
                {
                    title: 'Tracks',
                    id:'rtunes-mobile-tracks',
                    xtype:'list',
                    itemTpl: '<div class="value">{name}</div>',
                    store: me.tracksStore,
                    grouped: true,
                    indexBar    : true,
                    hideOnMaskTap: false,
                    listeners:{
                        'itemtap'   :   function(list, index, target, record, e, eOpts){
                            var recId = record.data.id;
                            var plist = me.currentPlaylist.trim().replace(/\s/gi, "^");
                                var cmd = "trackLocation " + recId + " " + plist;
                                rTunesJQPlayer.setPlaylist([{
                                    mp3 : appBaseUrl+'?userName='+userName+'&command='+ cmd
                                }]);
                                rTunesJQPlayer.play(0);
                                me.updateStatus(recId, plist);
                                var status = Ext.getCmp('rtunes-mobile-nowplaying');
                                status.show(true);
                                Ext.getCmp('rtunes-mobile-layout').setActiveItem(status);
                            //me.currentPlaylist = record.data.name;
                            //me.loadPlaylist(me.currentPlaylist, function(){
                                //myMask.hide();
                                //myMask.destroy();
                           // });
                        }
                    },
                    //}],
                    iconCls: 'favorites',
                    cls: 'card2',

                    //the badgetext configuration allows us to add a badge/tooltip onto the tab
                    //this is useful when you want to notify users of new content in an unactive tab
                    badgeText: ''
                },
                {
                    title: 'Settings',
                    html: '<h1>Settings In Progress</h1>',
                    iconCls: 'settings',
                    cls: 'card4'
                },
                {
                    title: 'Chat',
                    height:250,
                    border:false,
                    cls:'rtunes-console',
                    autoScroll:true,
                    bbar:[{
                        xtype   :   'textfield',
                        id      :   'rtunes-chat-data',
                        name    :   'data',
                        enableKeyEvents:true,
                        listeners   :   {
                            scope   :   me,
                            'keypress': function(field,e){
                                var key = e.getKey();
                                if(key === e.ENTER){
                                    var message = Ext.getCmp('rtunes-chat-data');
                                    doSendMessage(message.getValue());
                                    message.setValue('');
                                }
                            }
                        },
                        width   :   '80%',
                        emptyText:  'Type your message...'
                    },{
                        xtype   :   'button',
                        id      :   'datasend',
                        text    :   'Send',
                        handler :   function(){
                            var message = Ext.getCmp('rtunes-chat-data');
                            doSendMessage(message.getValue());
                            message.setValue('');
                        }
                    }],
                    html:'<div><div id="rooms"></div></div><div id="conversation"></div></div>',
                    iconCls: 'user',
                    cls: 'card5'
                }
            ]
        }]
    }
});




var startChat = function(){
/***
 *
 *  Chat application using socket io
 *
 */

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
                    trackNo     :   localSongIndex,
                    playlist    :   userPlayList
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
                    trackNo     :   rec.data.id,
                    playlist    :   rec.data.component
                };
            }
            window.socket.emit('play', cmd);
        } else {
            // tell server to execute 'sendchat' and send along one parameter
            window.socket.emit('sendchat', message);
        }
    };
    // on load of page
    /*
    $(function() {
        // when the client clicks SEND
        $('#datasend').click(function() {
                    var message = $('#data').val();
                    $('#data').val('');
                    doSendMessage(message);
                });

        // when the client hits ENTER on their keyboard
        $('#data').keypress(function(e) {
                    if (e.which == 13) {
                        var message = $('#data').val();
                        $('#data').val('');
                        doSendMessage(message);
                        $(this).blur();
                        $('#data').focus().click();
                    }
                });
    });*/

};