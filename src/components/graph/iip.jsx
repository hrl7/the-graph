// @flow

// Initial Information Packet

const CURVE = 50;

import React from "react";
import TextBG from "./text-bg";

  // Edge view

type Props = {
  x: number,
  y: number,
  label: string
};

export default class IIP extends React.Component {
  props: Props;
      constructor(props) {
        super(props);
      }
    shouldComponentUpdate(nextProps, nextState) {
      // Only rerender if changed
      return (
        nextProps.x !== this.props.x || 
        nextProps.y !== this.props.y ||
        nextProps.label !== this.props.label
      );
    }
    render() {
      const x = this.props.x,  y = this.props.y;

      // Make a string
      let label = this.props.label+"";
      // TODO make this smarter with ZUI
      if (label.length > 12) {
        label = label.slice(0, 9) + "...";
      }

    
    return (
      <g className="iip"
        title={this.props.label}>
        <path className="iip-path" d={`M ${x} ${y} L ${x-10} ${y}`}/>
        <TextBG       
          className="iip-info"
          height="5"
          halign="right"
          x={x - 10}
          y={y}>
          {label} 
        </TextBG>
      </g>
    );
  }
}
/*

      var target = graph.getNode(iip.to.node);
        if (!target) { return; }
        
        var targetPort = self.getNodeInport(graph, iip.to.node, iip.to.port, 0, target.component);
        var tX = target.metadata.x;
        var tY = target.metadata.y + targetPort.y;

        var data = iip.from.data;
        var type = typeof data;
        var label = data === true || data === false || type === "number" || type === "string" ? data : type;

        var iipOptions = {
          graph: graph,
          label: label,
          x: tX,
          y: tY
        };

        */