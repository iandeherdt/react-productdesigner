import React from 'react'
import ReactDOM from 'react-dom'
import ProductDesigner from '../src/index'

var appElement = document.getElementById('app');

ReactDOM.render(<div>
        <ProductDesigner width={400} height={400} />
      </div>,
  document.getElementById('app')
)