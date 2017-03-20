// @flow

import React from 'react';

import {merge} from '../../utils';
import RawGraph from './raw-graph';
import Tooltip from './tooltip';
import Debug from 'debug';
const debug = Debug("graph:components:app");
type Props = {
  className: string,
  src: string,
  x: number,
  y: number,
  width: number,
  height: number,

  // App.config
      nodeSize: number,
    nodeRadius: number,
    nodeSide: number,
    // Context menus
    contextPortSize: number,
    // Zoom breakpoints
    zbpBig: number,
    zbpNormal: number,
    zbpSmall: number,
    config: {
      nodeSize: number,
      nodeWidth: number,
      nodeRadius: number,
      nodeHeight: number,
      autoSizeNode: boolean,
      maxPortCount: number,
      nodeHeightIncrement: number,
      focusAnimationDuration: number,
      app: ?any
    }
};

type State = {
  x: number,
  y: number,
  sc: number,
  transform: string,
  contextMenu: ?any,
  tooltipX: number,
  tooltipY: number,
  tooltipVisible: boolean,
  tooltip: string,
  menuShown: boolean
};

const DefaultProps = {
  nodeSize: 72,
  nodeRadius: 8,
  nodeSide: 56,
    // Context menus
  contextPortSize: 36,
    // Zoom breakpoints
  zbpBig: 1.2,
  zbpNormal: 0.4,
  zbpSmall: 0.01,
  config: {
    nodeSize: 72,
    nodeWidth: 72,
    nodeRadius: 8,
    nodeHeight: 72,
    autoSizeNode: true,
    maxPortCount: 9,
    nodeHeightIncrement: 12,
    focusAnimationDuration: 1500,
    app: {
      container: {
        className: 'the-graph-app',
        name: 'app'
      },
      canvas: {
        ref: 'canvas',
        className: 'app-canvas'
      },
      svg: {
        className: 'app-svg'
      },
      svgGroup: {
        className: 'view'
      },
      graph: {
        ref: 'graph'
      },
      tooltip: {
        ref: 'tooltip'
      },
      modal: {
        className: 'context'
      }
    }
  }
};

const InitialState: State = {
  scale: 1,
  x: 760,
  y: 640

};

