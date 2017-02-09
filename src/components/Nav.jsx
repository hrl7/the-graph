// @flow
// from the-graph/the-graph.js Line 281

import React from 'react';

import TheGraphThumb from "./thumb";

type Props = {
  className: string,

};

/*
  TODO: we should implement this style

      <style>
      #thumb, 
      #outcanvas {
        position: absolute;
        top: 0;
        left: 0;
        overflow: visible;
      }
      #viewrect {
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 150px;
        border: 1px solid hsla(190, 100%, 80%, 0.4);
        border-style: dotted;
      }
      </style>

*/
export default class Nav extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  render() {
    return (<div>

      <TheGraphThumb id="thumb"
        graph="{{ editor.fbpGraph }}"
        thumbrectangle="{{thumbrectangle}}"
        width="{{width}}" height="{{height}}"
        thumbscale="{{thumbscale}}"
        hide="{{hide}}"
        theme="{{ editor.theme }}" />
      <canvas id="outcanvas" width="{{width}}" height="{{height}}" style={{position:"absolute",top:0, left:0}}></canvas>
      <div id="viewrect"></div>
    </div>);
  }
}
