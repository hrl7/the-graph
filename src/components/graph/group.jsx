// @flow

import React from 'react';
import Debug from "debug";

import Label from "./label";

const debug = Debug("graph:components:group");
const NODE_RADIUS = 8;
const NODE_SIZE = 72;

type Props = {

};

export default class Group extends React.Component {

  props: Props;

  constructor(props: Props) {
    super(props);
  }

  render() {

    debug(this.props);
      const x = this.props.minX - NODE_SIZE * 0.5;
      const y = this.props.minY - NODE_SIZE * 0.5;
      const color = (this.props.color ? this.props.color : 0);
      const selection = (this.props.isSelectionGroup ? 'selection drag' : '');

    return (<g
      className="container" >
      <rect 
        x={x}
        y={y}
        rx={NODE_RADIUS}
        ry={NODE_RADIUS}
        width={this.props.maxX - x + NODE_SIZE * 0.5}
        height={this.props.maxY - y + NODE_SIZE * 0.75}
        className={`group-box color${color} ${selection}`}/>
      <Label        
        className="group-label drag"
        x={x + NODE_RADIUS}
        y={y + 9}
        label={this.props.label} />
      <text   
        className="group-description"
        x={x + NODE_RADIUS}
        y={y + 24} >
        {this.props.description}
      </text>
    </g>);
  }
}

Group.defaultProps = {

};
