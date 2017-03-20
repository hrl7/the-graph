// Port view

/*
      componentDidMount() {
      // Preview edge start
        ReactDOM.findDOMNode(this).addEventListener('tap', this.edgeStart);
        ReactDOM.findDOMNode(this).addEventListener('trackstart', this.edgeStart);
      // Make edge
        ReactDOM.findDOMNode(this).addEventListener('trackend', this.triggerDropOnTarget);
        ReactDOM.findDOMNode(this).addEventListener('the-graph-edge-drop', this.edgeStart);

      // Show context menu
        if (this.props.showContext) {
          ReactDOM.findDOMNode(this).addEventListener('contextmenu', this.showContext);
          ReactDOM.findDOMNode(this).addEventListener('hold', this.showContext);
        }
      },
      getTooltipTrigger() {
        return ReactDOM.findDOMNode(this);
      },
      shouldShowTooltip() {
        return (
        this.props.app.state.scale < TheGraph.zbpBig ||
        this.props.label.length > 8
        );
      },
      showContext(event) {
      // Don't show port menu on export node port
        if (this.props.isExport) {
          return;
        }
      // Click on label, pass context menu to node
        if (event && (event.target === ReactDOM.findDOMNode(this.refs.label))) {
          return;
        }
      // Don't show native context menu
        event.preventDefault();

      // Don't tap graph on hold event
        event.stopPropagation();
        if (event.preventTap) {
          event.preventTap();
        }

      // Get mouse position
        const x = event.x || event.clientX || 0;
        const y = event.y || event.clientY || 0;

      // App.showContext
        this.props.showContext({
          element: this,
          type: (this.props.isIn ? 'nodeInport' : 'nodeOutport'),
          x,
          y,
          graph: this.props.graph,
          itemKey: this.props.label,
          item: this.props.port
        });
      },
      getContext(menu, options, hide) {
        return TheGraph.Menu({
          menu,
          options,
          label: this.props.label,
          triggerHideContext: hide
        });
      },
      edgeStart(event) {
      // Don't start edge on export node port
        if (this.props.isExport) {
          return;
        }
      // Click on label, pass context menu to node
        if (event && (event.target === ReactDOM.findDOMNode(this.refs.label))) {
          return;
        }
      // Don't tap graph
        event.stopPropagation();

        const edgeStartEvent = new CustomEvent('the-graph-edge-start', {
          detail: {
            isIn: this.props.isIn,
            port: this.props.port,
          // process: this.props.processKey,
            route: this.props.route
          },
          bubbles: true
        });
        ReactDOM.findDOMNode(this).dispatchEvent(edgeStartEvent);
      }
      triggerDropOnTarget(event) {
      // If dropped on a child element will bubble up to port
        if (!event.relatedTarget) {
          return;
        }
        const dropEvent = new CustomEvent('the-graph-edge-drop', {
          detail: null,
          bubbles: true
        });
        event.relatedTarget.dispatchEvent(dropEvent);
      }
      */

// @flow

import React from 'react';
import Debug from "debug";

import { Arcs } from '../../utils';

const debug = Debug("graph:component:port");

type Props = {
  highlightPort: string,
  port: any,
  isIn: boolean,
};

export default class Port extends React.Component {

  props: Props;

  constructor(props: Props) {
    super(props);
  }

  render() {
    let style;
    const label = this.props.port.label;
    if (label.length > 7) {
      const fontSize = 6 * (30 / (4 * label.length));
      style = {fontSize: fontSize + 'px'};
    }
    let r = 4;
      // Highlight matching ports
    const highlightPort = this.props.highlightPort;
    let inArc = Arcs.inport;
    let outArc = Arcs.outport;
    if (highlightPort && highlightPort.isIn === this.props.isIn && (highlightPort.type === this.props.port.type || this.props.port.type === 'any')) {
      r = 6;
      inArc = Arcs.inportBig;
      outArc = Arcs.outportBig;
    }

    return (<g
      title={label}
      transform={`translate(${this.props.port.x},${this.props.port.y})`}
      className="port arrow" >
      <circle
        className="port-circle-bg"
        r={r + 1} />
      <path
        className="port-arc"
        d={this.props.isIn ? inArc : outArc} />
      <circle
        className={`port-circle-small fill route ${this.props.route}`}
        r={r - 1.5} />
      <text
        className="port-label drag"
        x={this.props.isIn ? 5 : -5}
        style={style}>
        {this.props.label}
      </text>
    </g>);
  }
}

Port.defaultProps = {

};
