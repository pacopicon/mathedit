import React, { Component } from 'react';
import MathLine from './MathLine'
import Header from './Header'
import './index.css';
import { rando, processStr } from './utils'
import { parseLatex } from './mathUtils/latexParser'

let numNests = 1
let numArrowRights = 0

class MathPad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MathLines: '',
      latexPerLine: [],
      latexArrayPerLine: [],
      currentMathLineId: '',
      cursorPos: '',
      orderOfComponents: '',
      cursorReport: '',
      cursorLatexPositionSnippet: '',
      numStrokes: 0,
      mod: 0,
      isCTRLdown: false
    }
    this.getLatexPerLine = this.getLatexPerLine.bind(this)
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this)
    this.handleKeyUpEvents = this.handleKeyUpEvents.bind(this)
    this.convertLatexToObject = this.convertLatexToObject.bind(this)
    this.insertComponent = this.insertComponent.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.getId = this.getId.bind(this)
    this.getCurrentMathLineIndex = this.getCurrentMathLineIndex.bind(this)
    this.returnSelectedText = this.returnSelectedText.bind(this)
    this.createMathLineElement = this.createMathLineElement.bind(this)
    this.getIndexFromLatex = this.getIndexFromLatex.bind(this)
    this.moveCursor = this.moveCursor.bind(this)
    this.shortCutKey = this.shortCutKey.bind(this)
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

  handleFocus(e) {
    let { latexPerLine } = this.state
    const i = this.getCurrentMathLineIndex()
    const latex = latexPerLine[i]
    this.convertLatexToObject(latex, i)
    this.getIndexFromLatex(latex, 0)
  }

  handleKeyUpEvents(e) {
    if (e.key == 'Control') {
      this.setState({
        isCTRLdown: false
      })
    }
  }

  handleKeyDownEvents(e) {
    const setNativeValue = (element, value) => {
      const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {}
      const prototype = Object.getPrototypeOf(element)
      const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {}

      if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value)
      } else if (valueSetter) {
        valueSetter.call(element, value)
      } else {
        throw new Error('The given element does not have a value setter')
      }
    }

    const checkLastWord = (words, latex) => {
      for (let i=0; i<words.length; i++) {
        let word = words[i]
        // console.log('word = ', word)
        let penult = latex.length - (word.length) 
        let lastWord = latex.slice(penult)
        if (lastWord == word) {
          return lastWord == word
        }
      }
    }

    const typeWord = (wordInput, latex) => {
        for (let i=0; i<wordInput.length; i++) {
          let letter = wordInput[i]
          const textarea = document.getElementsByTagName('textarea')[0]
          setNativeValue(textarea, letter)
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }

    const checkComplexLastWord = (patt, latex) => {
      let match = ''
      let word = ''
      let index = ''
      let fracPatt = /\\frac\{/g

      while ((match = patt.exec(latex)) !== null) {
        word = match[0]
        index = match.index
      }
      let lastWord = latex.slice(index)
      let arrowArr = word.match(fracPatt)
      return {
        bool: lastWord && word ? lastWord == word : false,
        numNests:  arrowArr && arrowArr.length ? arrowArr.length : 0
      }
    }

    // const QuickKey = (latex, word, input) => {
    //   if (latex && checkLastWord(word, latex) ) {
    //     const textarea = document.getElementsByTagName('textarea')[0]
    //     setNativeValue(textarea, input)
    //     textarea.dispatchEvent(new Event('input', { bubbles: true }))
    //   }
    // }

    const i = this.getCurrentMathLineIndex()
    const { latexPerLine, latexArrayPerLine, cursorPos } = this.state
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

      let logPatt   = /\\log_(\{|(\\)?\w+(\s)?|\\cdot|\\div|\+|\-|\\frac\{|\}\{|\})+/g
      if (latex) {
        let res     = checkComplexLastWord(logPatt, latex)
        let bool    = res.bool
          numNests += res.numNests
        if (bool) {
          numArrowRights++
        } else {
          numArrowRights = 0
          numNests = 1
        }
        // console.log(`BEFORE numArrowRights = ${numArrowRights}\nres.numNests = ${res.numNests}\nnumNests = ${numNests}\nMATCH = ${numArrowRights == numNests}`)
        if ( latex && bool && numArrowRights == numNests) {
          const textarea = document.getElementsByTagName('textarea')[0]
          setNativeValue(textarea, '(')
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
          // numArrowRights = -1
          // numNests = 0
        } else {
          numNests = 1
          // numArrowRights = 0
        }
      } else {
        numNests = 1
        // numArrowRights = 0
      }
      // console.log(`AFTER numArrowRights = ${numArrowRights}\nnumNests = ${numNests}`)

      let _mod = cursorPos.a == inputWidth ? 0 : 1
      this.convertLatexToObject(latex, i)
      // this.getIndexFromLatex(latex, _mod)
      // this.moveCursor()
      // console.log('cursorPos = ', this.state.cursorPos)

    } else if (e.key == 'ArrowUp') {

      this.convertLatexToObject(latex, i)
      this.moveCursor()

    } else if (e.key == 'Control') {
      // console.log('control')
      this.setState({
        isCTRLdown: true
      })

    } else if (e.key == 'Alt') {
      // console.log('control')
      this.setState({
        isALTdown: true
      })

    } else if (e.key == 'a') {
      if (this.state.isCTRLdown) {
        if ( latex  ) {
          e.preventDefault()
          const textarea = document.getElementsByTagName('textarea')[0]
          setNativeValue(textarea, '∀')
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    } else if (e.key == '/') {
      if (this.state.isCTRLdown) {
        typeWord('\\overline', latex)
      }
    } else if (e.key == 'i') {
      if (this.state.isCTRLdown) {
        e.preventDefault()
        const textarea = document.getElementsByTagName('textarea')[0]
        setNativeValue(textarea, '∞')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }

    } else if (e.key == '.') {
      
      if (this.state.isCTRLdown) {
        e.preventDefault()
        const textarea = document.getElementsByTagName('textarea')[0]
        setNativeValue(textarea, '→')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }

    } else if (e.key == 'Space') {
      // DO NOT DELETE, THIS CODE MIGHT BECOME NECESSARY

      // if (latex && checkLastWord('log_{ }', latex)) {
      //   const subParent = document.getElementsByClassName('mq-hasCursor')[0].parentNode
      //   subParent.parentNode.removeChild(subParent)
      // }

    } else if (e.key == 'Backspace') {
      // DO NOT DELETE, THIS CODE MIGHT BECOME NECESSARY

      // if (latex && checkLastWord('log_{ }', latex)) {
      //   const subParent = document.getElementsByClassName('mq-hasCursor')[0].parentNode
      //   subParent.parentNode.removeChild(subParent)
      // }

    } else if (e.key == 'h') {
      let words = ['sinh','cosh','tanh','coth']
      if ( latex && checkLastWord(words, latex) ) {
        const textarea = document.getElementsByTagName('textarea')[0]
        setNativeValue(textarea, '(')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }

    } else if (e.key) {
      // console.log('e.key = ', e.key)
      let words = ['lim', 'log']
      if ( latex && checkLastWord(words, latex) ) {
        const textarea = document.getElementsByTagName('textarea')[0]
        setNativeValue(textarea, '_')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
      words = ['sin','ln','cos','tan','cot','csc','sec','sinh','cosh','tanh','coth','\\operatorname{sech}','arcsin','arccos','arctan','\\operatorname{arccosh}','\\operatorname{arccot}','\\operatorname{arccoth}','\\operatorname{arccsc}','\\operatorname{arcsec}','\\operatorname{arcsech}','\\operatorname{arcsinh}','\\operatorname{arctanh}','arcsech']
      if ( latex && checkLastWord(words, latex) ) {
        const textarea = document.getElementsByTagName('textarea')[0]
        setNativeValue(textarea, '(')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }
  }

  // CONVERT_LATEX_TO_OBJECT
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

      const createOperatorNode = (list, operator) => {
        let word = operator.split('')
        let cond = operator.length
        let indices = []
        for (let i = list.length; i>-1; i--) {
          let last = word.length - 1
          // if (list[i] && list[i].innerText) {
          //   console.log('list[i].innerText = ', list[i].innerText)
          // }
          if (list[i] && list[i].innerText && word[last] == list[i].innerText) {
            
            word.pop()
            indices.push(i)
            cond--
          }
        }
        if (cond == 0) {
          for (let i=0; i<operator.length; i++) {
            let index = indices[i]
            if (i < operator.length - 1) {
              list[index].parentNode.removeChild(list[index])
            } else {
              list[index].innerHTML = operator
            }
          }
        }
      }
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
        let last = list[list.length - 1]
        let lastChild = list[last]


        // if (list[i-2] && list[i-2].innerText == 'l' && list[i-1] && list[i-1].innerText == 'o' && list[i].innerText == 'g') {
        //   list[i-2].parentNode.removeChild(list[i-2])
        //   list[i-2].parentNode.removeChild(list[i-2])
        //   list[i-2].innerHTML = 'log'
      
        // } 

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

    const flattenLatexElementObject = (E, _arr) => {
      let arr = _arr || []
      // let isContainer = false
      for (let i=0; i<E.length; i++) {
        let item = E[i]
        // console.log('item = ', item)
        let node = ''
        if (item.name) {
          node = item.name
          // if (node == 'mq-sup') {
          //   isContainer = true
          // }
        } else if (!Array.isArray(item.value) && !item.name) {
          node = item.value
        }
        if ((!item.name.includes('mq-non-leaf') || item.name.includes('mq-nthroot mq-non-leaf')) && item.name != "mq-scaled") {
          arr.push(node)
        }
        if (Array.isArray(item.value) && item.value.length > 0) {
          arr = flattenLatexElementObject(item.value, arr)
          if (!item.name.includes('mq-nthroot mq-non-leaf') && !item.name.includes('mq-numerator') && !item.name.includes('mq-denominator') && !item.name.includes('mq-fraction') && !item.name.includes('mq-sub')) {
            arr.push('container')
          }
        }
      }
      // console.log('arr1 = ', arr)
      return arr
    }

    //["mq-nthroot mq-non-leaf mq-hasCursor", "SPAN", "mq-cursor", "mq-scaled", "mq-sqrt-prefix mq-scaled", "SPAN", "SPAN", "container"]

    const filterDuplicateContainer = (arr) => {
      const output = []
      for (let i=0; i<arr.length; i++) {
        if (arr[i-1] == 'container' && arr[i] == 'container') {
          continue
        } else {
          output.push(arr[i])
        } 
      }
      // console.log('arr2 = ', output)
      return output
    }

    if (el && el.children[0] && el.children[0].childNodes[0] && el.children[0].childNodes[0].children[0] && el.children[0].childNodes[0].children[0].children[0]) {
      let list = el.children[0].childNodes[0].children[1].children

      E = getSmallestNode(list)
      let arr = flattenLatexElementObject(E)
      arr = filterDuplicateContainer(arr)
      if (arr) {
        for (let i=0; i<arr.length; i++) {
          let item = arr[i]
          if (item == 'mq-cursor') {
            // BC = i - 1
            AC = i
          }
        }
      }
    }

    // if (afterCursor && afterCursor.attributes) {
    //   AC = afterCursor.attributes['mathquill-command-id'].value ? afterCursor.attributes['mathquill-command-id'].value : ''
    // }
    // if (beforeCursor && beforeCursor.attributes && beforeCursor.attributes['mathquill-command-id']) {
    //   BC = beforeCursor.attributes['mathquill-command-id'].value ? beforeCursor.attributes['mathquill-command-id'].value : ''
    // }
    if (cursorParent && cursorParent.attributes && cursorParent.attributes['mathquill-block-id']) {
      CP = cursorParent.attributes['mathquill-block-id'].value ? cursorParent.attributes['mathquill-block-id'].value : ''
      CPC = cursorParent.attributes['class'].value ? cursorParent.attributes['class'].value : '' 
    }
    if (CP && !AC) {
      isLast = true
    }
      // let cursorReport = {
      //   AC,
      //   CP,
      //   CPC,
      //   BC,
      //   E,
      //   isLast 
      // }
      this.setState({
        cursorReport: E
      })
      
      // console.log('E = ', E)
      // console.log('AC = ', AC)
      // console.log('BC = ', BC)
      // console.log('CP = ', CP)
  }

  shortCutKey(latex) {
    const searchAndReplace = (domEl, ltxStr) => {
      String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
      };
      if (latex.includes(domEl)) {
        latex = latex.replaceAll(domEl, ltxStr)
      }
      return latex
    }
    latex = searchAndReplace('→', '\\rightarrow')
    latex = searchAndReplace('∞', '\\infty')
    // let alphaPatt = /(?<!\\)alpha/g
    // latex = latex.replace(alphaPatt, '')
    // if (latex.includes('→')) {
    //   latex = latex.replaceAll('→', '\\rightarrow')
    // }

    return latex
  }
  
  getLatexPerLine(latex, id) {
    let { latexPerLine, latexArrayPerLine } = this.state
    const i = this.getCurrentMathLineIndex()
    latex = this.shortCutKey(latex)
    latexPerLine[i] = latex
    latexArrayPerLine[i] = [...parseLatex(latex, [])]
    // console.log('latex = ', latex)
    this.getIndexFromLatex(latex, 0)
    this.setState({
      latexPerLine,
      latexArrayPerLine
    }, () => {
      this.convertLatexToObject(latex, i)
      // this.moveCursor()
    })
  }

  render() {
    let { MathLines } = this.state
    return (
      <div id="MathPad" onKeyDown={this.handleKeyDownEvents} onKeyUp={this.handleKeyUpEvents} onMouseDown={this.handleFocus}>
        <Header />
        <ul id='ul'>{ MathLines }</ul>
      </div>
    );
  }
}

export default MathPad;