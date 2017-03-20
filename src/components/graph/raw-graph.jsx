// @flow

import React from 'react';
import {connect} from 'react-redux';
import Debug from 'debug';

import Node from './node';
import IIP from './iip';
import Edge from './edge';
import Group from "./group";

import { InPort } from "../type";

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
/*
    const inports = Object.keys(_inports).map(key => {
      const port: InPort = _inports[key];
      const label = key;
      const nodeKey = port.process;
      const portKey = port.port;
        if (!port.metadata) {
          port.metadata = {x:0, y:0};
        }
        if (!port.x) { port.x = 0; }
        if (!port.y) { port.y = 0; }
        if (!port.width) { port.width = NODE_SIZE; }
        if (!port.height) { port.height = NODE_SIZE; }

        //nodes.push(<Node key={`inport.node.${key}`} {...port}/>);

    });
    */
    const nodes = this.props.nodes.map(node => <Node key={node.id} {...node} />);
    const iips = this.props.iips.map(iip => <IIP {...iip}/>);
    const inports = this.props.inports.map(inport => <InPort {...inport}/>);

    const edges = this.props.edges.map(edge => <Edge {...edge}/>);
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
