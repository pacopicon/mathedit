import React, { Component } from 'react';
// import Latex from 'react-latex';
import axiosPost from './api'
// const { convert } = require('./mathquill')

class NotePad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      html: ''
    }
    this.handleInput = this.handleInput.bind(this)
  }

  // convert('\\frac{1}{2}x^3') {
    
  // }

  handleInput(e) {
    let latexStr = e.target.value
    axiosPost(latexStr, (err, html) => {
      if (err) {
        console.log(err)
      } else {
        this.setState({
          html: this.state.html + html
        })
      }
    })
  }

  // <Latex>
  //           $ (1+S_b)^b=(1+S_a)^a(1+(frac(1+S_b)^b (1+S_a)^a)^dfrac 1 b-a-1)^b-a $
  //         </Latex>

  render() {
    let { html } = this.state
    return (
      <div className="NotePad">
        <input type="text" value={html} onChange={this.handleInput}></input>
      </div>
    );
  }
}

export default NotePad;
