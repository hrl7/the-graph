// @flow
// from the-graph/the-graph.js Line 281

import React from 'react';

type Props = {
  className: string,
  src: string,
  x: number,
  y: number,
  width: number,
  height: number
};

export default class SVGImage extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  render() {
    return (<image
      className={this.props.className}
      xLinkHref={this.props.src}
      x={this.props.x}
      y={this.props.y}
      width={this.props.width}
      height={this.props.height} />);
  }
}
