import Act from '../actions/Types';

const InitialState = {
  rawGraph: {
    nodes: []
  },
  graph: null,
  components: {},
  loading: false,
  ready: false,
  nodeSize: 72,
  scale: 1,
  width: window.innerWidth,
  height: window.innerHeight,
  fit: {

  }
};

export default function graphReducer(state = InitialState, action) {
  switch (action.type) {
    case Act.LOAD_GRAPH_WAITING:
      return {...state, loading: true};
    case Act.LOAD_GRAPH_SUCCESS:
      return {...state,
        rawGraph: action.payload,
        components: componentsFromGraph(action.payload),
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
    return {x: 0, y: 0, scale: 1};
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
    y = 0 - limits.minY * scale + (height - (gHeight * scale)) / 2;
  } else {
    scale = scaleY;
    x = 0 - limits.minX * scale + (width - (gWidth * scale)) / 2;
    y = 0 - limits.minY * scale;
  }

  return {
    x,
    y,
    scale
  };
};

const findMinMax = (graph, nodes?) => {
  let inports, outports;
  if (nodes === undefined) {
    nodes = graph.nodes.map(node => node.id);
      // Only look at exports when calculating the whole graph
    inports = graph.inports;
    outports = graph.outports;
  }
  if (nodes.length < 1) {
    return undefined;
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

    // Loop through nodes
  let len = nodes.length;
  for (var i = 0; i < len; i++) {
    const key = nodes[i];
    const node = graph.getNode(key);
    if (!node || !node.metadata) {
      continue;
    }
    if (node.metadata.x < minX) {
      minX = node.metadata.x;
    }
    if (node.metadata.y < minY) {
      minY = node.metadata.y;
    }
    const x = node.metadata.x + node.metadata.width;
    const y = node.metadata.y + node.metadata.height;
    if (x > maxX) {
      maxX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
  }
    // Loop through exports
  let keys, exp;
  if (inports) {
    keys = Object.keys(inports);
    len = keys.length;
    for (i = 0; i < len; i++) {
      exp = inports[keys[i]];
      if (!exp.metadata) {
        continue;
      }
      if (exp.metadata.x < minX) {
        minX = exp.metadata.x;
      }
      if (exp.metadata.y < minY) {
        minY = exp.metadata.y;
      }
      if (exp.metadata.x > maxX) {
        maxX = exp.metadata.x;
      }
      if (exp.metadata.y > maxY) {
        maxY = exp.metadata.y;
      }
    }
  }
  if (outports) {
    keys = Object.keys(outports);
    len = keys.length;
    for (i = 0; i < len; i++) {
      exp = outports[keys[i]];
      if (!exp.metadata) {
        continue;
      }
      if (exp.metadata.x < minX) {
        minX = exp.metadata.x;
      }
      if (exp.metadata.y < minY) {
        minY = exp.metadata.y;
      }
      if (exp.metadata.x > maxX) {
        maxX = exp.metadata.x;
      }
      if (exp.metadata.y > maxY) {
        maxY = exp.metadata.y;
      }
    }
  }

  if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
    return null;
  }
  return {
    minX,
    minY,
    maxX,
    maxY
  };
};

const componentsFromGraph = fbpGraph => {
  const components = [];

  fbpGraph.nodes.forEach(node => {
    const component = {
      name: node.component,
      icon: 'cog',
      description: '',
      inports: [],
      outports: []
    };

    Object.keys(fbpGraph.inports).forEach(pub => {
      const exported = fbpGraph.inports[pub];
      if (exported.process === node.id) {
        for (let i = 0; i < component.inports.length; i++) {
          if (component.inports[i].name === exported.port) {
            return;
          }
        }
        component.inports.push({
          name: exported.port,
          type: 'all'
        });
      }
    });
    Object.keys(fbpGraph.outports).forEach(pub => {
      const exported = fbpGraph.outports[pub];
      if (exported.process === node.id) {
        for (let i = 0; i < component.outports.length; i++) {
          if (component.outports[i].name === exported.port) {
            return;
          }
        }
        component.outports.push({
          name: exported.port,
          type: 'all'
        });
      }
    });
    fbpGraph.initializers.forEach(iip => {
      if (iip.to.node === node.id) {
        for (let i = 0; i < component.inports.length; i++) {
          if (component.inports[i].name === iip.to.port) {
            return;
          }
        }
        component.inports.push({
          name: iip.to.port,
          type: 'all'
        });
      }
    });

    fbpGraph.edges.forEach(edge => {
      let i;
      if (edge.from.node === node.id) {
        for (i = 0; i < component.outports.length; i++) {
          if (component.outports[i].name === edge.from.port) {
            return;
          }
        }
        component.outports.push({
          name: edge.from.port,
          type: 'all'
        });
      }
      if (edge.to.node === node.id) {
        for (i = 0; i < component.inports.length; i++) {
          if (component.inports[i].name === edge.to.port) {
            return;
          }
        }
        component.inports.push({
          name: edge.to.port,
          type: 'all'
        });
      }
    });
    components.push(component);
  });
  return components;
};
