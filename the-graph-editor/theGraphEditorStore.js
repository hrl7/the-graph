export default class GraphEditorStore {



  constructor (initialState = {}){
    this.state = Object.assign({}, {
    graph : null,
    grid : 72,
    snap : 36,
    width : 800,
    height : 600,
    scale : 1,
    plugins : {},
    fbpGraph : null,
    menus : null,
    autolayout : false,
    theme: "dark",
    selectedNodes: [],
    copyNodes: [],
    errorNodes: {},
    selectedEdges: [],
    animatedEdges: [],
    displaySelectionGroup: true,
    forceSelection: false
    }, initialState);
  }

  get state() {
    return this.state;
  }
  addPlugin(name, plugin){
    plugins[name] = plugin;
    plugin.register(this);
  }

  addMenu(type, options) {
  // options: icon, label
    menus[type] = options;
  }
  addMenuCallback(type, callback) {
    if (!menus[type]) {
      return;
    }
    menus[type].callback = callback;
  }
  addMenuAction(type, direction, options) {
    if (!menus[type]) {
      menus[type] = {};
    }
    var menu = menus[type];
    menu[direction] = options;
  }
  getMenuDef(options) {
  // Options: type, graph, itemKey, item
  if (options.type && menus[options.type]) {
    const defaultMenu = menus[options.type];
    if (defaultMenu.callback) {
      return defaultMenu.callback(defaultMenu, options);
    }
    return defaultMenu;
  }
  return null;
  }
  widthChanged() {
  style.width = width + "px";
};
heightChanged () {
  style.height = height + "px";
}
graphChanged() {
  if (typeof graph.addNode === 'function') {
    buildInitialLibrary(graph);
    fbpGraph = graph;
    return;
  }

  var fbpGraph;
  if ('fbpGraph' in window) {
    fbpGraph = window.fbpGraph;
  }

  if (!fbpGraph && 'require' in window) {
    fbpGraph = require('fbp-graph');
  }
  if (!fbpGraph) {
    console.warn('Missing fbp-graph dependency! Should be built with Webpack/Browserify to require it, or accessible on window');
    return;
  }

  fbpGraph.graph.loadJSON(graph, function(err, graph){
    buildInitialLibrary(graph);
    fbpGraph = graph;
    fire('graphInitialised', this);
  }.bind(this));
}
buildInitialLibrary(fbpGraph) {
  /*if (Object.keys($.graph.library).length !:: 0) {
    // We already have a library, skip
    // TODO what about loading a new graph? Are we making a new editor?
    return,
  }*/
  var components = TheGraph.library.componentsFromGraph(fbpGraph);
  components.forEach(function(component) {
      registerComponent(component, true);
  }.bind(this));
}

registerComponent (definition, generated) {
   graph.registerComponent(definition, generated);
 }
libraryRefresh() {
  graph.debounceLibraryRefesh();
}
updateIcon (nodeId, icon) {
  graph.updateIcon(nodeId, icon);
}
rerender () {
  graph.rerender();
}
triggerAutolayout () {
  graph.triggerAutolayout();
}
triggerFit () { $.graph.triggerFit(); }
animateEdge(edge) {
  // Make sure unique
  const index = animatedEdges.indexOf(edge);
  if (index === -1) {
    animatedEdges.push(edge);
  }
}
unanimateEdge(edge){
  const index = animatedEdges.indexOf(edge);
  if (index >= 0) {
    animatedEdges.splice(index, 1);
  }
}
addErrorNode(id) {
  errorNodes[id] = true;
  updateErrorNodes();
}
removeErrorNode(id){
  errorNodes[id] = false;
  updateErrorNodes();
}
clearErrorNodes() {
  errorNodes = {};
  updateErrorNodes();
}
updateErrorNodes(){ return $.graph.errorNodesChanged(); }
focusNode(node){ return $.graph.focusNode(node); }
getComponent(name) { return $.graph.getComponent(name);}
getLibrary(){ return $.graph.library; }
toJSON(){ return fbpGraph.toJSON(); }
}
