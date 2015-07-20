define([
	"dojo/_base/declare", "dijit/layout/BorderContainer", "dojo/on",
	"./ActionBar","./ContainerActionBar","dijit/layout/TabContainer",
	"dijit/layout/ContentPane"
], function(
	declare,BorderContainer,on,
	ActionBar, ContainerActionBar,TabContainer,
	ContentPane
){

	return declare([BorderContainer], {
		gutters: false,
		query: null,
		_setQueryAttr: function(query){
			this.query = query;
			if (this.grid) {
				this.grid.set("query", query);
			}
		},
		startup: function(){
			if (this._started) { return; }
			this.containerActionBar = new ContainerActionBar({region: "top",splitter:false, "className": "BrowserHeader"});
			this.selectionActionBar= new ActionBar({region: "right",layoutPriority:2, style:"width:48px;text-align:center;",splitter:false});
			this.tabContainer = new TabContainer({region:"center"});
			this.pfGrid= new ContentPane({title: "Table", content: "Protein Famlies Table"});
			this.heatmap= new ContentPane({title: "Heatmap", content: "Heatmap"});
			this.tabContainer.addChild(this.pfGrid);
			this.tabContainer.addChild(this.heatmap);

			this.addChild(this.containerActionBar);
			this.addChild(this.tabContainer);
			this.addChild(this.selectionActionBar);

			this.inherited(arguments);
		}
	});
});

