import React, {Component, PropTypes} from 'react'

export default class ProductDesigner extends Component {
  constructor(props) {
    super(props);
  }

  readImage(ctx){
    if (this.files && this.files[0] ) {
      var FR = new FileReader();
      FR.onload = function(e) {
          var img = new Image();
          img.onload = function() {
            ctx.drawImage(img,0,0);
          };
          img.src = e.target.result;
      };
      FR.readAsDataURL( this.files[0] );
    }
  }
  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    this.uploader = this.refs.file;
    this.uploader.addEventListener("change", this.readImage.bind(this.uploader, this.ctx), false);
  }
  render() {
    const {width, height} = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <canvas
              ref="canvas"
              width={width}
              height={height}
              onUploadImage={this.onUploadImage}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s12">
             <div className="file-field input-field">
              <div className="btn">
                <span>File</span>
                <input ref="file" type="file"/>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}