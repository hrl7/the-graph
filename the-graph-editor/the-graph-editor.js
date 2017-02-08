// @flow


import React from "react";
import theGraph from "../src/components/Graph";
import fbpGraph from "fbp-graph";

type Props = {
  grid: number,
  snap: number,
  width: number,
  height: number,
  autolayout: boolean,
  theme: string,
  selectedNodes: any,
  errorNodes: any,
  selectedEdges: any,
  animatedEdges: any,
  onContextMenu?: any,
  displaySelectionGroup: any,
  forceSelection: any
};


export default class theGraphEditor extends React.Component {
  props: Props;
  pan: number[];

  constructor(props) {
    super(props);
    this.props = props;
    this.pan = [0,0];
    // TODO: add menu callback
    // this.menus = TheGraph.editor.getDefaultMenus(this);

  }

  componentWillUnmount() {

    for (var name in this.plugins) {
      this.plugins[name].unregister(this);
      delete this.plugins[name];
    }
  }


  render () {
    return (<theGraph id="graph"
      name="{{ graph.properties.name }}"
      graph="{{fbpGraph}}"
      menus="{{menus}}"
      width="{{width}}" height="{{height}}"
      pan="{{pan}}" scale="{{scale}}"
      autolayout="{{autolayout}}"
      theme="{{theme}}"
      selectedNodes="{{selectedNodes}}"
      errorNodes="{{errorNodes}}"
      selectedEdges="{{selectedEdges}}"
      animatedEdges="{{animatedEdges}}"
      displaySelectionGroup="{{displaySelectionGroup}}"
      forceSelection="{{forceSelection}}"
      getMenuDef="{{getMenuDef}}" />);
  }
};
