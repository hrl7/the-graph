// @flow
// from the-graph/the-graph.js Line 281

import React from 'react';

import App from "./graph/app";

type Props = {
  className: string,

};

export default class TheGraph extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  render() {
    return (<div>
      <App />
    </div>);
  }
}
