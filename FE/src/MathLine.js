import React, { Component } from 'react';
import MathQuill, { addStyles as addMathquillStyles } from 'react-mathquill';
import './index.css';
import { Form, FormGroup, FormControl } from 'react-bootstrap';

const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`
const tex2 = `\\frac{125\\left(1+\\frac{0.1}{2}\\right)^{2\\left(1-0.5\\right)}-100\\left(1+\\frac{0.1}{2}\\right)^{2\\cdot \\:1}}{\\left(1+\\frac{0.1}{2}\\right)^{2\\left(1-0.5\\right)}}`
const tex3 = `\\sum\\limits^{n=100}_{i=1}`
const content = `This can be dynamic text (e.g. user-entered) text with tex math embedded in $$ symbols like $$${tex3}$$`

addMathquillStyles()

const initialLatex =
  '\\cos\\left(A\\right)=\\frac{b^2+c^2-a^2}{2\\cdot b\\cdot c}'

class MathLine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latex: initialLatex
    }
    this.mathQuillEl = null

    this.resetField = () => {
      this.mathQuillEl.latex(initialLatex)
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(latex) {
    // e.preventDefault()
    // let latex = e.target.value
    this.setState({
      latex
    })
  }

  render() {
    let { latex } = this.state
    return (
      <div>
        <MathQuill
          latex={latex}
          onChange={latex => {
            this.handleChange(latex)
          }}
          mathquillDidMount={el => {
            this.mathQuillEl = el
          }}
        />  
        {/* <button onClick={this.resetField}>Reset field</button> */}
      </div>
    );
  }
}


export default MathLine