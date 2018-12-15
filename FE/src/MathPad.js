import React, { Component } from 'react';
import MathLine from './MathLine'
import Header from './Header'
import './index.css';
import { insertComponent, rando } from './utils'

class MathPad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MathLines: '',
      stringsPerLine: [],
      cursorLinePosition: '',
      cursorTextPosition: '',
      orderOfComponents: ''
    }
    this.getStringsPerLine = this.getStringsPerLine.bind(this)
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this)
    this.getLinePosition = this.getLinePosition.bind(this)
    this.insertComponent = this.insertComponent.bind(this)
    this.getCursorAdjacentString = this.getCursorAdjacentString.bind(this)
  }

  componentWillMount() {
    const id = rando()
    const temp = [id]
    this.setState({
      MathLines: [
        <MathLine 
          key={id} 
          id={id}
          getStringsPerLine={this.getStringsPerLine}
          getLinePosition={this.getLinePosition} 
        />
      ],
      orderOfComponents: temp
    })
  }

  insertComponent(MathLines, cursorLinePosition, orderOfComponents) {
    
    let tempMathLines = [...MathLines]
    let pos = orderOfComponents.indexOf(cursorLinePosition) + 1
    const id = rando()
    let tempOrder = []

    let newComponent = <MathLine
                          key={id}
                          id={id} 
                          getStringsPerLine={this.getStringsPerLine}
                          getLinePosition={this.getLinePosition} 
                        />
  
    tempMathLines.splice(pos, 0, newComponent)

    tempMathLines.map( mathline => {
      tempOrder.push(mathline.props.id)
    })
  
    return {
      tempMathLines,
      tempOrder,
      pos
    }
  }
  
  getCursorAdjacentString() {
    let space = document.getElementsByClassName('mq-root-block')
    let spaceChildren = space[0].children

    console.log('spaceChildren = ', spaceChildren)




    // let cursor = document.getElementsByClassName('mq-cursor')
    // let enclosingParentheses = document.querySelector('.mq-paren + .mq-hasCursor')
    // let cursorParent = document.querySelector('.mq-hasCursor')
    // let curParChildren = cursorParent.children
    // let nextVar = document.querySelector('.mq-cursor + var')
    // let nextSpan = document.querySelector('.mq-cursor + span')
    // let nextElement = nextVar ? nextVar : nextSpan

    // console.log('cursor = ', cursor)
    // console.log('enclosingParentheses = ', enclosingParentheses)
    // if (enclosingParentheses) {
    //   console.log('enclosingParentheses.length = ', enclosingParentheses.length)
    // }
    // console.log('nextElement = ', nextElement)
    // console.log('cursorParent = ', cursorParent)
    // console.log('curParChildren = ', curParChildren)
    // console.log('curParChildren[0].innerText = ', curParChildren[0].innerText)
  }
  handleKeyDownEvents(e) {
    // let id = this.state.cursorLinePosition
    //   let i = this.state.orderOfComponents.indexOf(id)
    // let latexStr = new String(this.state.stringsPerLine[i])
    
    this.getCursorAdjacentString()
    if (e.key == '0') {

    } else if (e.key == 'Enter') {      
    // Carriage Return
    // e.preventDefault() // e.preventDefault() will not allow further typing in the field.  This function should never be called.
    let { MathLines, cursorLinePosition, orderOfComponents } = this.state
    let res = this.insertComponent(MathLines, cursorLinePosition, orderOfComponents)

 

      this.setState({
        MathLines: res.tempMathLines,
        orderOfComponents: [...res.tempOrder]
      }
      , () => {
          let ul = document.getElementById('ul')
          if (ul && ul.children[0] && ul.children[0].childNodes[0] && ul.children[0].childNodes[0].children[0] && ul.children[0].childNodes[0].children[0].children[0]) {
            let ulArr =  ul.children
            let textArea = ulArr[res.pos].childNodes[0].childNodes[0].childNodes[0]
            if (textArea) {
              textArea.focus()
            }
          }
        }
      )
    } else if (e.key == 'ArrowUp') {
  
    } else if (e.key == 'ArrowLeft') {
      
    } else if (e.key == 'ArrowRight') {
     
    } else if (e.key == 'Tab') {
    }
  }
  
  getStringsPerLine(latexStr, id) {
    let { stringsPerLine, orderOfComponents } = this.state
    const i = orderOfComponents.indexOf(id)
    stringsPerLine[i] = latexStr
    this.setState({
      stringsPerLine
    })
  }

  getLinePosition(e, i) {
    e.preventDefault()
    console.log('i = ', i)
    this.setState({
      cursorLinePosition: i
    })
  }

  render() {
    let { MathLines } = this.state
    return (
      <div id="MathPad" onKeyDown={this.handleKeyDownEvents}>
        <Header />
        {/* {this.renderMathLines()} */}
        <ul id='ul'>{ MathLines }</ul>
      </div>
    );
  }
}

export default MathPad;