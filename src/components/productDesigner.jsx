import React, {Component, PropTypes} from 'react'
import * as Constants from './../constants'
import ImageTools from '../tools/image'
export default class ProductDesigner extends Component {
  constructor(props) {
    super(props);
    this.state = {image:null, imageTool:false};
    this.setToolToText = this.setToolToText.bind(this);
    this.setToolToPicture = this.setToolToPicture.bind(this);
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    //if the image tool is selected
    this.imageTool = new ImageTools(this.refs.canvas,this.refs.file);
    this.refs.canvas.onmousedown = this.imageTool.handleMousedown;
    this.refs.canvas.onmousemove = this.imageTool.handleMousemove;
    this.refs.canvas.onmouseup = this.imageTool.handleMouseup;
    this.refs.canvas.onmouseout = this.imageTool.handleMouseup;
  }

  setToolToText(){
    this.setState({tool: Constants.TEXT})
    //this.imageTool.draw(false,false);
  }
  setToolToPicture(){
    this.setState({tool: Constants.PICTURE})

  }
  componentDidUpdate(){
   /* this.uploader = this.refs.file;*/

  }
  render() {
    const {width, height} = this.props;
    let toolBox = null;

    if(this.state.tool === Constants.PICTURE){
/*      toolBox = ();*/
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <canvas
              ref="canvas"
              id="canvas"
              width={width}
              height={height}
              onUploadImage={this.onUploadImage}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s6">
            <a className="waves-effect waves-light btn" onClick={this.setToolToText}>Tekst</a>
          </div>
          <div className="col s6">
            <a className="waves-effect waves-light btn" onClick={this.setToolToPicture}>Afbeelding</a>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <div className="file-field input-field">
              <div className="btn">
                <span>Upload foto</span>
                <input ref="file" type="file"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}