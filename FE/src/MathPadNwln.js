import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import MathLine from './MathLine'
import Header from './Header'
import './index.css';

class MathPad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      i: 1
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.returnCarriage = this.returnCarriage.bind(this)
  }

  componentDidUpdate() {
    this.returnCarriage()
  }

  handleKeyPress(e) {
    e.preventDefault()
    if (e.key == 'Enter') {
      this.setState({
        i: this.state.i += 1
      })
    }
  }

  returnCarriage() {
    let ul = document.getElementsByTagName('ul')
    if (ul && ul[0] && ul[0].children && ul[0].children.length > 1) {
      let ulArr =  ul[0].children
      let textArea = ulArr[ulArr.length-1].childNodes[0].childNodes[0].childNodes[0]
        if (textArea) {

          textArea.focus()
        }
    }
  }

  render() {
    let MathLines = []
    for (let i=0; i<this.state.i; i++) {
      MathLines.push(<MathLine key={i} />)
    }

    return (
      <div id='MathPad' onKeyPress={this.handleKeyPress}>
        {/* <MathLine /> */}
        <ul id='MathLines'>{ MathLines }</ul>
        <button onClick={this.returnCarriage}></button>
      </div>
    );
  }
}

export default MathPad;
