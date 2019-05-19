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
      prevLatexPerLine: [],
      latexPerLine: [],
      measuredLatexPerLine: [],
      currentMathLineId: '',
      cursorPos: '',
      orderOfComponents: '',
      cursorReport: '',
      cursorLatexPositionSnippet: '',
      numStrokes: 0,
      mod: 0
    }
    this.getLatexPerLine = this.getLatexPerLine.bind(this)
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this)
    this.convertLatexToObject = this.convertLatexToObject.bind(this)
    this.insertComponent = this.insertComponent.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.getId = this.getId.bind(this)
    this.getCurrentMathLineIndex = this.getCurrentMathLineIndex.bind(this)
    this.returnSelectedText = this.returnSelectedText.bind(this)
    this.createMathLineElement = this.createMathLineElement.bind(this)
    this.getIndexFromLatex = this.getIndexFromLatex.bind(this)
    this.moveCursor = this.moveCursor.bind(this)
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
    // console.log(`returnSelectedText: snip = ${snip}, remainder = ${remainder}`)
    return {
      remainder,
      snip
    }
  }

  insertComponent() {
    let { MathLines, latexPerLine, cursorPos } = this.state
    let afterCursor = cursorPos.a
    let tempMathLines = [...MathLines]
    const i = this.getCurrentMathLineIndex()
    let tempOrder = []
    let id = ''
    // let selection = window.getSelection()
    
    // let snippet = selection.toString()
    // console.log('snippet = ', snippet)

    // let snip = ''
    // let remainder = ''
    const current = i
    const next = i+1

    // if (snippet) {
      const string = latexPerLine[current]
      // let result = this.returnSelectedText(snippet, string)
      // console.log('result = ', result)
      const remainder = string.slice(0, afterCursor)
      latexPerLine[current] = remainder
      const snip = string.slice(afterCursor)
      // latexPerLine[next] = snip
      id = rando()
      const currentComponent = this.createMathLineElement(id, remainder)
      tempMathLines[current] = currentComponent
    // }
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
        const latex = this.state.latexPerLine[next]
        this.getIndexFromLatex(latex, 0)
      }
    )
  }

  moveCursor() {
    const i = this.getCurrentMathLineIndex()
    let ul = document.getElementById('ul')
        if (ul && ul.children[0] && ul.children[0].childNodes[0] && ul.children[0].childNodes[0].children[0] && ul.children[0].childNodes[0].children[0].children[0]) {
          let ulArr =  ul.children
          let textArea = ulArr[i+1].childNodes[0].childNodes[0].childNodes[0]
          if (textArea) {
            textArea.focus()
          }
        }
  }

  getIndexFromLatex(latex, _mod) {
    this.setState({
      mod: this.state.mod + _mod
    }, () => {
      let mod = this.state.mod
      let b1  = latex ? latex.length - 1 : -1
      let b = b1 + mod
      let a = b + 1
      // console.log(`b1 = ${b1}, mod = ${mod}, a = ${a}`)
      this.setState({
        cursorPos: { b, a }
      }, () => {
        // console.log('cursorPos = ', this.state.cursorPos)
      })
    }) 
  }

  getId(Id) {
    this.setState({
      currentMathLineId: Id
    })
  }

  handleKeyDownEvents(e) {
    const i = this.getCurrentMathLineIndex()
    const { latexPerLine, cursorPos } = this.state
    const latex = latexPerLine[i]
    const inputWidth = latex ? latex.length : 0
    // this.setState({
    //   numStrokes: this.state.numStrokes + 1
    // }, () => {
    //   console.log('numStrokes = ', this.state.numStrokes)
    // })
    if (e.key == 'Enter') {      
      // Carriage Return
      this.insertComponent()
      this.convertLatexToObject(latex, i)
    } else if (e.key == 'ArrowLeft') {
      let _mod = cursorPos.b == -1 ? 0 : -1
      this.convertLatexToObject(latex, i)
      // this.getIndexFromLatex(latex, _mod)
      // this.moveCursor()
      // console.log('cursorPos = ', this.state.cursorPos)
    } else if (e.key == 'ArrowRight') {
      let _mod = cursorPos.a == inputWidth ? 0 : 1
      this.convertLatexToObject(latex, i)
      // this.getIndexFromLatex(latex, _mod)
      // this.moveCursor()
      // console.log('cursorPos = ', this.state.cursorPos)
    } else if (e.key == 'ArrowUp') {
      this.convertLatexToObject(latex, i)
      this.moveCursor()
    } else {
      // this.convertLatexToObject(latex)
    }
  }

  handleFocus(e) {
    let { latexPerLine } = this.state
    const i = this.getCurrentMathLineIndex()
    const latex = latexPerLine[i]
    this.convertLatexToObject(latex, i)
    this.getIndexFromLatex(latex, 0)
  }

  convertLatexToObject(latex, index) {
    let el     = document.getElementById('ul')
    // let e     = document.querySelector('.mq-root-block:last-child')
    let afterCursorVar = document.querySelector('.mq-cursor + var')
    let afterCursorSpan = document.querySelector('.mq-cursor + span')
    let beforeCursorVar = document.querySelector('.mq-cursor ~ var')
    let beforeCursorSpan = document.querySelector('.mq-cursor ~ span')
    let afterCursor = afterCursorVar ? afterCursorVar : afterCursorSpan
    let beforeCursor = beforeCursorVar ? beforeCursorVar : beforeCursorSpan

    let cursorParent = document.querySelector('.mq-hasCursor')

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
      }
      return output
    }
    
    
    // if (afterCursor && afterCursor.attributes) {
    let AC, CP, CPC, BC, E, isLast = false

    if (el && el.children[0] && el.children[0].childNodes[0] && el.children[0].childNodes[0].children[0] && el.children[0].childNodes[0].children[0].children[0]) {
      let list = el.children[0].childNodes[0].children[1].children

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
      console.log('E =', E)
      console.log('AC = ', AC)
  }

  
  getLatexPerLine(latex, id) {
    let { latexPerLine } = this.state
    const i = this.getCurrentMathLineIndex()
    latexPerLine[i] = latex
    // console.log('latex = ', latex)
    this.getIndexFromLatex(latex, 0)
    this.setState({
      latexPerLine
    }, () => {
      this.convertLatexToObject(latex, i)
      // this.moveCursor()
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