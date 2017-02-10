// @flow

import React from 'react';

type Props = {
  width: number,
  height: number,
  text: string
};

export default class SubLabel extends React.Component {

  props: Props;

  constructor(props: Props) {
    super(props);
  }

  render() {

    const 
      height = 9, 
      x = this.props.width * 0.5,
      y = this.props.height + 30,
      text = this.props.text,
      width = text.length * height * 2/3,
      radius = height * 0.5
      ;

    return (<g
      className="node-sublabel-bg" >
      <rect
        className="text-bg-rect"
        width={width}
        height={height * 1.1}
        rx={radius}
        ry={radius}
        x={x - width * 1.5}
        y={y - height * 1.5}
        />
      <text
        x={x}
        y={y}>
        {text}
      </text>
    </g>);
  }
}

SubLabel.defaultProps = {
  width: 0,
  height: 0,
  text: ""
}
