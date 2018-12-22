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
    this.getCurrentMathLineIndex = this.getCurrentMathLineIndex.bind(this)
    this.returnSelectedText = this.returnSelectedText.bind(this)
    this.createMathLineElement = this.createMathLineElement.bind(this)
  }

  createMathLineElement(id, pushedLatex) {
    return (
      <MathLine 
        key={id} 
        id={id}
        getLatexPerLine={this.getLatexPerLine}
        getLinePosition={this.getLinePosition}
        pushedLatex={pushedLatex}
        getId={this.getId}
      />
    )
  }

  // componentWillUnmount() {
  //   this.setState({
  //     latexPerLine: []
  //   })
  // }

  componentWillMount() {
    const id = rando()
    const temp = [id]
    this.setState({
      MathLines: [this.createMathLineElement(id, '')],
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

  processStr(str){
    let res = str.replace(/(\\)/g, "\\\\");
    return res;
  };

  returnSelectedText(snippet, string) {
    const snip = this.processStr(snippet);
    const remainder = string.replace(snip, '');
    return {
      remainder,
      snip
    }
  }

  insertComponent() {
    let { MathLines, latexPerLine, currentMathLineId } = this.state
    let tempMathLines = [...MathLines]
    const i = this.getCurrentMathLineIndex()
    const id = rando()
    let tempOrder = []

    let selection = window.getSelection()
    let snippet = selection.toString()

    let snip = ''
    let remainder = ''
    const current = i
    const next = i+1

    if (snippet) {
      const string = latexPerLine[current]
      console.log('latexPerLine[current] = ', latexPerLine[current])
      let result = this.returnSelectedText(snippet, string)
      remainder = result.remainder
      latexPerLine[current] = remainder
      snip = result.snip + (latexPerLine[next] ? latexPerLine[next] : '')
      latexPerLine[next] = snip
      const id = rando()
      const currentComponent = this.createMathLineElement(id, remainder)
      tempMathLines[current] = currentComponent

      // let ul = document.getElementById('ul')
      // let ulArr =  ul.children
      // let textArea = ulArr[i].childNodes[0].childNodes[0].childNodes[0].innerText = remainder
      // console.log(textArea)
      this.forceUpdate()
    }
    

    
     
    const newComponent = this.createMathLineElement(id, snip)
    
    
    tempMathLines.splice(next, 0, newComponent)

    tempMathLines.map( mathline => {
      console.log('mathline = ', mathline)
      tempOrder.push(mathline.props.id)
    })

    this.setState({
      MathLines: tempMathLines,
      latexPerLine,
      orderOfComponents: [...tempOrder]
    }, () => {
        let ul = document.getElementById('ul')
        if (ul && ul.children[0] && ul.children[0].childNodes[0] && ul.children[0].childNodes[0].children[0] && ul.children[0].childNodes[0].children[0].children[0]) {
          let ulArr =  ul.children
          let textArea = ulArr[i+1].childNodes[0].childNodes[0].childNodes[0]
          if (textArea) {
            textArea.focus()
          }
          // if (window.getSelection()) {
          //   console.log('there was a selection')
          //   console.log('window.getSelection() = ', window.getSelection())
          // }
        }
        this.getCursorPositionReport()
      })

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

  getCurrenLineId(Id) {
    this.setState({
      currentMathLineId: Id
    })
  }
  
  handleKeyDownEvents(e) {   
    if (e.key == 'Enter') {      
      // Carriage Return
      // e.preventDefault() // e.preventDefault() will not allow further typing in the field.  This function should never be called.
      this.insertComponent()
      
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
      <div id="MathPad" onFocus={this.handleFocus} onKeyDown={this.handleKeyDownEvents} onMouseDown={this.handleMouseDown}>
        <Header />
        <ul id='ul'>{ MathLines }</ul>
      </div>
    );
  }
}

export default MathPad;