// @flow
import React from 'react';
import Debug from 'debug';

const debug = Debug('graph:components:edge');

const NODE_SIZE = 72;
const CURVE = NODE_SIZE;

export type EdgeProps = {
  sX: number,
  sY: number,
  tX: number,
  tY: number,
  label: string,
  route: string
};

export default class Edge extends React.Component {

  props: EdgeProps;

  constructor(props: EdgeProps) {
    super(props);
  }

  componentDidMount() {
/*
      var domNode = ReactDOM.findDOMNode(this);

      // Dragging
      domNode.addEventListener("trackstart", this.dontPan);

      if (this.props.onEdgeSelection) {
        // Needs to be click (not tap) to get event.shiftKey
        domNode.addEventListener("tap", this.onEdgeSelection);
      }

      // Context menu
      if (this.props.showContext) {
        domNode.addEventListener("contextmenu", this.showContext);
        domNode.addEventListener("hold", this.showContext);
      }
      */
  }
    /*
    dontPan(event) {
      // Don't drag under menu
      if (this.props.app.menuShown) {
        event.stopPropagation();
      }
    }

    onEdgeSelection(event) {
      // Don't click app
      event.stopPropagation();

      var toggle = (TheGraph.metaKeyPressed || event.pointerType==="touch");
      this.props.onEdgeSelection(this.props.edgeID, this.props.edge, toggle);
    }

    showContext(event) {
      // Don't show native context menu
      event.preventDefault();

      // Don't tap graph on hold event
      event.stopPropagation();
      if (event.preventTap) { event.preventTap(); }

      // Get mouse position
      var x = event.x || event.clientX || 0;
      var y = event.y || event.clientY || 0;

      // App.showContext
      this.props.showContext({
        element: this,
        type: (this.props.export ? (this.props.isIn ? "graphInport" : "graphOutport") : "edge"),
        x: x,
        y: y,
        graph: this.props.graph,
        itemKey: (this.props.export ? this.props.exportKey : null),
        item: (this.props.export ? this.props.export : this.props.edge)
      });

    }
    getContext(menu, options, hide) {
      return TheGraph.Menu({
        menu: menu,
        options: options,
        triggerHideContext: hide,
        label: this.props.label,
        iconColor: this.props.route
      });
    }
    shouldComponentUpdate(nextProps, nextState) {
      // Only rerender if changed
      return (
        nextProps.sX !== this.props.sX ||
        nextProps.sY !== this.props.sY ||
        nextProps.tX !== this.props.tX ||
        nextProps.tY !== this.props.tY ||
        nextProps.selected !== this.props.selected ||
        nextProps.animated !== this.props.animated ||
        nextProps.route !== this.props.route
      );
    }

    getTooltipTrigger() {
      return ReactDOM.findDOMNode(this.refs.touch);
    }

    shouldShowTooltip() {
      return true;
    }
    */
  render() {
    const sourceX = this.props.sX;
    const sourceY = this.props.sY;
    const targetX = this.props.tX;
    const targetY = this.props.tY;

      // Organic / curved edge
    let c1X, c1Y, c2X, c2Y;
    if (targetX - 5 < sourceX) {
      const curveFactor = (sourceX - targetX) * CURVE / 200;
      if (Math.abs(targetY - sourceY) < NODE_SIZE * 0.5) {
          // Loopback
        c1X = sourceX + curveFactor;
        c1Y = sourceY - curveFactor;
        c2X = targetX - curveFactor;
        c2Y = targetY - curveFactor;
      } else {
          // Stick out some
        c1X = sourceX + curveFactor;
        c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor);
        c2X = targetX - curveFactor;
        c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor);
      }
    } else {
        // Controls halfway between
      c1X = sourceX + (targetX - sourceX) / 2;
      c1Y = sourceY;
      c2X = c1X;
      c2Y = targetY;
    }

      // Make SVG path

    const path = `M ${sourceX} ${sourceY} C ${c1X} ${c1Y} ${c2X} ${c2Y} ${targetX} ${targetY}`;

    const epsilon = 0.01;
    let center = findPointOnCubicBezier(0.5, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY);

      // estimate slope and intercept of tangent line
    const getShiftedPoint = function (epsilon) {
      return findPointOnCubicBezier(
          0.5 + epsilon, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY);
    };
    const plus = getShiftedPoint(epsilon);
    const minus = getShiftedPoint(-epsilon);
    const m = 1 * (plus[1] - minus[1]) / (plus[0] - minus[0]);
    const b = center[1] - (m * center[0]);

    let arrowLength = 12;
      // Which direction should arrow point
    if (plus[0] > minus[0]) {
      arrowLength *= -1;
    }
    center = findLinePoint(center[0], center[1], m, b, -1 * arrowLength / 2);

    const points = perpendicular(center[0], center[1], m, arrowLength * 0.9);
    // For m === 0, figure out if arrow should be straight up or down
    const flip: number = plus[1] > minus[1] ? -1 : 1;
    const arrowTip = findLinePoint(center[0], center[1], m, b, arrowLength, flip);
    points.push(arrowTip);
    const pointsArray = points.map(point => point.join(',')).join(' ');

    let route = 0;
    if (this.props.metadata && this.props.metadata.route) {
      route = this.props.metadata.route;
    }
    return (<g
      className={(this.props.selected ? ' selected' : '') + (this.props.animated ? ' animated' : '')}
      title={this.props.label}>
      <path className="edge-bg"d={path}/>
      <polygon points={pointsArray} className="arrow-bg" />
      <path d={path} className={`edge-fg stroke route${this.props.route}`}/>
      <path d={path} className="edge-touch" />
      <polygon points={pointsArray} className={`arrow fill route${this.props.route}`} />
    </g>);
  }
}

// util

// find point on line y = mx + b that is `offset` away from x,y
const findLinePoint = (x: number, y: number, m: number, b: number, offset: number, flip: number = 1) => {
  const x1 = x + offset / Math.sqrt(1 + m * m);
  let y1;
  if (Math.abs(m) === Infinity) {
    y1 = y + flip * offset;
  } else {
    y1 = (m * x1) + b;
  }
  return [x1, y1];
};

// Point along cubic bezier curve
// See http://en.wikipedia.org/wiki/File:Bezier_3_big.gif
const findPointOnCubicBezier = (p, sx, sy, c1x, c1y, c2x, c2y, ex, ey) => {
  // p is percentage from 0 to 1
  const op = 1 - p;
  // 3 green points between 4 points that define curve
  const g1x = sx * p + c1x * op;
  const g1y = sy * p + c1y * op;
  const g2x = c1x * p + c2x * op;
  const g2y = c1y * p + c2y * op;
  const g3x = c2x * p + ex * op;
  const g3y = c2y * p + ey * op;
  // 2 blue points between green points
  const b1x = g1x * p + g2x * op;
  const b1y = g1y * p + g2y * op;
  const b2x = g2x * p + g3x * op;
  const b2y = g2y * p + g3y * op;
  // Point on the curve between blue points
  const x = b1x * p + b2x * op;
  const y = b1y * p + b2y * op;
  return [x, y];
};
// find points of perpendicular line length l centered at x,y
const perpendicular = (x, y, oldM, l) => {
  const m = -1 / oldM;
  const b = y - m * x;
  return [
    findLinePoint(x, y, m, b, l / 2),
    findLinePoint(x, y, m, b, l / -2)
  ];
};
