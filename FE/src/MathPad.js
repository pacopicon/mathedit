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
      mathLineId: '',
      cursorTextPosition: '',
      orderOfComponents: '',
      spaceChildren: '',
      numStrokes: -1,
      symbolHtmlCorrelate: []
    }
    this.getStringsPerLine = this.getStringsPerLine.bind(this)
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this)
    this.getLinePosition = this.getLinePosition.bind(this)
    this.getCursorHtmlPosition = this.getCursorHtmlPosition.bind(this)
    this.insertComponent = this.insertComponent.bind(this)
    this.getCursorAdjacentString = this.getCursorAdjacentString.bind(this)
    this.handleCursorPosition = this.handleCursorPosition.bind(this)
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

  // componentDidUpdate() {
  //   let hasCursorParent = document.getElementsByClassName('.mq-hasCursor').parentElement
  //   console.log('parentElement in didMount = ', hasCursorParent)
  // }

  insertComponent(MathLines, mathLineId, orderOfComponents) {
    
    let tempMathLines = [...MathLines]
    let pos = orderOfComponents.indexOf(mathLineId) + 1
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

    let rootNode = (document.getElementsByClassName('mq-root-block'))[0]
    
    const CURSOR = 'mq-cursor'
    const CURSOR_BLINK = 'mq-cursor mq-blink'
    const VAR = 'VAR'
    const SPAN = 'SPAN'
    const SUBSCRIPT = 'mq-supsub mq-non-leaf'
    const SUPERSCRIPT =  'mq-supsub mq-non-leaf mq-sup-only'
    const BINARY_OP = 'mq-binary-operator'
    const PARENTHESES = 'mq-scaled mq-paren'
    const FRACTION = 'mq-fraction mq-non-leaf'
    const NUMERATOR = 'mq-numerator'
    const DENOMINATOR = 'mq-denominator'
    const GROUP = 'mq-non-leaf'
    const SUB = 'mq-sub'
    const SUP = 'mq-sup'

    const returnCursorParentTree = (child, _latex) =>{
      let latex = _latex ? _latex : ''
      // let output = typeof _output != 'undefined' ? [..._output] : [child]

      if (child && child.parentNode && child.parentNode.children) {
        let parent = child.parentNode
        let siblingsObj = child.parentNode.children
        let siblings = []

        const isSeries = (arr) => {
          arr.sort()
          let isSeries = true
          for (let i = 0; i<arr.length-1; i++) {
            // console.log(`first = ${arr[i]}, second = ${i+1}...${arr[i+1] - arr[i]}`)
            if (arr[i+1] - arr[i] != 1) {
              isSeries = false
            }
          }
          return isSeries
        }
        
        const getObjNumPropLen = (obj) => {
          let arr = []
          let output = null
          if (!Array.isArray(obj)) {
            for (let p in obj) {
              let num = Number(p)
              if (Number.isInteger(num)) {
                arr.push(num)
              }
            }
          } else {
            arr = obj
          }
          // verify
          if (isSeries(arr)) {
            return arr.length
          } 
          return output
        }
        const getChildren = (siblingsObj, _latex, _p) => {
          let latex = _latex ? _latex : ''
          let p = _p ? _p : ''
          let len = getObjNumPropLen(siblingsObj)
          // console.log('len = ', len)
          let test = false
          if (!test) {
            for (let i=0; i<len; i++) {
              let q = `${i}`
              let sib = siblingsObj[q]
              // console.log('sib = ', sib)
              if (sib.className == SUB || sib.className == SUP) {
                if (sib.children.length > 0) {
                  // console.log('sib.children.length = ', sib.children.length)
                  // console.log('sib.children = ', sib.children)
                  // console.log('sib.children[0] = ', sib.children[0])
                  latex += `[[${p}-${q}::${getChildren(sib.children, latex)}` 
                }
              } else if (sib.tagName == VAR) {
                latex += `[[${p}-${q}::${sib.innerText}`
                // console.log('sib.innerText = ', sib.innerText)
                // siblings.push(sib.innerText)
              } 
              else if (sib.tagName == SPAN && sib.innerText && sib.innerText.length > 1) {
                console.log('sib = ', sib)
                console.log(`sib = ${sib}, sib.innerText = ${sib.innerText}`)
                latex += `[[${p}-${q}::${sib.innerText}`
              } 
              else if  (sib.className == NUMERATOR) {
                console.log('NUMERATOR sib = ', sib)
                latex += `[[${p}-${q}::\\frac{`
                if (sib.children.length > 0) {
                  latex += `[[${p}-${q}::${getChildren(sib.children, latex)}`
                }
                latex += `[[${p}-${q}::}`
              } else if (sib.className == DENOMINATOR) {
                console.log('DENOMINATOR sib = ', sib)
                latex += `[[${p}-${q}::{`
                if (sib.children.length > 0) {
                  latex += `[[${p}-${q}::${getChildren(sib.children, latex)}`
                }
                latex += `[[${p}-${q}::}`
              } else {
                if (sib.className == '' && !sib.attributes['style']) {
                  console.log('no innerText = ', sib)
                }
              }
            }
          } else {
            latex += `[[${p}::<TEST>`
          }
          return latex
        }
        
        let sibLen = getObjNumPropLen(siblingsObj)
        // console.log('siblingsObj.length = ', siblingsObj.length)

        for (let i=0; i<sibLen; i++) {
          let p = `${i}`
      
          if (siblingsObj[p].tagName || siblingsObj[p].className) {
            let tn = siblingsObj[p].tagName
            let cn = siblingsObj[p].className
            // console.log(`${tn}.${cn}.typeof cn= ${typeof cn}`)
            let sib = siblingsObj[p]
            if (sib.tagName == VAR) {
              latex += `[[${p}::${sib.innerText}`
              // console.log('sib.innerText = ', sib.innerText)
              // siblings.push(sib.innerText)
            } else if (sib.tagName == SPAN) {
              if (sib.className == '' && !sib.attributes['style']) {
                latex += `[[${p}::${sib.innerText}`
                // console.log('sib = ', sib)
                // console.log('sib.innerText = ', sib.innerText)
                // siblings.push(sib.innerText)
              } else if (sib.className == CURSOR || sib.className == CURSOR_BLINK) {
                // console.log('sib = ', sib)
                latex += `[[${p}::CURSOR`
              } else if (sib.className == BINARY_OP) {
                // console.log('sib = ', sib)
                latex += `[[${p}::${sib.innerText}`
              } else if (sib.className == PARENTHESES) {
                if (sib.innerText == '(') {
                  latex += `[[${p}::\\left${sib.innerText}`
                } else {
                  latex += `[[${p}::\\right${sib.innerText}`
                }
              } else if (sib.className == FRACTION) {
                // console.log('frac sib = ', sib)
                // console.log('frac sib.children = ', sib.children)
                // console.log('frac sib.children.length = ', sib.children.length)
                if (sib.children.length > 0) {
                  latex += `[[${p}::${getChildren(sib.children, latex, p)}`
                }
              } else if (sib.className == SUBSCRIPT || sib.className == SUPERSCRIPT) {
                if (sib.className == SUBSCRIPT) {
                  latex += `[[${p}::_${sib.innerText}`
                  // latex += `[[${p}::_`
                } else if (sib.className == SUPERSCRIPT) {
                  latex += `[[${p}::^${sib.innerText}`
                  // latex += `[[${p}::^`
                }
                if (sib.children.length > 0) {
                  // let mq_sup = sib.children[0]
                  // let mq_sup_children = mq_sup.children
                  // if (mq_sup_children) {
                    // console.log('sib.children.length = ', sib.children.length)
                    // console.log('sib.children = ', sib.children)
                    // console.log('sib.children[0] = ', sib.children[0])
                    // console.log('Array.isArray(sib.children[0]) = ', Array.isArray(sib.children[0]))
                    // returnCursorParentTree(sib, latex)
                    latex += `[[${p}::${getChildren(sib.children, latex, p)}`
                  // }
                }
              } 
            } 
            // console.log(`${tn}.${cn}`)
          }
          
          
        }
        // output.push(siblings)
  
        if (rootNode == parent) {
          
          this.setState({
            latex
          })
          return  
        }
        returnCursorParentTree(parent, latex)
      }
    }


    let child = document.querySelector('.mq-cursor').parentNode
    if (child) {
      returnCursorParentTree(child)
    }  
  }
  handleKeyDownEvents(e) {
    let { mathLineId, orderOfComponents } = this.state
    // let id = this.state.mathLineId
    //   let i = this.state.orderOfComponents.indexOf(id)
    // let latexStr = new String(this.state.stringsPerLine[i])
    
    // this.getCursorAdjacentString()
    if (e.key == 'Enter') {      
      // Carriage Return
      // e.preventDefault() // e.preventDefault() will not allow further typing in the field.  This function should never be called.
      let { MathLines } = this.state
      let res = this.insertComponent(MathLines, mathLineId, orderOfComponents)
  
   
  
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
      } else if (e.key && e.key != 'Backspace') {
        ///////////////////////////////////////////////
        let { stringsPerLine, numStrokes } = this.state

        let i = numStrokes + 1
        this.setState({
          numStrokes: i
        }, () => {
          let rootNode = (document.getElementsByClassName('mq-root-block'))[0]
        
        console.log(`rootNode.children[${i-1}] =`)
        console.log(rootNode.children[i-1])
        console.log(`rootNode.children[${i}] =`)
        console.log(rootNode.children[i])
        // console.log(`rootNode.children[${i+1}] =`)
        // console.log(rootNode.children[i+1])
        console.log('rootNode = ', rootNode)
        console.log('rootNode.children.length = ', rootNode.children.length)
        let attr = document.querySelector("[mathquill-command-id='1']");
        let attr2 = document.querySelector("[mathquill-block-id='1']")
        console.log('attr = ', attr)
        console.log('attr2 = ', attr2)

        let getAttr = rootNode.children[i].attributes['mathquill-command-id']
        console.log('getAttr = ', getAttr)
      
      
        let pos = orderOfComponents.indexOf(mathLineId)
        let latex = stringsPerLine[pos]
        // console.log('latex = ', latex)
        let newElement = []
        newElement.push(rootNode.children[i])
        this.setState({
          symbolHtmlCorrelate: [...this.state.symbolHtmlCorrelate,...newElement]
        })

        })
    } else if (e.key == 'Backspace') {
      let { numStrokes } = this.state
      this.setState({
        numStrokes: numStrokes > -1 ? numStrokes - 1 : -1
      })
    } else if (e.key == 'ArrowUp') {
  
    } else if (e.key == 'ArrowLeft') {
      
    } else if (e.key == 'ArrowRight') {
     
    } else if (e.key == 'Tab') {

    } 
  }

  getCursorHtmlPosition(node, rootNode, _output) {
    console.log('this hit')
    let output = typeof _output != 'undefined' ? [...output,..._output] : [node]
    let parent = node.parentNode 
    if (rootNode == parent) {
      this.setState({
        cursorTextPosition: output
      })
      console.log('output = ', output) 
      return 
    }
    output.push(parent)
    this.getCursorHtmlPosition(parent, rootNode, output)
  }

  handleCursorPosition(e) {
    let rootNode = (document.getElementsByClassName('mq-root-block'))[0]
    // console.log('cursor pos rootNode = ', rootNode)
    // console.log('cursor pos rootNode.children = ', rootNode.children)
    // console.log('cursor pos rootNode.children.length = ', rootNode.children.length)
    

    if (rootNode.children.length == 0) {
      this.setState({
        cursorTextPosition: 0
      })
    } else {
      let node = document.querySelector('.mq-cursor')
      console.log('node = ', node)
      if (node) {
        this.getCursorHtmlPosition(node, rootNode)
        
      }
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
      mathLineId: i
    })
  }

  render() {
    let { MathLines } = this.state
    return (
      <div id="MathPad" onFocus={this.handleCursorPosition} onKeyDown={this.handleKeyDownEvents}>
        <Header />
        {/* {this.renderMathLines()} */}
        <ul id='ul'>{ MathLines }</ul>
      </div>
    );
  }
}

export default MathPad;