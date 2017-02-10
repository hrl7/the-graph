// @flow
// from the-graph/the-graph.js Line 281

import React from 'react';

import {merge} from '../../utils';
import RawGraph from "./raw-graph";
import Tooltip from "./tooltip";

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
  }

  render() {
    // pan and zoom
    const sc = this.state.scale;
    const x = this.state.x;
    const y = this.state.y;
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

    let graphElementOptions = {
      graph: this.props.graph,
      scale: this.state.scale,
      app: this,
      library: this.props.library,
      onNodeSelection: this.props.onNodeSelection,
      onEdgeSelection: this.props.onEdgeSelection,
      showContext: this.showContext
    };
   // graphElementOptions = merge(config.app.graph, graphElementOptions);

    const svgGroupOptions = {transform};//merge(config.app.svgGroup, {transform});
    const tooltipOptions = Object.assign({}, {//Object.assign(config.app.tooltip, {
      x: this.state.tooltipX,
      y: this.state.tooltipY,
      visible: this.state.tooltipVisible,
      label: this.state.tooltip
    });
    const modalGroupOptions ={children: contextModal};// merge(config.app.modal, {children: contextModal});
    const svgOptions ={width: this.state.width, height: this.state.height};// merge(config.app.svg, {width: this.state.width, height: this.state.height});
    const canvasOptions = {width: this.state.width, height: this.state.height}; //merge(config.app.canvas, {width: this.state.width, height: this.state.height});

    const containerOptions ={style: {width: this.state.width, height: this.state.height}};// merge(config.app.container, {style: {width: this.state.width, height: this.state.height}});
    containerOptions.className += ' ' + scaleClass;
    return (
      <div {...containerOptions} >
        <canvas {...canvasOptions} />
        <svg {...svgOptions} >
          <g {...svgGroupOptions} >
            <RawGraph {...graphElementOptions} />
          </g>
          <Tooltip />
        </svg>
      </div>);
  }
}
/* next of g
<ModalGroup {...modalGroupOptions} />
*/
