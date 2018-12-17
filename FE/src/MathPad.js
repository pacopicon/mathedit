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
      orderOfComponents: '',
      spaceChildren: ''
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
  // componentDidUpdate() {
  //   let hasCursorParent = document.getElementsByClassName('.mq-hasCursor').parentElement
  //   console.log('parentElement in didMount = ', hasCursorParent)
  // }

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

  // latex = f_1=\\left(F_t-F_0\\right)d\\left(t,T\\right)=\\frac{S_t\\left(1+\\frac{r_t}{n}\\right)^{n\\left(T-t\\right)}-S_0\\left(1+\\frac{r_0}{n}\\right)^{nT}}{\\left(1+\\frac{r}{n}\\right)^{n\\left(T-t\\right)}}

  // parseMathDOM(children, ltx) {
  //   const VAR = 'VAR'
  //   const SPAN = 'SPAN'
  //   const SUBSCRIPT = 'mq-supsub mq-non-leaf'
  //   const SUPERSCRIPT =  'mq-supsub mq-non-leaf mq-sup-only'
  //   const BINARY_OP = 'mq-binary-operator'
  //   const PARENTHESES = 'mq-scaled mq-paren'
  //   const FRACTION = 'mq-fraction mq-non-leaf'
  //   const NUMERATOR = 'mq-numerator'
  //   const DENOMINATOR = 'mq-denominator'
  //   const GROUP = 'mq-non-leaf'
  //   const SUB = 'mq-sub'

  //   let all = []

  //     for (let i=0; i<children.length; i++) {
  //       let child = children[i]
  //       let latex = ltx ? ltx : ``
  //       if (child.tagName == VAR) {
  //         latex += `${child.innerText}`
  //       } else if (child.tagName == SPAN) {
  //         if (child.tagName == SPAN && !child.innerText && !child.className) {
  //           let g_children = child.children
  //           this.parseMathDOM(g_children, latex)
  //         } else if (child.className == SUB) {
  //           latex += `SUB ${child.innerText}`
  //           // this.parseMathDOM(g_children, latex)
  //         } else if (child.className == PARENTHESES) {
  //           let g_children = child.children
  //           latex += `g_children: ${g_children}`
  //           // this.parseMathDOM(g_children, latex)
  //         } else if (child.className == SUBSCRIPT || child.className == GROUP) {
  //           let g_children = child.children
  //           if (child.className == SUBSCRIPT) {
  //             latex += `_`
  //           } else if (child.className == GROUP) {

  //           } 
  //           if (g_children.length > 0) {
  //             for (let i=0; i<g_children.length; i++) {
  //               let g_child = g_children[i]
  //               // latex += `::${i} innerText: ${g_child.innerText}, className: ${g_child.className}, tagName: ${g_child.tagName}`
  //               if (g_child.className != SUB) {
  //                 let g_g_children = g_child.children
  //                 for (let i=0; i<g_g_children.length; i++) {
  //                   latex += `:::${i} NOT_SUB innerText: ${g_child.innerText}, className: ${g_child.className}, tagName: ${g_child.tagName}`
  //                 }
  //               }
  //               if (g_child.className == SUB) {
  //                 latex += g_child.innerText
  //               } 
  //               // else if (g_child.tagName == SPAN && !g_child.innerText && !g_child.className) {
  //               //   latex += g_child.tagName
  //               // }
  //             }
  //             // this.parseMathDOM(g_children, latex)
  //           }
  //         } else if (child.className == BINARY_OP) {
  //           latex += `${child.innerText}`
  //         } else {
  //           latex += `${child.className ? child.className : 'unnamed'}`
  //         }
  //       }
  //       all.push(latex)
  //       // console.log(latex)
  //     }
  //     return all
    

  //   // for (let i=0; i<children.length; i++) {
  //   //   let child = children[i]
  //   //   if (child.tagName == VAR) {
  //   //     latex += `${child.innerText}`
  //   //   } else if (child.tagName == SPAN) {
  //   //     if (typeof child.className == 'undefined' && child.innerText) {
  //   //       latex += `${child.innerText}`
  //   //     } else if (child.className == SUBSCRIPT || child.className == SUPERSCRIPT) {
  //   //       if (child.className == SUBSCRIPT) {
  //   //         latex += `_${child.innerText}`
  //   //       } else if (child.className == SUPERSCRIPT) {
  //   //         latex += `^${child.innerText}`
  //   //       }
  //   //       if (child.children.length > 0) {
  //   //         let mq_sup = child.children[0]
  //   //         let mq_sup_children = mq_sup.children
  //   //         if (mq_sup_children) {
  //   //           this.parseMathDOM(mq_sup_children, latex)
  //   //         }
  //   //       }
  //   //     } else if (child.className == BINARY_OP) {
  //   //       latex += `${child.innerText}`
  //   //     } else if (child.className == PARENTHESES) {
  //   //       if (child.innerText == '(') {
  //   //         latex += `\\left${child.innerText}`
  //   //       } else {
  //   //         latex += `\\right${child.innerText}`
  //   //       }
  //   //     } else if (child.className == FRACTION) {
  //   //       if (child.children.length > 0) {
  //   //         let grand_children = child.children
  //   //         if (grand_children.className == NUMERATOR) {
  //   //           latex += `\\frac{`
  //   //           this.this.parseMathDOM(grand_children.children, latex)
  //   //           latex += `}`
  //   //         } else if (grand_children.className == DENOMINATOR) {
  //   //           latex += `{`
  //   //           this.parseMathDOM(grand_children.children, latex)
  //   //           latex += `}`
  //   //         }
  //   //       }
  //   //     } else if (child.className == GROUP) {
  //   //       if (child.children.length > 0) {
  //   //         this.parseMathDOM(child.children, latex)
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //   // console.log('latex = ', latex)
  //   // return latex
  // }
  
  
  getCursorAdjacentString() {

    let rootNode = (document.getElementsByClassName('mq-root-block'))[0]
    let rootNodeChildren = rootNode.children
    console.log('rootNodeChildren = ', rootNodeChildren)

    // let cursor = document.getElementsByClassName('mq-cursor')
    // console.log('cursor = ', cursor)
    
    // let hasCursor = document.querySelector('.mq-hasCursor')
    // console.log('hasCursor = ', hasCursor)
    
    let cursorParent = document.querySelector('.mq-cursor').parentNode
    console.log('cursorParent = ', cursorParent)
  
    let cursorGrandParent = cursorParent.parentNode
    console.log('cursorGrandParent = ', cursorGrandParent)


    // let curParChildren = hasCursor.children
    // console.log('curParChildren = ', curParChildren)

    // let nextVar = document.querySelector('.mq-cursor + var')
    // let nextSpan = document.querySelector('.mq-cursor + span')
    // let nextElement = nextVar ? nextVar : nextSpan
    // console.log('nextElement = ', nextElement)

    const returnCursorParentTree = (child, _output) =>{
      let output = [child]
      let parent = child.parentNode
      output.push(parent)

      let cn = parent.className
      console.log('cn = ', cn)
      if (cn == 'mq-root-block' || cn == 'mq-root-block mq-hasCursor') {
        returnCursorParentTree(parent, output)
      }
    
      return output
    }

    const iterateUntilTarget = () => {

    }

    let child = document.querySelector('.mq-cursor').parentNode
    if (child) {
      let output = returnCursorParentTree(child)
      // let cn = output[0].className
      // console.log('cn = ', cn)
      // if (cn == 'mq-root-block' || cn == 'mq-root-block mq-hasCursor') {
      //   console.log('YOU HIT IT!!!')
      // }
      
      console.log('output = ', output)
    }  
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