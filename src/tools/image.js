var border = 10;
var isLeft = false;
var isRight = false;
var isTop = false;
var isBottom = false;
var iAnchor;
var draggingImage = false;
var resizing = false;
var iW;
var iH;
var iLeft = 50;
var iTop = 50;
var iRight, iBottom, iOrientation;
var startX;
var startY;

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

class ImageTools {
  constructor(canvas, file) {
    this.canvas = canvas;
    this.file = file;
    this.ctx = this.canvas.getContext('2d');
    this.file.addEventListener("change", this.readImage.bind(this, this.ctx), false);
    this.image = null;
    this.draw = this.draw.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
  }

  draw(withAnchors, withBorders) {
    if(this.image){
      let cx = iLeft + (iRight - iLeft) / 2;
      let cy = iTop + (iBottom - iTop) / 2;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.image, iLeft, iTop, iRight - iLeft, iBottom - iTop);
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
      // optionally draw the connecting anchor lines
      if (withBorders) {
          this.ctx.beginPath();
          this.ctx.moveTo(iLeft, iTop);
          this.ctx.lineTo(iRight, iTop);
          this.ctx.lineTo(iRight, iBottom);
          this.ctx.lineTo(iLeft, iBottom);
          this.ctx.closePath();
          this.ctx.stroke();
      }
    }
  }
  handleMousedown(e) {
    var offsetX = this.canvas.offsetLeft;
    var offsetY = this.canvas.offsetTop;
    // tell the browser we'll handle this mousedown
    e.preventDefault();
    e.stopPropagation();
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    iAnchor = this.hitResizeAnchor(startX, startY);
    resizing = (iAnchor);
    draggingImage = !resizing && this.hitImage(startX, startY);
  }

  handleMouseup(e) {
    e.preventDefault();
    e.stopPropagation();
    resizing = false;
    draggingImage = false;
    this.draw(true);
  }

  handleMousemove(e) {
    var offsetX = this.canvas.offsetLeft;
    var offsetY = this.canvas.offsetTop;
    // tell the browser we'll handle this mousemove
    e.preventDefault();
    e.stopPropagation();
    // return if we're not dragging
    if (!resizing && !draggingImage) {
        return;
    }
    // get MouseX/Y
    var mouseX = e.clientX - offsetX;
    var mouseY = e.clientY - offsetY;

    // reset iLeft,iRight,iTop,iBottom based on drag
    if(resizing){
      resizeFunctions[iAnchor](mouseX, mouseY);
      this.draw(false, true);
    }else if(draggingImage){
        // move the image by the amount of the latest drag
        var dx = mouseX - startX;
        var dy = mouseY - startY;
        iLeft += dx;
        iTop += dy;
        iRight += dx;
        iBottom += dy;
        // reset the startXY for next time
        startX = mouseX;
        startY = mouseY;

        // redraw the image with border
        this.draw(false, true);
    }
  }
  hitImage(x, y) {
    return (x > iLeft && x < iLeft + iW && y > iTop && y < iTop + iH);
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
    if (this.file.files && this.file.files[0] ) {
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
            that.image = img;
            ctx.drawImage(img,0,0);
          };
          img.src = e.target.result;
      };
      FR.readAsDataURL( this.file.files[0] );
    }
  }
}

export default ImageTools;