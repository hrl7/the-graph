  module.exports.register = function (context) {
    const TheGraph = context.TheGraph;

  // Initialize configuration for the Port view.
    TheGraph.config.port = {
      container: {
        className: 'port arrow'
      },
      backgroundCircle: {
        className: 'port-circle-bg'
      },
      arc: {
        className: 'port-arc'
      },
      innerCircle: {
        ref: 'circleSmall'
      },
      text: {
        ref: 'label',
        className: 'port-label drag'
      }
    };

    TheGraph.factories.port = {
      createPortGroup: TheGraph.factories.createGroup,
      createPortBackgroundCircle: TheGraph.factories.createCircle,
      createPortArc: TheGraph.factories.createPath,
      createPortInnerCircle: TheGraph.factories.createCircle,
      createPortLabelText: TheGraph.factories.createText
    };

  // Port view

    TheGraph.Port = React.createFactory(React.createClass({
      displayName: 'TheGraphPort',
      mixins: [
        TheGraph.mixins.Tooltip
      ],
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
      },
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
      },
      render() {
        let style;
        if (this.props.label.length > 7) {
          const fontSize = 6 * (30 / (4 * this.props.label.length));
          style = {fontSize: fontSize + 'px'};
        }
        let r = 4;
      // Highlight matching ports
        const highlightPort = this.props.highlightPort;
        let inArc = TheGraph.arcs.inport;
        let outArc = TheGraph.arcs.outport;
        if (highlightPort && highlightPort.isIn === this.props.isIn && (highlightPort.type === this.props.port.type || this.props.port.type === 'any')) {
          r = 6;
          inArc = TheGraph.arcs.inportBig;
          outArc = TheGraph.arcs.outportBig;
        }

        const backgroundCircleOptions = TheGraph.merge(TheGraph.config.port.backgroundCircle, {r: r + 1});
        const backgroundCircle = TheGraph.factories.port.createPortBackgroundCircle.call(this, backgroundCircleOptions);

        const arcOptions = TheGraph.merge(TheGraph.config.port.arc, {d: (this.props.isIn ? inArc : outArc)});
        const arc = TheGraph.factories.port.createPortArc.call(this, arcOptions);

        let innerCircleOptions = {
          className: 'port-circle-small fill route' + this.props.route,
          r: r - 1.5
        };

        innerCircleOptions = TheGraph.merge(TheGraph.config.port.innerCircle, innerCircleOptions);
        const innerCircle = TheGraph.factories.port.createPortInnerCircle.call(this, innerCircleOptions);

        let labelTextOptions = {
          x: (this.props.isIn ? 5 : -5),
          style,
          children: this.props.label
        };
        labelTextOptions = TheGraph.merge(TheGraph.config.port.text, labelTextOptions);
        const labelText = TheGraph.factories.port.createPortLabelText.call(this, labelTextOptions);

        const portContents = [
          backgroundCircle,
          arc,
          innerCircle,
          labelText
        ];

        const containerOptions = TheGraph.merge(TheGraph.config.port.container, {title: this.props.label, transform: 'translate(' + this.props.x + ',' + this.props.y + ')'});
        return TheGraph.factories.port.createPortGroup.call(this, containerOptions, portContents);
      }
    }));
  };
