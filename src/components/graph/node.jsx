// @flow
import React from 'react';
import SubLabel from './sub-label';
import Label from './label';
import Icon from './icon';

  // PolymerGestures monkeypatch
  /*
  function patchGestures() {
    PolymerGestures.dispatcher.gestures.forEach( function (gesture) {
      // hold
      if (gesture.HOLD_DELAY) {
        gesture.HOLD_DELAY = 500;
      }
      // track
      if (gesture.WIGGLE_THRESHOLD) {
        gesture.WIGGLE_THRESHOLD = 8;
      }
    });
  }

      onNodeSelection(event) {
      // Don't tap app (unselect)
      event.stopPropagation();
      var toggle = (TheGraph.metaKeyPressed || event.pointerType==="touch");
      this.props.onNodeSelection(this.props.nodeID, this.props.node, toggle);
    }
    onTrackStart(event) {
      // Don't drag graph
      event.stopPropagation();

      // Don't change selection
      event.preventTap();

      // Don't drag under menu
      if (this.props.app.menuShown) { return; }

      // Don't drag while pinching
      if (this.props.app.pinching) { return; }

      var domNode = ReactDOM.findDOMNode(this);
      domNode.addEventListener("track", this.onTrack);
      domNode.addEventListener("trackend", this.onTrackEnd);

      // Moving a node should only be a single transaction
      if (this.props.export) {
        this.props.graph.startTransaction('moveexport');
      } else {
        this.props.graph.startTransaction('movenode');
      }
    }
    onTrack(event) {
      // Don't fire on graph
      event.stopPropagation();

      var scale = this.props.app.state.scale;
      var deltaX = Math.round( event.ddx / scale );
      var deltaY = Math.round( event.ddy / scale );

      // Fires a change event on fbp-graph graph, which triggers redraw
      if (this.props.export) {
        var newPos = {
          x: this.props.export.metadata.x + deltaX,
          y: this.props.export.metadata.y + deltaY
        };
        if (this.props.isIn) {
          this.props.graph.setInportMetadata(this.props.exportKey, newPos);
        } else {
          this.props.graph.setOutportMetadata(this.props.exportKey, newPos);
        }
      } else {
        this.props.graph.setNodeMetadata(this.props.nodeID, {
          x: this.props.node.metadata.x + deltaX,
          y: this.props.node.metadata.y + deltaY
        });
      }
    }
    onTrackEnd(event) {
      // Don't fire on graph
      event.stopPropagation();

      var domNode = ReactDOM.findDOMNode(this);
      domNode.removeEventListener("track", this.onTrack);
      domNode.removeEventListener("trackend", this.onTrackEnd);

      // Snap to grid
      var snapToGrid = true;
      var snap = TheGraph.config.node.snap / 2;
      if (snapToGrid) {
        var x, y;
        if (this.props.export) {
          var newPos = {
            x: Math.round(this.props.export.metadata.x/snap) * snap,
            y: Math.round(this.props.export.metadata.y/snap) * snap
          };
          if (this.props.isIn) {
            this.props.graph.setInportMetadata(this.props.exportKey, newPos);
          } else {
            this.props.graph.setOutportMetadata(this.props.exportKey, newPos);
          }
        } else {
          this.props.graph.setNodeMetadata(this.props.nodeID, {
            x: Math.round(this.props.node.metadata.x/snap) * snap,
            y: Math.round(this.props.node.metadata.y/snap) * snap
          });
        }
      }

      // Moving a node should only be a single transaction
      if (this.props.export) {
        this.props.graph.endTransaction('moveexport');
      } else {
        this.props.graph.endTransaction('movenode');
      }
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
        type: (this.props.export ? (this.props.isIn ? "graphInport" : "graphOutport") : "node"),
        x: x,
        y: y,
        graph: this.props.graph,
        itemKey: (this.props.export ? this.props.exportKey : this.props.nodeID),
        item: (this.props.export ? this.props.export : this.props.node)
      });
    }
    getContext(menu, options, hide) {
      // If this node is an export
      if (this.props.export) {
        return TheGraph.Menu({
          menu: menu,
          options: options,
          triggerHideContext: hide,
          label: this.props.exportKey
        });
      }

      // Absolute position of node
      var x = options.x;
      var y = options.y;
      var scale = this.props.app.state.scale;
      var appX = this.props.app.state.x;
      var appY = this.props.app.state.y;
      var nodeX = (this.props.x + this.props.width / 2) * scale + appX;
      var nodeY = (this.props.y + this.props.height / 2) * scale + appY;
      var deltaX = nodeX - x;
      var deltaY = nodeY - y;
      var ports = this.props.ports;
      var processKey = this.props.nodeID;
      var highlightPort = this.props.highlightPort;

      // If there is a preview edge started, only show connectable ports
      if (this.props.graphView.state.edgePreview) {
        if (this.props.graphView.state.edgePreview.isIn) {
          // Show outputs
          return TheGraph.NodeMenuPorts({
            ports: ports.outports,
            triggerHideContext: hide,
            isIn: false,
            scale: scale,
            processKey: processKey,
            deltaX: deltaX,
            deltaY: deltaY,
            translateX: x,
            translateY: y,
            nodeWidth: this.props.width,
            nodeHeight: this.props.height,
            highlightPort: highlightPort
          });
        } else {
          // Show inputs
          return TheGraph.NodeMenuPorts({
            ports: ports.inports,
            triggerHideContext: hide,
            isIn: true,
            scale: scale,
            processKey: processKey,
            deltaX: deltaX,
            deltaY: deltaY,
            translateX: x,
            translateY: y,
            nodeWidth: this.props.width,
            nodeHeight: this.props.height,
            highlightPort: highlightPort
          });
        }
      }

      // Default, show whole node menu
      return TheGraph.NodeMenu({
        menu: menu,
        options: options,
        triggerHideContext: hide,
        label: this.props.label,
        graph: this.props.graph,
        graphView: this.props.graphView,
        node: this,
        icon: this.props.icon,
        ports: ports,
        process: this.props.node,
        processKey: processKey,
        x: x,
        y: y,
        nodeWidth: this.props.width,
        nodeHeight: this.props.height,
        deltaX: deltaX,
        deltaY: deltaY,
        highlightPort: highlightPort
      });
    }

    shouldShowTooltip () {
      return (this.props.app.state.scale < TheGraph.zbpNormal);
    }
  */

  // Node view
