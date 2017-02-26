// @flow

import React from 'react';
import {connect} from 'react-redux';
import Debug from 'debug';

import Node from './node';
import IIP from './iip';
import Edge from './edge';
import Group from "./group";

const debug = Debug('graph:raw-graph');
const NODE_SIZE = 72;

type Props = {

};
class RawGraph extends React.Component {

  constructor(props) {
    super(props);
    debug('raw graph initialized');
  }
  render() {
    const nodes = this.props.nodes.map(node => <Node key={node.id} {...node} />);
    const rawNodes = this.props.rawGraph.nodes;
    const getNodeById = id => {
      for (let i = 0; i < rawNodes.length; i++) {
        if (rawNodes[i].id === id) {
          return rawNodes[i];
        }
      }
      return null;
    };
    const edges = this.props.rawGraph.edges.map(edge => {
      const src = getNodeById(edge.from.node);
      const dst = getNodeById(edge.to.node);
      return <Edge
        route={edge.metadata.route}
        key={edge.from.node + edge.to.node}
        sX={src.metadata.x + NODE_SIZE}
        sY={src.metadata.y + NODE_SIZE * 0.5}
        tX={dst.metadata.x}
        tY={dst.metadata.y + NODE_SIZE * 0.5}/>;
    });

    const iips = this.props.rawGraph.initializers.map(iip => {
      // const src = getNodeById(edge.from.node);
      const dst = getNodeById(iip.to.node);
      return (<IIP key={iip.from + iip.to} x={dst.metadata.x} y={dst.metadata.y} label={iip.from.data} />);
    });

    const _inports = this.props.rawGraph.inports;
    const inports = Object.keys(_inports).map(key => {
      const port = _inports[key];
              var label = key;
        var nodeKey = port.process;
        var portKey = port.port;
        if (!port.metadata) { 
          port.metadata = {x:0, y:0}; 
        }
        var metadata = port.metadata;
        if (!metadata.x) { metadata.x = 0; }
        if (!metadata.y) { metadata.y = 0; }
        if (!metadata.width) { metadata.width = NODE_SIZE; }
        if (!metadata.height) { metadata.height = NODE_SIZE; }

        //nodes.push(<Node key={`inport.node.${key}`} {...port}/>);

    });

    const groups = this.props.groups.map(group => <Group {...group}/>);

    return (
      <g>
        {groups}
        {edges}
        {iips}
        {nodes}
      </g>
    );
  }

}

function mapStateToProps(state) {
  return state.graph;
}
export default connect(mapStateToProps, null)(RawGraph);
