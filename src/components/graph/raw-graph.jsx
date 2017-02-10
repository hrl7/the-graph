// @flow

import React from "react";
import { connect } from "react-redux";
import Debug from "debug";

import Node from "./node";
const debug = Debug("graph:raw-graph");

type Props = {

};
class RawGraph extends React.Component {

  constructor(props) {
    super(props);
    debug("raw graph initialized");
  }
  render() {
    const nodes = this.props.rawGraph.nodes.map(node => {
      return <Node key={node.id} {...node} />;
    });
    debug(nodes);
    return (
      <g>
        <text stroke="white"> raw graph</text>
        {nodes}
      </g>
    );
  }

}

function mapStateToProps(state) {
  return state.graph;
}
export default connect(mapStateToProps, null)(RawGraph);