// @flow
// from the-graph/the-graph.js Line 281

import React from 'react';

type Props = {
  className: string,
      graph: ?any,
      width: number,
      height: number,
      thumbscale: number,
      nodeSize: number,
      fillStyle: string,
      strokeStyle: string,
      lineWidth: number,
      theme: string,
      edgeColors: string[]
};

type State = {
  thumbRectangle: number[],
  viewRectangle: number[]
};

const DefaultProps: Props = {
  graph: null,
  width: 200,
  height: 150,
  thumbscale: 1,
  nodeSize: 60,
  fillStyle: 'hsl(184, 8%, 10%)',
  strokeStyle: 'hsl(180, 11%, 70%)',
  lineWidth: 0.75,
  theme: 'dark',
  edgeColors: [
    'white',
    'hsl(  0, 100%, 46%)',
    'hsl( 35, 100%, 46%)',
    'hsl( 60, 100%, 46%)',
    'hsl(135, 100%, 46%)',
    'hsl(160, 100%, 46%)',
    'hsl(185, 100%, 46%)',
    'hsl(210, 100%, 46%)',
    'hsl(285, 100%, 46%)',
    'hsl(310, 100%, 46%)',
    'hsl(335, 100%, 46%)'
  ]
};

export default class Nav extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      thumbrectangle: [0, 0, 500, 500],
      viewrectangle: [0, 0, 200, 150]
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <canvas
        id="canvas"
        width="{{width}}"
        height="{{height}}"
        style={{position: 'absolute', top: 0, left: 0}} />);
  }
}
