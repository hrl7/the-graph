import Act from "../actions/Types";

const InitialState = {
  graph: null,
  loading: false,
  ready: false,
  nodeSize: 72,
  scale: 1,
  width: window.innerWidth,
  height: window.innerHeight,
  fit: {

  }
};

export default function graphReducer(state=InitialState, action){
  switch(action.type) {
    case Act.LOAD_GRAPH_WAITING:
      return {...state, loading: true};
    case Act.LOAD_GRAPH_SUCCESS:
      return {...state, 
       graph: action.payload, 
       loading: false,
       ...findFit(action.payload, state)
      };
    default: 
      return state;
  }
}

const findFit = (graph, {width, height, nodeSize}) => {
    const limits = findMinMax(graph);
    if (!limits) {
      return {x:0, y:0, scale:1};
    }
    limits.minX -= nodeSize;
    limits.minY -= nodeSize;
    limits.maxX += nodeSize * 2;
    limits.maxY += nodeSize * 2;

    const gWidth = limits.maxX - limits.minX;
    const gHeight = limits.maxY - limits.minY;

    const scaleX = width / gWidth;
    const scaleY = height / gHeight;

    let scale, x, y;
    if (scaleX < scaleY) {
      scale = scaleX;
      x = 0 - limits.minX * scale;
      y = 0 - limits.minY * scale + (height-(gHeight*scale))/2;
    } else {
      scale = scaleY;
      x = 0 - limits.minX * scale + (width-(gWidth*scale))/2;
      y = 0 - limits.minY * scale;
    }

    return {
      x: x,
      y: y,
      scale: scale
    };
}

const findMinMax = (graph, nodes?) => {
    let inports, outports;
    if (nodes === undefined) {
      nodes = graph.nodes.map( function (node) {
        return node.id;
      });
      // Only look at exports when calculating the whole graph
      inports = graph.inports;
      outports = graph.outports;
    }
    if (nodes.length < 1) {
      return undefined;
    }
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    // Loop through nodes
    var len = nodes.length;
    for (var i=0; i<len; i++) {
      var key = nodes[i];
      var node = graph.getNode(key);
      if (!node || !node.metadata) {
        continue;
      }
      if (node.metadata.x < minX) { minX = node.metadata.x; }
      if (node.metadata.y < minY) { minY = node.metadata.y; }
      var x = node.metadata.x + node.metadata.width;
      var y = node.metadata.y + node.metadata.height;
      if (x > maxX) { maxX = x; }
      if (y > maxY) { maxY = y; }
    }
    // Loop through exports
    var keys, exp;
    if (inports) {
      keys = Object.keys(inports);
      len = keys.length;
      for (i=0; i<len; i++) {
        exp = inports[keys[i]];
        if (!exp.metadata) { continue; }
        if (exp.metadata.x < minX) { minX = exp.metadata.x; }
        if (exp.metadata.y < minY) { minY = exp.metadata.y; }
        if (exp.metadata.x > maxX) { maxX = exp.metadata.x; }
        if (exp.metadata.y > maxY) { maxY = exp.metadata.y; }
      }
    }
    if (outports) {
      keys = Object.keys(outports);
      len = keys.length;
      for (i=0; i<len; i++) {
        exp = outports[keys[i]];
        if (!exp.metadata) { continue; }
        if (exp.metadata.x < minX) { minX = exp.metadata.x; }
        if (exp.metadata.y < minY) { minY = exp.metadata.y; }
        if (exp.metadata.x > maxX) { maxX = exp.metadata.x; }
        if (exp.metadata.y > maxY) { maxY = exp.metadata.y; }
      }
    }

    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
      return null;
    }
    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY
    };
};