export default class Node extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

      // Dragging
      // domNode.addEventListener("trackstart", this.onTrackStart);

      // Tap to select
      // if (this.props.onNodeSelection) {
      //  domNode.addEventListener("tap", this.onNodeSelection, true);
      // }

      // Context menu
      // if (this.props.showContext) {
      //  ReactDOM.findDOMNode(this).addEventListener("contextmenu", this.showContext);
      //  ReactDOM.findDOMNode(this).addEventListener("hold", this.showContext);

  }

  shouldComponentUpdate(nextProps, nextState) {
      // Only rerender if changed
    return (
        nextProps.x !== this.props.x ||
        nextProps.y !== this.props.y ||
        nextProps.icon !== this.props.icon ||
        nextProps.label !== this.props.label ||
        nextProps.sublabel !== this.props.sublabel ||
        nextProps.ports !== this.props.ports ||
        nextProps.selected !== this.props.selected ||
        nextProps.error !== this.props.error ||
        nextProps.highlightPort !== this.props.highlightPort ||
        nextProps.ports.dirty === true
    );
  }

  render() {
      /*
      if (this.props.ports.dirty) {
        // This tag is set when an edge or iip changes port colors
        this.props.ports.dirty = false;
      }
      */

    const metadata = this.props.metadata;
    const label = metadata.label;
    let sublabel = metadata.sublabel;
    if (!sublabel || sublabel === label) {
      sublabel = '';
    }

    const x = metadata.x;
    const y = metadata.y;

      // TODO: these constants should be in config
    const width = 72;
    const height = 72;
    const radius = 8;
    const icon = ['apple', 'arrow-left', 'edge', 'forumbee'][Math.floor(Math.random() * 4)];
/*
      // Ports
      var keys, count;
      var processKey = this.props.nodeID;
      var app = this.props.app;
      var graph = this.props.graph;
      var node = this.props.node;
      var isExport = (this.props.export !== undefined);
      var showContext = this.props.showContext;
      var highlightPort = this.props.highlightPort;

      // Inports
      var inports = this.props.ports.inports;
      keys = Object.keys(inports);
      count = keys.length;
      // Make views
      var inportViews = keys.map(function(key){
        var info = inports[key];
        var props = {
          app: app,
          graph: graph,
          node: node,
          key: processKey + ".in." + info.label,
          label: info.label,
          processKey: processKey,
          isIn: true,
          isExport: isExport,
          nodeX: x,
          nodeY: y,
          nodeWidth: width,
          nodeHeight: height,
          x: info.x,
          y: info.y,
          port: {process:processKey, port:info.label, type:info.type},
          highlightPort: highlightPort,
          route: info.route,
          showContext: showContext
        };
        return TheGraph.factories.node.createNodePort(props);
      });

      // Outports
      var outports = this.props.ports.outports;
      keys = Object.keys(outports);
      count = keys.length;
      var outportViews = keys.map(function(key){
        var info = outports[key];
        var props = {
          app: app,
          graph: graph,
          node: node,
          key: processKey + ".out." + info.label,
          label: info.label,
          processKey: processKey,
          isIn: false,
          isExport: isExport,
          nodeX: x,
          nodeY: y,
          nodeWidth: width,
          nodeHeight: height,
          x: info.x,
          y: info.y,
          port: {process:processKey, port:info.label, type:info.type},
          highlightPort: highlightPort,
          route: info.route,
          showContext: showContext
        };
        return TheGraph.factories.node.createNodePort(props);
      });

      var inportsOptions = TheGraph.merge(TheGraph.config.node.inports, { children: inportViews });
      var inportsGroup = TheGraph.factories.node.createNodeInportsGroup.call(this, inportsOptions);

      var outportsOptions = TheGraph.merge(TheGraph.config.node.outports, { children: outportViews });
      var outportsGroup = TheGraph.factories.node.createNodeOutportsGroup.call(this, outportsOptions);
*/

    return (
      <g
        className={`node drag ${this.props.selected ? ' selected' : ''} ${this.props.error ? ' error' : ''}`}
        name={this.props.component}
        title={label}
        transform={`translate(${x},${y})`}>
        <rect className="node-bg" x="0" y="0" rx={radius} ry={radius} width={width} height={Number(height) + 25}/>
        <rect className="node-border drag" x="0" y="0" width={width} rx={radius} ry={radius} height={height}/>
        <rect className="node-rect drag" x="3" y="3" width={width - 6} rx={radius - 2} ry={radius - 2} height={height - 6}/>
        <Icon width={width} height={height} radius={radius} icon={icon}/>
        <Label text={label} width={width} height={height} />
        <SubLabel text={sublabel} width={width} height={height} />
      </g>);
  }
  }
/*
  TheGraph.factories.node = {
    createNodeGroup: TheGraph.factories.createGroup,
    createNodeBackgroundRect: TheGraph.factories.createRect,
    createNodeBorderRect: TheGraph.factories.createRect,
    createNodeInnerRect: TheGraph.factories.createRect,
    createNodeIconText: TheGraph.factories.createText,
    createNodeIconSVG: TheGraph.factories.createImg,
    createNodeInportsGroup: TheGraph.factories.createGroup,
    createNodeOutportsGroup: TheGraph.factories.createGroup,
    createNodeLabelGroup: TheGraph.factories.createGroup,
    createNodeLabelRect: TheGraph.factories.createRect,
    createNodeLabelText: TheGraph.factories.createText,
    createNodeSublabelGroup: TheGraph.factories.createGroup,
    createNodeSublabelRect: TheGraph.factories.createRect,
    createNodeSublabelText: TheGraph.factories.createText,
    createNodePort: createNodePort
  };

*/
