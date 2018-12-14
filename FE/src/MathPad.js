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
      orderOfComponents: ''
    }
    this.getStringsPerLine = this.getStringsPerLine.bind(this)
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this)
    this.getLinePosition = this.getLinePosition.bind(this)
    this.insertComponent = this.insertComponent.bind(this)
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

  insertComponent() {
    let { MathLines, cursorLinePosition, orderOfComponents } = this.state
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

    console.log('tempOrder = ', tempOrder)
  
    return {
      tempMathLines,
      tempOrder
    }
  }
  
  handleKeyDownEvents(e) {
    if (e.key == 'Enter') {      
    // Carriage Return
    // e.preventDefault() // e.preventDefault() will not allow further typing in the field.  This function should never be called.
      let {  } = this.state
      
      // let newComponent =  <MathLine
      //                       key={`${rando()}`} 
      //                       getStringsPerLine={this.getStringsPerLine}
      //                       getLinePosition={this.getLinePosition} 
      //                     />

      let res = this.insertComponent()

 

      this.setState({
        MathLines: res.tempMathLines,
        orderOfComponents: [...res.tempOrder]
      }
      , () => {
          let ul = document.getElementById('ul')
          if (ul && ul.children[0] && ul.children[0].childNodes[0] && ul.children[0].childNodes[0].children[0] && ul.children[0].childNodes[0].children[0].children[0]) {
            let ulArr =  ul.children
            let textArea = ulArr[ulArr.length-1].childNodes[0].childNodes[0].childNodes[0]
            if (textArea) {
              textArea.focus()
            }
          }
        }
      )
    } else if (e.key == 'ArrowUp') {
      console.log('going up')
    } else if (e.key == 'ArrowLeft') {
      console.log('e.target.textLength = ', e.target.textLength)
      console.log('e.target.selectionStart = ', e.target.selectionStart)
      console.log('e.target.selectionEnd = ', e.target.selectionEnd)
      console.log('e.target.selectionDirection = ', e.target.selectionDirection)
      console.log('e.target.select = ', e.target.select)
      console.log('e.target.setRangeText = ', e.target.setRangeText)
      console.log('e.target.setSelectionRange = ', e.target.setSelectionRange)
      console.log('e.target.title = ', e.target.title)
      console.log('e.target.tabIndex = ', e.target.tabIndex)
      console.log('e.target.innerText = ', e.target.innerText)
      console.log('e.target.outerText = ', e.target.outerText)
      console.log('e.target.innerHTML = ', e.target.innerHTML)
      console.log('e.target.outerHTML = ', e.target.outerHTML)
      console.log('e.target.scrollLeft = ', e.target.scrollLeft)
      console.log('e.target.click = ', e.target.click)
      // for (let p in e.target) {
      //   console.log('prop = ', p)
      // }
    } else if (e.key == 'ArrowRight') {
      console.log('e.target.textLength = ', e.target.textLength)
      console.log('e.target.selectionStart = ', e.target.selectionStart)
      console.log('e.target.selectionEnd = ', e.target.selectionEnd)
      console.log('e.target.selectionDirection = ', e.target.selectionDirection)
      console.log('e.target.select = ', e.target.select)
      console.log('e.target.setRangeText = ', e.target.setRangeText)
      console.log('e.target.setSelectionRange = ', e.target.setSelectionRange)
      console.log('e.target.title = ', e.target.title)
      console.log('e.target.tabIndex = ', e.target.tabIndex)
      console.log('e.target.innerText = ', e.target.innerText)
      console.log('e.target.outerText = ', e.target.outerText)
      console.log('e.target.innerHTML = ', e.target.innerHTML)
      console.log('e.target.outerHTML = ', e.target.outerHTML)
      console.log('e.target.scrollLeft = ', e.target.scrollLeft)
      console.log('e.target.click = ', e.target.click)
    } else if (e.key == 'Tab') {
      console.log('pressed Tab')
    }
  }
  
  getStringsPerLine(latexStr, index) {
    let { stringsPerLine } = this.state
    stringsPerLine[index] = latexStr
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