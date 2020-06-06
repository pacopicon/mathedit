import React from 'react';
import { addStyles, EditableMathField } from 'react-mathquill';
import './index.css';

addStyles()

const MathLine = (props) => {

  const handleChange = (mathField) => {
    const latex = mathField.latex()

    props.getLatexPerLine(latex, props.id)
  }

  return <div className='MathQuillWrapper' onFocus={(e) => {props.getId(props.id)}}>
          <EditableMathField
            latex={props.pushedLatex}
            onChange={ mathField => {
              handleChange(mathField)
            }}
          />
        </div>;
}


export default MathLine