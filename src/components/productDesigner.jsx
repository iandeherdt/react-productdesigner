import React, {Component, PropTypes} from 'react'
var border = 10;
var isLeft = false;
var isRight = false;
var isTop = false;
var isBottom = false;
var iAnchor;

var isDown = false;
var iW;
var iH;
var iLeft = 50;
var iTop = 50;
var iRight, iBottom, iOrientation;

const resizeFunctions = {

    T: function (x, y) {
        iTop = y;
    },
    R: function (x, y) {
        iRight = x;
    },
    B: function (x, y) {
        iBottom = y;
    },
    L: function (x, y) {
        iLeft = x;
    },

    WideTR: function (x, y) {
        iRight = x;
        iTop = iBottom - (iH * (iRight - iLeft) / iW);
    },
    TallTR: function (x, y) {
        iTop = y;
        iRight = iLeft + (iW * (iBottom - iTop) / iH);
    },

    WideBR: function (x, y) {
        iRight = x;
        iBottom = iTop + (iH * (iRight - iLeft) / iW);
    },
    TallBR: function (x, y) {
        iBottom = y;
        iRight = iLeft + (iW * (iBottom - iTop) / iH);
    },

    WideBL: function (x, y) {
        iLeft = x;
        iBottom = iTop + (iH * (iRight - iLeft) / iW);
    },
    TallBL: function (x, y) {
        iBottom = y;
        iLeft = iRight - (iW * (iBottom - iTop) / iH);
    },

    WideTL: function (x, y) {
        iLeft = x;
        iTop = iBottom - (iH * (iRight - iLeft) / iW);
    },
    TallTL: function (x, y) {
        iBottom = y;
        iLeft = iRight - (iW * (iBottom - iTop) / iH);
    }
};



export default class ProductDesigner extends Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
    this.state = {image:null};
    this.handleMousemove = this.handleMousemove.bind(this);
  }
  draw(withAnchors) {
    console.log('draw');
    if(this.state.image){
      let cx = iLeft + (iRight - iLeft) / 2;
      let cy = iTop + (iBottom - iTop) / 2;
      this.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
      this.ctx.drawImage(this.state.image, iLeft, iTop, iRight - iLeft, iBottom - iTop);
      if (withAnchors) {
          this.ctx.fillRect(iLeft, iTop, border, border);
          this.ctx.fillRect(iRight - border, iTop, border, border);
          this.ctx.fillRect(iRight - border, iBottom - border, border, border);
          this.ctx.fillRect(iLeft, iBottom - border, border, border);
          this.ctx.fillRect(cx, iTop, border, border);
          this.ctx.fillRect(cx, iBottom - border, border, border);
          this.ctx.fillRect(iLeft, cy, border, border);
          this.ctx.fillRect(iRight - border, cy, border, border);
      }
    }

  }
  handleMousedown(e) {
    var offsetX = this.refs.canvas.offsetLeft;
    var offsetY = this.refs.canvas.offsetTop;
    // tell the browser we'll handle this mousedown
    e.preventDefault();
    e.stopPropagation();
    var mouseX = e.clientX - offsetX;
    var mouseY = e.clientY - offsetY;
    iAnchor = this.hitResizeAnchor(mouseX, mouseY);
    isDown = (iAnchor);
  }

  handleMouseup(e) {
    // tell the browser we'll handle this mouseup
    e.preventDefault();
    e.stopPropagation();
    isDown = false;
    this.draw(true);
  }

  handleMousemove(e) {
    var offsetX = this.refs.canvas.offsetLeft;
    var offsetY = this.refs.canvas.offsetTop;
    // tell the browser we'll handle this mousemove
    e.preventDefault();
    e.stopPropagation();
    // return if we're not dragging
    if (!isDown) {
        return;
    }
    // get MouseX/Y
    var mouseX = e.clientX - offsetX;
    var mouseY = e.clientY - offsetY;

    // reset iLeft,iRight,iTop,iBottom based on drag
    resizeFunctions[iAnchor](mouseX, mouseY);

    // redraw the resized image
    this.draw(false);
  }
  hitResizeAnchor(x, y) {

    // which borders are under the mouse
    isLeft = (x > iLeft && x < iLeft + border);
    isRight = (x < iRight && x > iRight - border);
    isTop = (y > iTop && y < iTop + border);
    isBottom = (y < iBottom && y > iBottom - border);

    // return the appropriate anchor
    if (isTop && isLeft) {
        return (iOrientation + "TL");
    }
    if (isTop && isRight) {
        return (iOrientation + "TR");
    }
    if (isBottom && isLeft) {
        return (iOrientation + "BL");
    }
    if (isBottom && isRight) {
        return (iOrientation + "BR");
    }
    if (isTop) {
        return ("T");
    }
    if (isRight) {
        return ("R");
    }
    if (isBottom) {
        return ("B");
    }
    if (isLeft) {
        return ("L");
    }
    return (null);
  }



  readImage(ctx){
    if (this.refs.file.files && this.refs.file.files[0] ) {
      var that = this;
      var FR = new FileReader();
      FR.onload = function(e) {
          var img = new Image();
          img.onload = function() {
            iW = img.width;
            iH = img.height;
            iRight = iLeft + iW;
            iBottom = iTop + iH;
            iOrientation = (iW >= iH) ? "Wide" : "Tall";
            that.setState({image:img});
            ctx.drawImage(img,0,0);
          };
          img.src = e.target.result;
      };
      FR.readAsDataURL( this.refs.file.files[0] );
    }
  }
  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    this.uploader = this.refs.file;
    this.uploader.addEventListener("change", this.readImage.bind(this, this.ctx), false);
    this.refs.canvas.onmousedown = this.handleMousedown;
    this.refs.canvas.onmousemove = this.handleMousemove;
    this.refs.canvas.onmouseup = this.handleMouseup;
    this.refs.canvas.onmouseout = this.handleMouseup;

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