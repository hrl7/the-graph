// @flow
// from the-graph/the-graph.js Line 299

import React from "react";

type Props = {
  className: ?string,
  textClassName: ?string,
  src: string,
  x: number,
  y: number,
  width: number,
  height: number,
  halign: "center" | "right" | "bottom" | "top",
  text: ?string
};

  export default class TextBG extends React.Component {
    props: Props;
    constructor(props: Props){
      super(props);
      
      props.className = props.className || "text-bg-text";
      
      
      props.textClassName = props.textClassName || "text-bg-text";
      
      this.props = props;
    }
    render () {
      const text = this.props.text || "";

      const height = this.props.height;
      const width = text.length * this.props.height * 2/3;
      const radius = this.props.height/2;

      let textAnchor = "start";
      const dominantBaseline = "central";
      let x = this.props.x;
      const y = this.props.y - height/2;

      if (this.props.halign === "center") {
        x -= width/2;
        textAnchor = "middle";
      }
      if (this.props.halign === "right") {
        x -= width;
        textAnchor = "end";
      }
        <rect
          className={this.props.className}
          x={x}
          y={y}
          rx={radius}
          ry={radius}
          height={height * 1.1}
          width={width} >
          <text
            x={this.props.x}
            y={this.props.y}>
            {this.props.text}    
          </text>
        </rect>
    }
  };
