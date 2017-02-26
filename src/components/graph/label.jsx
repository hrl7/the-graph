// @flow

import React from 'react';

type Props = {
  width: number,
  height: number,
  text: string
};

export default class Label extends React.Component {

  props: Props;

  constructor(props: Props) {
    super(props);
  }

  render() {
    const
      height = 14,
      x = this.props.x || this.props.width * 0.5,
      y = this.props.y || this.props.height + 15,
      text = this.props.text,
      width = text.length * height * 2 / 3,
      radius = height * 0.5
      ;

    return (<g
      className="${this.props.klass}-label-bg" >
      <rect
        className="text-bg-rect"
        width={width}
        height={height * 1.1}
        rx={radius}
        ry={radius}
        x={x - width * 0.5}
        y={y - height * 0.5}
        />
      <text
        className="node-label"
        x={x}
        y={y}>
        {text}
      </text>
    </g>);
  }
}

Label.defaultProps = {
  width: 0,
  height: 0,
  text: ''
};
