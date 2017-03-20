// @flow

// Initial Information Packet

const CURVE = 50;
const NODE_SIZE = 72;

import React from 'react';
import TextBG from './text-bg';
import Debug from 'debug';

const debug = Debug('graph:components:iip');
  // Edge view

type Props = {
  x: number,
  y: number,
  label: string
};

export default class IIP extends React.Component {

  props: Props;

  constructor(props: Props) {
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
    debug(this.props);
    const x = this.props.x,
      y = this.props.y + NODE_SIZE * 0.5;

      // Make a string
    let label = String(this.props.label);
      // TODO make this smarter with ZUI
    if (label.length > 12) {
      label = label.slice(0, 9) + '...';
    }

    return (
      <g className="iip"
        title={this.props.label}>
        <path className="iip-path" d={`M ${x} ${y} L ${x - 10} ${y}`}/>
        <TextBG
          className="iip-info"
          height={5}
          halign="right"
          x={x - 10}
          y={y}>
          {label}
        </TextBG>
      </g>
    );
  }
}
