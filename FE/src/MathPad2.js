import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import MathQuill, { addStyles as addMathquillStyles } from 'react-mathquill';
import MathLine from './MathLine2'
import Header from './Header'
import './index.css';


addMathquillStyles()
const initialLatex =
  '\\cos\\left(A\\right)=\\frac{b^2+c^2-a^2}{2\\cdot b\\cdot c}'

class MathPad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      i: 1,
      latex: initialLatex
      // ,
      // stringsPerLine: []
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.returnCarriage = this.returnCarriage.bind(this)
    this.getStringsPerLine = this.getStringsPerLine.bind(this)

    this.mathQuillEl = null

    this.resetField = () => {
      this.mathQuillEl.latex(initialLatex)
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidUpdate() {
    this.returnCarriage()
  }

  handleChange(latex) {
    // e.preventDefault()
    // let latex = e.target.value
    this.setState({
      latex
    })
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
    // console.log('ul = ', ul)
    // if (ul && ul[0] && ul[0].children && ul[0].children.length > 1) {
      let ulArr =  ul[0].children
      let textArea = ulArr[ulArr.length-1].childNodes[0].childNodes[0].childNodes[0]
      console.log('textArea = ', textArea)
        if (textArea) {
          textArea.focus()
        }
    // }
  }

  getStringsPerLine(latexStr, index) {
    let { stringsPerLine } = this.state
    stringsPerLine[index] = latexStr
    this.setState({
      stringsPerLine
    })
  }

  render() {
    let { latex } = this.state

    let MathLines = []
    for (let i=0; i<this.state.i; i++) {
      MathLines.push(
        <MathLine 
          key={i} 
          // index={i}
          // getStringsPerLine={this.getStringsPerLine} 
        />
      )
    }

    return (
      <div id='MathPad' onKeyPress={this.handleKeyPress}>
        <Header />
        { MathLines }
        <MathLine />
        <MathQuill
          latex={latex}
          onChange={latex => {
            this.handleChange(latex)
          }}
          mathquillDidMount={el => {
            this.mathQuillEl = el
          }}
        />
        {/* <ul id='MathLines'>{ MathLines }</ul> */}
        <button onClick={this.returnCarriage}></button>
      </div>
    );
  }
}

export default MathPad;
