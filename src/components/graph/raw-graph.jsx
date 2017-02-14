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
    const nodes = this.props.nodes.map(node => {
      return <Node key={node.id} {...node} />;
    });
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
    });

    const groups = this.props.groups.map(group => {

        /*
        var groupOptions = {
          key: "group."+group.name,
          graph: graph,
          item: group,
          minX: limits.minX,
          minY: limits.minY,
          maxX: limits.maxX,
          maxY: limits.maxY,
          label: group.name,
          nodes: group.nodes,
          description: group.metadata.description,
          color: group.metadata.color,
        */
      return (<Group {...group}/>);
    });

    debug(this.props.groups);
    debug(groups);

    return (
      <g>
        <text stroke="white"> raw graph</text>
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
