import React, {Component, PropTypes} from 'react';
import { findDOMNode } from 'react-dom'

export default class Canvas extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = findDOMNode(this);
    this.ctx = this.canvas.getContext('2d');
    this.initTool(this.props.tool);
  }

  render() {
    const {width, height} = this.props;
    return (
      <canvas
        width={width}
        height={height}
      />
    )
  }
}

Canvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}