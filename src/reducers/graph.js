// @flow

import Act from '../actions/Types';
import Debug from "debug";

const debug = Debug("graph:reducer:graph");
let portInfo = {};
const NODE_SIZE = 72;

type State = {
  rawGraph: any;
  graph: ?any;
  components: ?any;
  loading: boolean;
  ready: boolean;
  nodeSize: number;
  nodes: any[];
  group: any[];
  scale: number;
  width: number;
  height: number;
  fit: any;
};

const InitialState: State = {
  rawGraph: {
    nodes: [],
    edges: [],
    initializers: [],
    inports: [],
    outports: []
  },
  graph: null,
  components: {},
  loading: false,
  ready: false,
  nodeSize: 72,
  nodes: [],
  groups: [],

  scale: 1,
  width: window.innerWidth,
  height: window.innerHeight,
  fit: {

  }
};

export default function graphReducer(state: State = InitialState, action) {
  switch (action.type) {
    case Act.LOAD_GRAPH_WAITING:
      return {...state, loading: true};
    case Act.LOAD_GRAPH_SUCCESS:
      const components = componentsFromGraph(action.payload);
      return {...state,
        rawGraph: action.payload,
        nodes: resolveNode(action.payload, components),
        groups: resolveGroup(action.payload),
        components,
        loading: false,
        ...findFit(action.payload, state)
      };
    default:
      return state;
  }
}

const resolveGroup = (graph) => {
  return graph.groups.map(group => {
    debug(group);
    if (group.nodes.length < 1) {
      return null;
    }
    const limits = findMinMax(graph, group.nodes);
    debug("limits: ", limits);
    if (!limits) {
      return null;
    }
    return {
      ...group,
      ...limits,
      key: `group.${group.name}`
    };
  }).filter(Boolean);

};

const resolveNode = (graph, components) => {
  const nodes = graph.nodes;
  const getNodeById = id => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        return nodes[i];
      }
    }
    return null;
  };
  const getComponent = name => {
    for (let i = 0; i < components.length; i++) {
      if (components[i].name === name) {
        return components[i];
      }
    }
    return null;
  };
  const getPorts = (processName, componentName) => {
    const node = getNodeById(processName);
    let ports = portInfo[processName];

      if (!ports) {
        const inports = {};
        const outports = {};
        if (componentName) {
          // Copy ports from library object
          const component = getComponent(componentName);
          if (!component) {
            return {
              inports: inports,
              outports: outports
            };
          }

          let i, port, len;
          const metadata = { width: 72, height: 72, ...node.metadata };
          for (i=0, len=component.outports.length; i<len; i++) {
            port = component.outports[i];
            if (!port.name) { continue; }
            outports[port.name] = {
              label: port.name,
              type: port.type,
              x: metadata.width,
              y: metadata.height / (len+1) * (i+1)
            };
          }

          for (i=0, len=component.inports.length; i<len; i++) {
            port = component.inports[i];
            if (!port.name) { continue; }
            inports[port.name] = {
              label: port.name,
              type: port.type,
              x: 0,
              y: metadata.height / (len+1) * (i+1)
            };
          }
        }
        ports = {
          inports: inports,
          outports: outports
        };
        portInfo[processName] = ports;
      }
      return ports;
  };
  return graph.nodes.map(node => {
    debug(node);
    return {
      //ports: getPorts(node.id, node.component),
      ports: {
        outports: [],
        inports: []
      },
      ...node.metadata
    };
  });
};



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
    const x = node.metadata.x + NODE_SIZE;
    const y = node.metadata.y + NODE_SIZE;
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
