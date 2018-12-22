import React, { Component } from 'react';
import MathQuill, { addStyles as addMathquillStyles } from 'react-mathquill';
import './index.css';
import { Form, FormGroup, FormControl } from 'react-bootstrap';

addMathquillStyles()

const initialLatex =
  'f_1=\\left(F_t-F_0\\right)d\\left(t,T\\right)=\\frac{S_t\\left(1+\\frac{r_t}{n}\\right)^{n\\left(T-t\\right)}-S_0\\left(1+\\frac{r_0}{n}\\right)^{nT}}{\\left(1+\\frac{r}{n}\\right)^{n\\left(T-t\\right)}}'

class MathLine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // latex: initialLatex
        latex: ''
    }
    this.mathQuillEl = null

    this.resetField = () => {
      this.mathQuillEl.latex(initialLatex)
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    const { pushedLatex } = this.props
    console.log(`element w/ id = ${this.props.id}: this.props.pushedLatex = ${this.props.pushedLatex}`)
    if (pushedLatex) {
      this.setState({
        latex: pushedLatex
      }, 
      () => {
        this.props.getLatexPerLine(pushedLatex, this.props.id)
      }
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldLatex = this.props.pushedLatex
    const newLatex = nextProps.pushedLatex
    console.log(`element w/ id = ${this.props.id}: this.props.pushedLatex = ${newLatex}`) 
    if (newLatex && oldLatex != newLatex) {
      this.setState({
        latex: newLatex
      }, 
      () => {
        this.props.getLatexPerLine(newLatex, this.props.id)
      }
      )
    }
  }


  handleChange(latex) {
    let { latexLength } = this.state

    this.setState({
      latex
    })
    this.props.getLatexPerLine(latex, this.props.id)
  }

  render() {
    return (
    <div className='MathQuillWrapper' onFocus={(e) => {this.props.getId(this.props.id)}}>
        <MathQuill
          latex={this.state.latex}
          onChange={(latex) => {
            this.handleChange(latex)
          }}
          mathquillDidMount={el => {
            this.mathQuillEl = el
          }}
        />
      </div>
    );
  }
}


export default MathLine