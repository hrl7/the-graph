// @flow
import React from 'react';

type Props = {
  x: number,
  y: number,
  rx: number,
  ry: number,
  height: number,
  label: string,
  visible: boolean
};

type State = {
  width: number,
};

const InitialState = {
  width: 0
};

class ToolTip extends React.Component {
  props: Props;
  state: State;
  constructor(props) {
    super(props);
    this.state = Object.assign(InitialState, props);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props);
    this.setState({
      width: nextProps.label.length * 6
    });
  }

  render() {
    const props = this.props;
    return (<g
      transform={`translate(${props.x},${props.y})`}
      className={`tooltip ${(props.visible ? '' : ' hidden')}`}>
      <rect
        className="tooltip-bg"
        x={props.x}
        y={props.y}
        rx={props.rx}
        ry={props.ry}
        width={this.state.width}
        height={props.height} />
      <text className="tooltip-label">
        {props.label}
      </text>
    </g>);
  }
}

ToolTip.defaultProps = {
  x: 0,
  y: -7,
  rx: 3,
  ry: 3,
  height: 16,
  visible: false,
  label: ''
};

export default ToolTip;