export default class App extends React.Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = InitialState;
    window.app = this;

    this.onWheel = (event) => {
      // Don't bounce
      event.preventDefault();

      debug(event.deltaY);
      if (!this.zoomFactor) { // WAT
        this.zoomFactor = 0;
      }

      // Safari is wheelDeltaY
      this.zoomFactor += event.deltaY ? event.deltaY : 0-event.wheelDeltaY;
      this.zoomX = event.clientX;
      this.zoomY = event.clientY;
      requestAnimationFrame(this.scheduleWheelZoom);
    };

    this.scheduleWheelZoom = () => {
      if (isNaN(this.zoomFactor)) { return; }

      // Speed limit
      var zoomFactor = this.zoomFactor/-500;
      zoomFactor = Math.min(0.5, Math.max(-0.5, zoomFactor));
      var scale = this.state.scale + (this.state.scale * zoomFactor);
      this.zoomFactor = 0;

      if (scale < this.state.minZoom) {
        scale = this.state.minZoom;
      }
      else if (scale > this.state.maxZoom) {
        scale = this.state.maxZoom;
      }
      if (scale === this.state.scale) { return; }

      // Zoom and pan transform-origin equivalent
      var scaleD = scale / this.state.scale;
      var currentX = this.state.x;
      var currentY = this.state.y;
      var oX = this.zoomX;
      var oY = this.zoomY;
      var x = scaleD * (currentX - oX) + oX;
      var y = scaleD * (currentY - oY) + oY;
      debug(scale, x, y);
      this.setState({
        scale: scale,
        x: x,
        y: y,
        tooltipVisible: false
      });
    };
    this.renderGrid = () => {
      const cvs = this.refs['grid-canvas'];
      if (!cvs) {
        return;
      }
      const c = cvs.getContext('2d');
      if (!c) {
        return;
      }
      // Comment this line to go plaid
      c.clearRect(0, 0, this.state.width, this.state.height);

      // Background grid pattern
      const scale = this.state.scale;
      const g = this.props.nodeSize * scale;

      const dx = this.state.x % g;
      const dy = this.state.y % g;
      const cols = Math.floor(this.state.width / g) + 1;
      let row = Math.floor(this.state.height / g) + 1;
      // Origin row/col index
      const oc = Math.floor(this.state.x / g) + (this.state.x < 0 ? 1 : 0);
      const or = Math.floor(this.state.y / g) + (this.state.y < 0 ? 1 : 0);

      while (row--) {
        let col = cols;
        while (col--) {
          const x = Math.round(col * g + dx);
          const y = Math.round(row * g + dy);
          if ((oc - col) % 3 === 0 && (or - row) % 3 === 0) {
            // 3x grid
            c.fillStyle = 'white';
            c.fillRect(x, y, 1, 1);
          } else if (scale > 0.5) {
            // 1x grid
            c.fillStyle = 'grey';
            c.fillRect(x, y, 1, 1);
          }
        }
      }
    };
  }

  componentDidUpdate() {
    this.renderGrid();
  }

  render() {
    // pan and zoom
    const sc = this.state.scale;
    const x = this.state.x;
    const y = this.state.y;
    // TODO: add resize event
    const transform = `matrix(${sc},0,0,${sc},${x},${y})`;

    const scaleClass = sc > this.props.zbpBig ? 'big' : (sc > this.props.zbpNormal ? 'normal' : 'small');

    let contextMenu, contextModal;
    if (this.state.contextMenu) {
      const options = this.state.contextMenu;
      const menu = this.props.getMenuDef(options);
      if (menu) {
        contextMenu = options.element.getContext(menu, options, this.hideContext);
      }
    }
    if (contextMenu) {
      const modalBGOptions = {
        width: this.state.width,
        height: this.state.height,
        triggerHideContext: this.hideContext,
        children: contextMenu
      };

      contextModal = [
        <AppModalBackground {...modalBGOptions} />
      ];
      this.state.menuShown = true;
    } else {
      this.state.menuShown = false;
    }

    const config = this.props;
    debug(this.state);
    const graphElementOptions = {
      graph: this.props.graph,
      scale: this.state.scale,
      app: this,
      library: this.props.library,
      onNodeSelection: this.props.onNodeSelection,
      onEdgeSelection: this.props.onEdgeSelection,
      showContext: this.showContext
    };
   // graphElementOptions = merge(config.app.graph, graphElementOptions);

    const svgGroupOptions = {};// merge(config.app.svgGroup, {transform});
    const tooltipOptions = Object.assign({}, {// Object.assign(config.app.tooltip, {
      x: this.state.tooltipX,
      y: this.state.tooltipY,
      visible: this.state.tooltipVisible,
      label: this.state.tooltip
    });
    const modalGroupOptions = {children: contextModal};// merge(config.app.modal, {children: contextModal});
    const svgOptions = {width: this.state.width, height: this.state.height};// merge(config.app.svg, {width: this.state.width, height: this.state.height});
    const canvasOptions = {width: this.state.width, height: this.state.height}; // merge(config.app.canvas, {width: this.state.width, height: this.state.height});

    const containerOptions = {style: {width: this.state.width, height: this.state.height}};// merge(config.app.container, {style: {width: this.state.width, height: this.state.height}});
    containerOptions.className += ' ' + scaleClass;
    return (
      <div {...containerOptions} >
        <canvas ref="grid-canvas" {...canvasOptions} />

        <svg className="the-graph-dark" onWheel={this.onWheel} width={window.innerWidth} height={window.innerHeight} >
          <g {...svgGroupOptions} >
            <RawGraph {...graphElementOptions} width={window.innerWidth} height={window.innerHeight} />
          </g>
          <Tooltip />
        </svg>
      </div>);
  }
}

App.defaultProps = DefaultProps;
/* next of g
<ModalGroup {...modalGroupOptions} />
*/
