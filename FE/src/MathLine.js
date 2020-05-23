import React, { Component } from 'react';
import MathQuill, { addStyles, EditableMathField } from 'react-mathquill';
import './index.css';
import { Form, FormGroup, FormControl } from 'react-bootstrap';

addStyles()

const initialLatex =
  'f_1=\\left(F_t-F_0\\right)d\\left(t,T\\right)=\\frac{S_t\\left(1+\\frac{r_t}{n}\\right)^{n\\left(T-t\\right)}-S_0\\left(1+\\frac{r_0}{n}\\right)^{nT}}{\\left(1+\\frac{r}{n}\\right)^{n\\left(T-t\\right)}}'

const o = 'f_1=\left(F_t-F_0\right)d\left(t,T\right)=\frac{S_t\left(1+\frac{r_t}{n}\right)^{n\left(T-t\right)}-S_0\left(1+\frac{r_0}{n}\right)^{nT}}{\left(1+\frac{r}{n}\right)^{n\left(T-t\right)}}'

const quad = 'x=\frac{-b\pm \sqrt{\left(b^2-4ac\right)}}{2a}'

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
    if (pushedLatex) {
      console.log(`element w/ id = ${this.props.id}: this.props.pushedLatex = ${this.props.pushedLatex}`)
      this.setState({
        latex: pushedLatex
      }
      // , 
      // () => {
      //   this.props.getLatexPerLine(pushedLatex, this.props.id)
      // }
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldLatex = this.props.pushedLatex
    const newLatex = nextProps.pushedLatex
    
    if (newLatex && oldLatex != newLatex) {
      console.log(`element w/ id = ${this.props.id}: this.props.pushedLatex = ${newLatex}`) 
      this.setState({
        latex: newLatex
      }
      // , 
      // () => {
      //   this.props.getLatexPerLine(newLatex, this.props.id)
      // }
      )
    }
  }


  handleChange(mathField) {
    this.setState({
      latex: mathField.latex()
    }, () => {
      this.props.getLatexPerLine(this.state.latex, this.props.id)
    })
    
  }

  render() {
    return (
    <div className='MathQuillWrapper' onFocus={(e) => {this.props.getId(this.props.id)}}>
        <EditableMathField
          latex={this.state.latex}
          onChange={ mathField => {
            this.handleChange(mathField)
          }}
        />
      </div>
    );
  }
}


export default MathLine