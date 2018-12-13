import React, { Component } from 'react';
import MathLine from './MathLine'
import MathPad2 from './MathPad2'
import Header from './Header'
import './index.css';

class MathPad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      i: 1,
      MathLines: [],
      stringsPerLine: []
    }

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.returnCarriage = this.returnCarriage.bind(this)
    this.getStringsPerLine = this.getStringsPerLine.bind(this)
    this.renderMathLines = this.renderMathLines.bind(this)

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
    console.log('this kicked off')
    let ul = document.getElementsByTagName('ul')
    console.log('ul = ', ul)
    if (ul && ul[0] && ul[0].children && ul[0].children.length > 1) {
      let ulArr =  ul[0].children
      let textArea = ulArr[ulArr.length-1].childNodes[0].childNodes[0].childNodes[0]
      console.log('textArea = ', textArea)
        if (textArea) {
          textArea.focus()
        }
    }
  }
  
  getStringsPerLine(latexStr, index) {
    let { stringsPerLine } = this.state
    stringsPerLine[index] = latexStr
    this.setState({
      stringsPerLine
    })
  }

  renderMathLines() {
    let { MathLines } = this.state
    for (let i=0; i<this.state.i; i++) {
      MathLines.push(
        <MathLine key={i} index={i} />
      )
    }
    return (
      <ul>{ MathLines }</ul>
    )
  }

  render() {
    return (
      <div id="MathPad">
        <Header />
        {this.renderMathLines()}
      </div>
    );
  }
}

export default MathPad;