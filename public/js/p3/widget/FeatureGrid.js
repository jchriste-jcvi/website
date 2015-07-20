define([
	"dojo/_base/declare","dijit/layout/BorderContainer","dojo/on",
	"dojo/dom-class","dijit/layout/ContentPane","dojo/dom-construct",
	"./PageGrid","./formatter"
], function(
	declare, BorderContainer, on,
	domClass,ContentPane,domConstruct,
	Grid,formatter
){
	return declare([Grid], {
		region: "center",
		query: (this.query||""),
		apiToken: window.App.authorizationToken,
		apiServer: window.App.dataAPI,
		dataModel: "genome_feature",
		primaryKey: "feature_id",
		deselectOnRefresh: true,
		columns: {
			genome_name: {label: "Genome Name", field: "genome_name", hidden: false},
			accession: {label: "Accession", field: "accession", hidden: true},
			patric_id: {label: "PATRIC ID", field: "patric_id", hidden: false},
			refseq_locus_tag: {label: "RefSeq Locus Tag", field: "refseq_locus_tag", hidden: false},
			alt_locus_tag: {label: "Alt Locus Tag", field: "alt_locus_tag", hidden: false},
			feature_id: {label: "Feature ID", field: "feature_id", hidden: true},
			annotation: {label: "Annotation", field: "annotation", hidden: true},
			feature_type: {label: "Feature Type", field: "feature_type", hidden: true},
			start: {label: "Start", field: "start", hidden: true},
			end: {label: "END", field: "end", hidden: true},
			na_length: {label: "NA Length", field: "na_length", hidden: true},
			strand: {label: "Strand", field: "strand", hidden: true},
			protein_id: {label: "Protein ID", field: "protein_id", hidden: true},
			aa_length: {label: "AA Length", field: "aa_length", hidden: true},
			gene: {label: "Gene Symbol", field: "gene", hidden: false},
			product: {label: "Product", field: "product", hidden: false}
		},
		startup: function(){
				var _self = this
                                this.on(".dgrid-content .dgrid-row:dblclick", function(evt) {
                                    var row = _self.row(evt);
                                    console.log("dblclick row:", row)
                                        on.emit(_self.domNode, "ItemDblClick", {
                                                item_path: row.data.path,
                                                item: row.data,
                                                bubbles: true,
                                                cancelable: true
                                        });
                                        console.log('after emit');
                                    //if (row.data.type == "folder"){
                //                              Topic.publish("/select", []);

                //                              Topic.publish("/navigate", {href:"/workspace" + row.data.path })
                //                              _selection={};
                                        //}
                                });
                                //_selection={};
                                //Topic.publish("/select", []);

                                this.on("dgrid-select", function(evt) {
                                        console.log('dgrid-select: ', evt);
                                        var newEvt = {
                                                rows: evt.rows,
                                                selected: evt.grid.selection,
                                                grid: _self,
                                                bubbles: true,
                                                cancelable: true
                                        }
                                        on.emit(_self.domNode, "select", newEvt);
                                        //console.log("dgrid-select");
                                        //var rows = evt.rows;
                                        //Object.keys(rows).forEach(function(key){ _selection[rows[key].data.id]=rows[key].data; });
                                        //var sel = Object.keys(_selection).map(function(s) { return _selection[s]; });
                                        //Topic.publish("/select", sel);
                                });
                                this.on("dgrid-deselect", function(evt) {
                                        console.log("dgrid-select");
                                        var newEvt = {
                                                rows: evt.rows,
                                                selected: evt.grid.selection,
                                                grid: _self,
                                                bubbles: true,
                                                cancelable: true
                                        }
                                        on.emit(_self.domNode, "deselect", newEvt);
                                        return;
                                });
				this.inherited(arguments);
				this.refresh();
		}
	});
});
