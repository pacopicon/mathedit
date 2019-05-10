import React, { Component } from 'react';
import MathLine from './MathLine'
import Header from './Header'
import './index.css';
import { rando, processStr } from './utils'

class MathPad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MathLines: '',
      latexPerLine: [],
      currentMathLineId: '',
      cursorTextPosition: '',
      orderOfComponents: '',
      cursorReport: '',
      cursorLatexPositionSnippet: ''
    }
    this.getLatexPerLine = this.getLatexPerLine.bind(this)
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this)
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
        pushedLatex={pushedLatex}
        getId={this.getId}
      />
    )
  }

  componentDidUpdate() {
    
  }

  componentWillMount() {
    const id = rando()
    const temp = [id]
    this.setState({
      MathLines: [this.createMathLineElement(id, '')],
      orderOfComponents: temp
    })
  }

  getCurrentMathLineIndex() {
    let { currentMathLineId, orderOfComponents } = this.state
    const i = orderOfComponents.indexOf(currentMathLineId)
    return i
  }

  returnSelectedText(snippet, string) {
    // const snip = processStr(snippet);
    // const processedString = processStr(string);
    const snip = snippet
    const processedString = string
    const remainder = processedString.replace(snip, '');
    // console.log(`returnSelectedText: snippet = ${snippet}, string = ${string}, processedString = ${processedString}, snip = ${snip}, remainder = ${remainder}`)
    console.log(`returnSelectedText: snip = ${snip}, remainder = ${remainder}`)
    return {
      remainder,
      snip
    }
  }

  insertComponent() {
    let { MathLines, latexPerLine } = this.state
    let tempMathLines = [...MathLines]
    const i = this.getCurrentMathLineIndex()
    let tempOrder = []
    let id = ''
    let selection = window.getSelection()
    
    let snippet = selection.toString()
    console.log('snippet = ', snippet)

    let snip = ''
    let remainder = ''
    const current = i
    const next = i+1

    if (snippet) {
      const string = latexPerLine[current]
      let result = this.returnSelectedText(snippet, string)
      console.log('result = ', result)
      remainder = result.remainder
      latexPerLine[current] = remainder
      snip = result.snip
      // latexPerLine[next] = snip
      id = rando()
      const currentComponent = this.createMathLineElement(id, remainder)
      tempMathLines[current] = currentComponent
    }
    id = rando()
    const newComponent = this.createMathLineElement(id, snip)
    
    tempMathLines.splice(next, 0, newComponent)
    latexPerLine.splice(next, 0, snip)

    tempMathLines.map( mathline => {
      // console.log('mathline = ', mathline)
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
        }
      }
    )
  }

  getId(Id) {
    this.setState({
      currentMathLineId: Id
    })
  }

  handleKeyDownEvents(e) {   
    if (e.key == 'Enter') {      
      // Carriage Return
      this.insertComponent()
      this.getCursorPositionReport()
    } else {
      this.getCursorPositionReport()
    }
  }

  handleFocus(e) {
    this.getCursorPositionReport()
  }

  getCursorPositionReport() {
    let el     = document.getElementById('ul')
    // let e     = document.querySelector('.mq-root-block:last-child')
    let afterCursorVar = document.querySelector('.mq-cursor + var')
    let afterCursorSpan = document.querySelector('.mq-cursor + span')
    let beforeCursorVar = document.querySelector('.mq-cursor ~ var')
    let beforeCursorSpan = document.querySelector('.mq-cursor ~ span')
    let afterCursor = afterCursorVar ? afterCursorVar : afterCursorSpan
    let beforeCursor = beforeCursorVar ? beforeCursorVar : beforeCursorSpan

    let cursorParent = document.querySelector('.mq-hasCursor')

    // const getSmallestNode2 = (list, _output, isNested) => {
    //   let output = _output && _output.length > 0 ? _output : []
    //   console.log('list = ', list)
    //   console.log('list.children = ', list.children)
    //   if (isNested) {
    //     list = list.children
    //   }
    //   for (let i=0; i<list.length; i++) {
    //     let child = list[i]
    //     if (child.children.length == 0 && !child.attributes[0].nodeValue.includes('mq-cursor')) {
    //       console.log('list = ', list)
    //       console.log('child = ', child)
    //       let obj = {}
    //       obj.var = child.innerText
    //       obj.tag = child.nodeName
    //       obj.id  = child.attributes['mathquill-command-id'].nodeValue
    //       output.push(obj)
    //     } else if (child.children.length > 0 && !child.attributes[0].nodeValue.includes('mq-cursor')) {
    //       console.log('______')
    //       console.log('child = ', child)
    //       console.log('child.children = ', child.children)
    //       let list = child
    //       output = [...output,...getSmallestNode(list, output, true)]
    //     }
    //   }
    //   return output
    // }

    const getSmallestNode = (list, isNested) => {
      const output = []
      // console.log('list = ', list)
      // console.log('list[0] = ', list[0])
      // console.log('list.children = ', list.children)
      if (isNested) {
        list = list[0] ? list[0] : list 
        list = list.children
      }
      for (let i=0; i<list.length; i++) {
        let child = list[i]
        // if (!child.attributes[0].nodeValue.includes('mq-cursor')) {
          // console.log('list = ', list)
          // console.log('child = ', child)
          // console.log('child.attributes = ', child.attributes)
          let obj   = {}
          obj.value = child.children.length == 0 ? child.innerText : getSmallestNode(child, true)
          obj.name  = child.className ? child.className : child.nodeName
          if (child.attributes && child.attributes['mathquill-command-id'] && child.attributes['mathquill-command-id'].nodeValue) {
            obj.id    = child.attributes['mathquill-command-id'].nodeValue
          } else if (child.attributes && child.attributes['mathquill-block-id'] && child.attributes['mathquill-block-id'].nodeValue) {
            obj.id    = child.attributes['mathquill-block-id'].nodeValue
          } else {
            obj.id    = ''
          }
          
          output.push(obj)
        // }
      }
      return output
    }
    
    
    // if (afterCursor && afterCursor.attributes) {
    let AC, CP, CPC, BC, E, isLast = false

    if (el && el.children[0] && el.children[0].childNodes[0] && el.children[0].childNodes[0].children[0] && el.children[0].childNodes[0].children[0].children[0]) {
      let list = el.children[0].childNodes[0].children[1].children

      // E = list
      
      // E = []
      // for (let i=0; i<list.length; i++) {
      //   let item = list[i]
      //   if (item.children.length == 0) {
      //     let obj
      //     E.push(item)
      //   }
      // }
      E = getSmallestNode(list)
    }

    if (afterCursor && afterCursor.attributes) {
      AC = afterCursor.attributes['mathquill-command-id'].value ? afterCursor.attributes['mathquill-command-id'].value : ''
    }
    if (beforeCursor && beforeCursor.attributes && beforeCursor.attributes['mathquill-command-id']) {
      BC = beforeCursor.attributes['mathquill-command-id'].value ? beforeCursor.attributes['mathquill-command-id'].value : ''
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
        BC,
        E,
        isLast 
      }
      this.setState({
        cursorReport
      })
      // console.dir(`AC = ${AC}, CP = ${CP}, CPC = ${CPC}, BC = ${BC}, E = ${E}, isLast = ${isLast}`)
      console.log('E =', E)
    // }
  }

  
  getLatexPerLine(latex, id) {
    let { latexPerLine } = this.state
    const i = this.getCurrentMathLineIndex(id)
    latexPerLine[i] = latex
    console.log('latex = ', latex)
    this.setState({
      latexPerLine
    }, () => {
      this.getCursorPositionReport()
    })
  }

  render() {
    let { MathLines } = this.state
    return (
      <div id="MathPad" onKeyDown={this.handleKeyDownEvents} onMouseDown={this.handleFocus}>
        <Header />
        <ul id='ul'>{ MathLines }</ul>
      </div>
    );
  }
}

export default MathPad;