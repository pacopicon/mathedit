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
      latexPerLine: [],
      countPerLine: [],
      currentMathLineId: '',
      cursorTextPosition: '',
      orderOfComponents: '',
      cursorReport: '',
      cursorLatexPositionSnippet: ''
    }
    this.getLatexPerLine = this.getLatexPerLine.bind(this)
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this)
    this.getLinePosition = this.getLinePosition.bind(this)
    this.getCursorPositionReport = this.getCursorPositionReport.bind(this)
    this.insertComponent = this.insertComponent.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.getId = this.getId.bind(this)
    this.dropId = this.dropId.bind(this)
    this.getCurrentMathLineIndex = this.getCurrentMathLineIndex.bind(this)
  }

  componentWillMount() {
    const id = rando()
    const temp = [id]
    this.setState({
      MathLines: [
        <MathLine 
          key={id} 
          id={id}
          getLatexPerLine={this.getLatexPerLine}
          getLinePosition={this.getLinePosition}
          getId={this.getId}
          dropId={this.dropId} 
        />
      ],
      orderOfComponents: temp
    })
  }

  // componentDidUpdate() {
  //   let hasCursorParent = document.getElementsByClassName('.mq-hasCursor').parentElement
  //   console.log('parentElement in didMount = ', hasCursorParent)
  // }

  getCurrentMathLineIndex() {
    let { currentMathLineId, orderOfComponents } = this.state
    const i = orderOfComponents.indexOf(currentMathLineId)
    return i
  }

  insertComponent(MathLines) {
    
    let tempMathLines = [...MathLines]
    let pos = this.getCurrentMathLineIndex() + 1
    const id = rando()
    let tempOrder = []

    let newComponent = <MathLine
                          key={id}
                          id={id} 
                          getLatexPerLine={this.getLatexPerLine}
                          getLinePosition={this.getLinePosition}
                          getId={this.getId}
                          dropId={this.dropId} 
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

  getId(Id) {
    this.setState({
      currentMathLineId: Id
    })
  }

  dropId(Id) {
    let { currentMathLineId } = this.state
    if (Id == currentMathLineId) {
      this.setState({
        currentMathLineId: null
      })
    }
  }
  
  handleKeyDownEvents(e) {
    let { orderOfComponents } = this.state
    let _root = document.getElementsByClassName('mq-root-block')
    let rootNode = (document.getElementsByClassName('mq-root-block'))[0]
    console.log('_root = ', _root)
    console.log('rootNode = ', rootNode)

    let selection = window.getSelection().toString()
    console.log('selection = ', selection)


    let afterCursorVar = document.querySelector('.mq-cursor + var')
    let afterCursorSpan = document.querySelector('.mq-cursor + span')
    let afterCursor = afterCursorVar ? afterCursorVar : afterCursorSpan

    let end = document.querySelector('.mq-root-block')

    let range = document.createRange()
    // range.setStart(afterCursor, 0)
    // range.setEnd()

    // let id = this.state.mathLineId
    //   let i = this.state.orderOfComponents.indexOf(id)
    // let latexStr = new String(this.state.latexPerLine[i])
    
    // this.getCursorAdjacentString()
    // console.log('window.getSelection() = ', window.getSelection())
    if (e.key == 'Enter') {      
      // Carriage Return
      // e.preventDefault() // e.preventDefault() will not allow further typing in the field.  This function should never be called.
      let { MathLines } = this.state
      let res = this.insertComponent(MathLines)

        this.setState({
          MathLines: res.tempMathLines,
          orderOfComponents: [...res.tempOrder]
        }, () => {
            let ul = document.getElementById('ul')
            if (ul && ul.children[0] && ul.children[0].childNodes[0] && ul.children[0].childNodes[0].children[0] && ul.children[0].childNodes[0].children[0].children[0]) {
              let ulArr =  ul.children
              let textArea = ulArr[res.pos].childNodes[0].childNodes[0].childNodes[0]
              if (textArea) {
                textArea.focus()
              }
              // if (window.getSelection()) {
              //   console.log('there was a selection')
              //   console.log('window.getSelection() = ', window.getSelection())
              // }
            }
            this.getCursorPositionReport()
          }
        )
      } else if (e.key  && e.key != 'Tab' && e.key != 'Escape' && e.key != 'F5'      && e.key != 'Shift' 
                        && e.key != 'Alt' && e.key != 'Meta'   && e.key != 'Control' && e.key != 'CapsLock') {
        

        this.getCursorPositionReport()

        if (e.key == 'ArrowUp') {

        } else if (e.key == 'ArrowDown') {

        }

        console.log('selection = ', window.getSelection().toString())

        if (e.key != 'Backspace' && e.key != 'ArrowUp'    && e.key != 'ArrowLeft' 
                                 && e.key != 'ArrowRight' && e.key != 'ArrowDown') {

          let strokeCountMod = 1
          // console.log('e.key = ', e.key)
          if (e.key == '/') {
            strokeCountMod += 2
          }

          
          /////////////
          // Todo: need to create more strokeCountMod conditions

          let id = this.state.currentMathLineId
          let { countPerLine } = this.state
          const i = this.getCurrentMathLineIndex(id)

          countPerLine[i] = countPerLine[i] > 3 ? countPerLine[i] + strokeCountMod : 4

          this.setState({
            countPerLine
          })
        }
    
    } 
  }

  // console.log(`AC: ${afterCursor.attributes['mathquill-command-id'].value ? afterCursor.attributes['mathquill-command-id'].value : ''}, CP: ${cursorParent.attributes['mathquill-block-id'].value ? cursorParent.attributes['mathquill-block-id'].value : ''}`)

  handleFocus(e) {
    this.getCursorPositionReport()
  }

  getCursorPositionReport() {
    let afterCursorVar = document.querySelector('.mq-cursor + var')
    let afterCursorSpan = document.querySelector('.mq-cursor + span')
    let afterCursor = afterCursorVar ? afterCursorVar : afterCursorSpan

    let cursorParent = document.querySelector('.mq-hasCursor')
    
    
    // if (afterCursor && afterCursor.attributes) {
    let AC, CP, CPC, isLast = false

    if (afterCursor && afterCursor.attributes) {
      AC = afterCursor.attributes['mathquill-command-id'].value ? afterCursor.attributes['mathquill-command-id'].value : ''
    }
    if (cursorParent && cursorParent.attributes && cursorParent.attributes['mathquill-block-id']) {
      CP = cursorParent.attributes['mathquill-block-id'].value ? cursorParent.attributes['mathquill-block-id'].value : ''
      CPC = cursorParent.attributes['class'].value ? cursorParent.attributes['class'].value : '' 
    }
    if (CP && !AC) {
      isLast = true
    }
      let cursorReport = {
        AC,
        CP,
        CPC,
        isLast 
      }
      this.setState({
        cursorReport
      })
      console.dir(cursorReport)
    // }
  }

  // TODO: The latex parser goes in the function below.  it creates an array of object elements -- the correlations between specific latex atoms and html ids.
  
  getLatexPerLine(latex, id) {
    let { latexPerLine } = this.state
    const i = this.getCurrentMathLineIndex(id)
    latexPerLine[i] = latex
    this.setState({
      latexPerLine
    })
  }

  getLinePosition(i) {
    console.log('i = ', i)
    this.setState({
      mathLineId: i
    })
  }

  render() {
    let { MathLines } = this.state
    return (
      <div id="MathPad" onFocus={this.handleFocus} onKeyDown={this.handleKeyDownEvents}>
        <Header />
        <ul id='ul'>{ MathLines }</ul>
      </div>
    );
  }
}

export default MathPad;