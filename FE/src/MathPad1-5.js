import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import MathLine from './MathLine2'
import './index.css';

class MathPad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      i: 1
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.move = this.move.bind(this)
    this.newRef = React.createRef();
    this.focusSpan = this.focusSpan.bind(this)
  }

  // componentDidUpdate(prevProps, prevState) {
  //   let ul = document.getElementsByTagName('ul')
  //   if (ul && ul[0] && ul[0].children && ul[0].children.length > 1) {
  //     let ulArr =  ul[0].children
  //     let lastField = ulArr[ulArr.length-1].childNodes[0].childNodes[1]
  //       console.log('lastField = ', lastField)
  //       if (lastField) {
  //         lastField.focus()
  //       }
  //   }
  // }

  componentDidUpdate() {
    this.focusSpan()
  }

  // componentDidMount() {
  //   if (this.newRef.current && this.newRef.current.focus) {
  //     this.newRef.current.focus();
  //   }
  // }

  handleKeyPress(e) {
    e.preventDefault()
    if (e.key == 'Enter') {
      this.setState({
        i: this.state.i += 1
      }, () => {
        // let ul = document.getElementsByTagName('ul')
        // console.log('ul[0].children = ', ul[0].children)
        // let ulArr =  ul[0].children
        // console.log('ulArr[ulArr.length-1] = ', ulArr[ulArr.length-1])
        // // const index = Array.prototype.indexOf.call(ul, e.target)
        // let lastField = ulArr[ulArr.length-1].childNodes[0].childNodes[1]
        // console.log('lastField = ', lastField)
        // lastField.focus()
      })
    }
  }

  move() {
    // let ul = document.getElementsByTagName('ul')
    // if (ul && ul[0] && ul[0].children && ul[0].children.length > 1) {
    //   let ulArr =  ul[0].children
    //   let lastField = ulArr[ulArr.length-1].childNodes[0].childNodes[1]
    //     console.log('lastField = ', lastField)
    //     if (lastField) {
    //       lastField.focus()
    //     }
    // }
  }
  focusSpan() {
    ReactDOM.findDOMNode(this.newRef.current).childNodes[0].focus()
    console.log('ReactDOM.findDOMNode(this.newRef.current).childNodes[0] = ', ReactDOM.findDOMNode(this.newRef.current).childNodes[0])
  }

  render() {
    let MathLines = []
    for (let i=0; i<this.state.i; i++) {
      MathLines.push(<MathLine key={i} ref={this.newRef} />)

      // let ul = document.getElementsByTagName('ul')
      // if (ul && ul[0] && ul[0].children && ul[0].children.length > 1) {
      //   let ulArr =  ul[0].children
      //   let lastField = ulArr[ulArr.length-1].childNodes[0].childNodes[1]
      //     console.log('lastField = ', lastField)
      //     if (lastField) {
      //       lastField.focus()
      //     }
      // }
      // console.log(MathLines[MathLines.length-1])
      // if (MathLines.length > 1 && MathLines[MathLines.length-1].ref.current && MathLines[MathLines.length-1].ref.current.focus) {
      //   console.log(MathLines[MathLines.length-1])
      //   MathLines[MathLines.length-1].ref.current.focus()
      // }
    }

    // let ul = document.getElementsByTagName('ul')
    // if (ul && ul[0] && ul[0].children && ul[0].children.length > 1) {
    //   let ulArr =  ul[0].children
    //   ulArr[ulArr.length-1].focus()
    // }

    return (
      <div className="MathPad" onKeyPress={this.handleKeyPress}>
        {/* <MathLine /> */}
        <ul>{ MathLines }</ul>
        <button onClick={this.move}></button>
      </div>
    );
  }
}

export default MathPad;
