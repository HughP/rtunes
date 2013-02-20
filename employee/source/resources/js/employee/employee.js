Ext.define('Employee.App', {
    extend: 'Ext.container.Viewport',
    initComponent: function(){
		var store = new Ext.data.JsonStore({
		    // store configs
		    storeId: 'employee-store',
		    autoLoad:true,
		    proxy: {
		        type: 'ajax',
		        url: 'ViewUserDetailAction.do',
		        reader: {
		            type: 'json',
		            root: 'records',
		            idProperty: 'userId'
		        }
		    },
	
		    //alternatively, a Ext.data.Model name can be given (see Ext.data.Store for an example)
		    fields: ['userName', 'firstName', 'lastName']
		});
		
		var myGrid = Ext.create('Ext.grid.Panel', {
			store : store,
			title: 'Employee List',
			region:'center',
		    forceFit:true,
		    columns: [
		        { text: 'ID',  dataIndex: 'userName' },
		        { text: 'First Name', dataIndex: 'firstName'},
		        { text: 'Last Name', dataIndex: 'lastName' }
		    ]
		})

        Ext.apply(this, {
        	layout:'border',
            items: [{
            	region:'north',
            	title:'Search header'
            },{
            	region:'west',
            	title:'Filter By'
            },myGrid]
        });
        this.callParent(arguments);
    }
});
