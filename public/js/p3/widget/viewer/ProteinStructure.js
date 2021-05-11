define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom-construct',
  'dojo/ready',
  '../proteinStructure/ProteinStructureState',
  '../proteinStructure/ProteinStructure',
  'dojo/data/ItemFileReadStore',
  'dojo/store/DataStore',
  './Base',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!../templates/proteinStructure/ProteinStructureViewer.html',
  '../../util/dataStoreHelpers'
],
function (
  declare,
  lang,
  domConstruct,
  ready,
  ProteinStructureState,
  ProteinStructureDisplay,
  ItemFileReadStore,
  DataStore,
  Base,
  Templated,
  WidgetsInTmeplateMixin,
  templateString,
  dataStoreHelpers
)
{
  return declare([Base, Templated, WidgetsInTmeplateMixin], {
    id: 'proteinStructureViewer',
    className: 'ProteinStructureViewer',
    templateString: templateString,
    jsmol: null,
    viewState: new ProteinStructureState({}),
    state: {},
    postCreate: function () {
      // console.log('starting ' + this.id + '.postCreate');

      this.proteinStore =   new ItemFileReadStore({
        url: '/public/js/p3/resources/jsmol/SARS-CoV-2.json'
      });
      this.displayTypeStore = new ItemFileReadStore({
        url: '/public/js/p3/resources/jsmol/display-types.json'
      });

      // the JMol viewer object
      this.jsmol = new ProteinStructureDisplay({
        id: this.id + '_structure',
      });

      domConstruct.place(this.jsmol.getViewerHTML(), this.contentDisplay);

      this.watch('viewState', lang.hitch(this, function (attr, oldValue, newValue) {
        this.onViewStateChange(newValue);
      }));

      this.getInitialViewState().then(lang.hitch(this, function (viewData) {
        var viewState = new ProteinStructureState({});
        // console.log('viewData for initialViewState is ' + JSON.stringify(viewData));
        viewState.set('displayType', viewData[0]);
        viewState.set('accession', viewData[1]);
        viewState.set('zoomLevel', viewData[2]);
        let highlights = new Map([
          ['ligands', new Map()],
          ['epitopes', new Map()],
          ['features', new Map()]
        ]);
        viewState.set('highlights', highlights);
        // console.log('initial viewstate is ' + JSON.stringify(viewState));
        this.set('viewState', viewState);
      }));
    },
    onViewStateChange: function (viewState) {
      // console.log('updating viewState for child objects to ' + JSON.stringify(viewState));
      this.updateFromViewState(viewState);
    },
    updateFromViewState: function (viewState) {
      this.jsmol.set('viewState', viewState);
    },
    viewDefaults: new Map([
      ['accession', '6VXX'],
      ['displayType', 'cartoon'],
      ['zoomLevel', 100]
    ]),
    /**
    Get the initial view state using hash parameters or defaults as necessary
     */
    getInitialViewState: function () {
      const hashParams = (this.state && this.state.hashParams) || {};
      var dataPromises = [];
      let val = hashParams.displayType || this.viewDefaults.get('displayType');
      // console.log('get viewState.displayType record for ' + val);
      dataPromises.push(this.getDisplayTypeInfo(val));
      val = hashParams.accession || this.viewDefaults.get('accession');
      // console.log('get viewState.accession record for ' + val);
      dataPromises.push(this.getAccessionInfo(val));

      val = hashParams.zoomLevel || this.viewDefaults.get('zoomLevel') || 100;
      // console.log('get viewState.zoomLevel for ' + val);
      dataPromises.push(Promise.resolve(val));

      return Promise.all(dataPromises);
    },
    /*
    return a Promise with the information for displayType.
     */
    getDisplayTypeInfo: function (displayTypeId) {
      return dataStoreHelpers.itemByIdToPromise(this.displayTypeStore, displayTypeId);
    },
    /*
    Return a Promise for the protein accession information
     */
    getAccessionInfo: function (accessionId) {
      return dataStoreHelpers.itemByIdToPromise(this.proteinStore, accessionId);
    }
  });
});
