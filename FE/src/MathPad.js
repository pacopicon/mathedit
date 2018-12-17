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
    

    // for (let i=0; i<children.length; i++) {
    //   let child = children[i]
    //   if (child.tagName == VAR) {
    //     latex += `${child.innerText}`
    //   } else if (child.tagName == SPAN) {
    //     if (typeof child.className == 'undefined' && child.innerText) {
    //       latex += `${child.innerText}`
    //     } else if (child.className == SUBSCRIPT || child.className == SUPERSCRIPT) {
    //       if (child.className == SUBSCRIPT) {
    //         latex += `_${child.innerText}`
    //       } else if (child.className == SUPERSCRIPT) {
    //         latex += `^${child.innerText}`
    //       }
    //       if (child.children.length > 0) {
    //         let mq_sup = child.children[0]
    //         let mq_sup_children = mq_sup.children
    //         if (mq_sup_children) {
    //           this.parseMathDOM(mq_sup_children, latex)
    //         }
    //       }
    //     } else if (child.className == BINARY_OP) {
    //       latex += `${child.innerText}`
    //     } else if (child.className == PARENTHESES) {
    //       if (child.innerText == '(') {
    //         latex += `\\left${child.innerText}`
    //       } else {
    //         latex += `\\right${child.innerText}`
    //       }
    //     } else if (child.className == FRACTION) {
    //       if (child.children.length > 0) {
    //         let grand_children = child.children
    //         if (grand_children.className == NUMERATOR) {
    //           latex += `\\frac{`
    //           this.this.parseMathDOM(grand_children.children, latex)
    //           latex += `}`
    //         } else if (grand_children.className == DENOMINATOR) {
    //           latex += `{`
    //           this.parseMathDOM(grand_children.children, latex)
    //           latex += `}`
    //         }
    //       }
    //     } else if (child.className == GROUP) {
    //       if (child.children.length > 0) {
    //         this.parseMathDOM(child.children, latex)
    //       }
    //     }
    //   }
    // }
    // console.log('latex = ', latex)
    // return latex
  // }
  
  
  getCursorAdjacentString() {

    let rootNode = (document.getElementsByClassName('mq-root-block'))[0]
    
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
        const getChildren = (siblingsObj, _latex) => {
          let latex = _latex ? _latex : ''
          let len = getObjNumPropLen(siblingsObj)
          console.log('len = ', len)
          for (let i=0; i<len; i++) {
            let p = `${i}`
            let sib = siblingsObj[p]
            // console.log('sib = ', sib)
            if (sib.className == SUB || sib.className == SUP) {
              if (sib.children.length > 0) {
                console.log('sib.children.length = ', sib.children.length)
                console.log('sib.children = ', sib.children)
                console.log('sib.children[0] = ', sib.children[0])
               getChildren(sib, latex) 
              }
            } else if (sib.innerText) {
              
              latex += `${sib.innerText}`
            }
          }
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
              latex += `${sib.innerText}`
              // console.log('sib.innerText = ', sib.innerText)
              siblings.push(sib.innerText)
            } else if (sib.tagName == SPAN) {
              if (sib.className == '' && !sib.attributes['style']) {
                latex += `${sib.innerText}`
                // console.log('sib = ', sib)
                // console.log('sib.innerText = ', sib.innerText)
                siblings.push(sib.innerText)
              } else if (sib.className == SUB || sib.className == SUP) {
                if (sib.children.length > 0) {
                  // console.log('sib.children.length = ', sib.children.length)
                  // console.log('sib.children = ', sib.children)
                  // console.log('sib.children[0] = ', sib.children[0])
                //  returnCursorParentTree(sib, latex) 
                }
              } else if (sib.className == SUBSCRIPT || sib.className == SUPERSCRIPT) {
                if (sib.className == SUBSCRIPT) {
                  latex += `_${sib.innerText}`
                } else if (sib.className == SUPERSCRIPT) {
                  latex += `^${sib.innerText}`
                }
                if (sib.children.length > 0) {
                  let mq_sup = sib.children[0]
                  let mq_sup_children = mq_sup.children
                  // if (mq_sup_children) {
                    // console.log('sib.children.length = ', sib.children.length)
                    // console.log('sib.children = ', sib.children)
                    // console.log('sib.children[0] = ', sib.children[0])
                    // console.log('Array.isArray(sib.children[0]) = ', Array.isArray(sib.children[0]))
                    // returnCursorParentTree(sib, latex)
                    getChildren(sib.children, latex)
                  // }
                }
              } 
            } else {
              siblings.push(siblingsObj[p])
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