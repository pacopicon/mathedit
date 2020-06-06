import React, { Component } from 'react';
// import MathLine from './MathLine_Orig';
import MathLine from './MathLine';
import Header from './Header';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import {
  postToBE,
  getFileNames
} from './api';
import './index.css';
// import { rando, processStr, isLetter } from './utils';
import { rando, deleteObjProp } from './utils';
import { parseLatex } from './mathUtils/latexParser';

let numNests = 1;
let numArrowRights = 0;

class MathPad extends Component {
  constructor(props) {

    super(props);
    this.state = {
      isTitleClicked: false,
      currFileName: 'untitled-1',
      numUntitled: 1,
      shouldDisplaySave: false,
      fileNames: [],
      currentFile: {
        'untitled-1': {
          latexPerLine: [],
          latexArrayPerLine: [],
          MathLines: [],
          currentMathLineId: '',
          orderOfComponents: [],
          savedLatex: '',
          isSaved: false
        }
      },
      cursorPos: '',
      cursorReport: '',
      cursorLatexPositionSnippet: '',
      mod: 0,
      isCTRLdown: false,
      isSub: false,
      isPar: false,
      strokeRecord: ''
    };
    this.getLatexPerLine = this.getLatexPerLine.bind(this);
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this);
    this.handleKeyUpEvents = this.handleKeyUpEvents.bind(this);
    this.convertLatexToObject = this.convertLatexToObject.bind(this);
    this.insertComponent = this.insertComponent.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.getId = this.getId.bind(this);
    this.getCurrentMathLineIndex = this.getCurrentMathLineIndex.bind(this);
    this.returnSelectedText = this.returnSelectedText.bind(this);
    this.createMathLineElement = this.createMathLineElement.bind(this);
    this.getIndexFromLatex = this.getIndexFromLatex.bind(this);
    this.moveCursor = this.moveCursor.bind(this);
    this.shortCutKey = this.shortCutKey.bind(this);
    this.setNativeValue = this.setNativeValue.bind(this);
    this.autoInsertPar = this.autoInsertPar.bind(this);
    this.save = this.save.bind(this);
    this.checkToSave = this.checkToSave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.createNewFile = this.createNewFile.bind(this);
  }

  concatenateLatex = (latexPerLine) => {
    let linesToSave = '';
    for ( let i=0; i<latexPerLine.length; i++ ) {
      const line = latexPerLine[i];
      if (i !== latexPerLine.length - 1) {
        linesToSave += line + '\n';
      } else {
        linesToSave += line;
      }
    }
    console.log('linesToSave = ', linesToSave)
    return linesToSave;
  }

  async checkToSave(isCurrent, callback) {

    const {
      currentFile,
      currFileName
    }                   = this.state;
    
    let lineCheck       = false;
    const latexPerLine  = currentFile[currFileName].latexPerLine;
    let savedLatex      = currentFile[currFileName].savedLatex;
    // const last          = latexPerLine.length - 1;

    // for ( let i=0; i<latexPerLine.length; i++ ) {
    //   const line = latexPerLine[i];
    //   if (i !== last) {
    //     linesToSave += line + '\n';
    //   } else {
    //     linesToSave += line;
    //   }
    // }
    
    let linesToSave     = this.concatenateLatex(latexPerLine);

    if ( !savedLatex || ( savedLatex !== linesToSave) ) {
      lineCheck   = linesToSave.split('\n').join('');
      lineCheck   = lineCheck.split('\\').join('');
      lineCheck   = lineCheck.trim();
    }

    let shouldSaveCurrFile = false;
    if (lineCheck) {

      if (!isCurrent) {

        shouldSaveCurrFile = await swal({
          text: 'Would you like to save your current file?',
          buttons: ['no', 'yes']
        });

        console.log('prompt return = ', shouldSaveCurrFile);

      } else {
        shouldSaveCurrFile = true;
      }

      if (shouldSaveCurrFile) {
        this.save(linesToSave);
      }
    } else if (isCurrent) {
      swal("There is nothing to save", {
        buttons: false,
        timer: 750
      });
    }
    if (callback) {
      const shouldDiscardCurrentFile = !isCurrent && !lineCheck
      callback(shouldDiscardCurrentFile);
    }
  }

  createFileName = async (altName) => {

    let fileName = await swal({
      text: 'Please name your file:',
      content: 'input',
      button: {
        text: "Submit",
        closeModal: true
      }
    });

    if (altName && !fileName) {
      fileName = altName
    }

    if (!fileName) {
      const { numUntitled } = this.state;
      fileName              = `untitled-${numUntitled + 1}`;
    }

    return fileName;
  }

  async createNewFile() {

    let fileName = await this.createFileName();
    
    if (fileName) {

      let { currentFile, currFileName }       = this.state;
      currentFile[fileName]                   = {};
      currentFile[fileName].latexPerLine      = [];
      currentFile[fileName].latexArrayPerLine = [];
      currentFile[fileName].MathLines         = [];
      currentFile[fileName].currentMathLineId = '';
      currentFile[fileName].orderOfComponents = [];
      currentFile[fileName].savedLatex        = '';
      const id                          = rando();

      currentFile[fileName].MathLines.push( this.createMathLineElement(id, '') );
      currentFile[fileName].orderOfComponents.push(id);

      this.checkToSave( false, (shouldDiscardCurrentFile) => {

        if (shouldDiscardCurrentFile) {
          currentFile = deleteObjProp(currFileName, currentFile);
        }

        this.setState({
          currentFile,
          currFileName: fileName
        })
      });

    }
  };

  loadFile(fileName) {

    const payload = {
      fileName
    };

    postToBE(payload, 'file', async (error, data) => {
      if (error) {
        console.log('error = ', error);
      } else {
        const latexes                     = data.textArr;
        let { currentFile, currFileName }       = this.state;
        currentFile[fileName]                   = {};
        currentFile[fileName].latexPerLine      = latexes;
        currentFile[fileName].latexArrayPerLine = [];
        currentFile[fileName].MathLines         = [];
        currentFile[fileName].currentMathLineId = '';
        currentFile[fileName].orderOfComponents = [];
        currentFile[fileName].savedLatex        = data.text;
        currentFile[fileName].isSaved          = true;

        for (let i=0; i<latexes.length; i++) {
          const latex                           = latexes[i];
          currentFile[fileName].latexArrayPerLine.push( parseLatex(latex, []) )
          const id                              = rando();
          currentFile[fileName].MathLines.push( this.createMathLineElement(id, latex) );
          currentFile[fileName].orderOfComponents.push(id);
        }
        this.checkToSave( false, (shouldDiscardCurrentFile) => {

          if (shouldDiscardCurrentFile) {
            currentFile = deleteObjProp(currFileName, currentFile);
          }

          this.setState({
            currentFile,
            currFileName: fileName
          })
        })

      }
    })
  }

  handleTitleChange(e) {
    let {
      currentFile,
      currFileName
    }                  = this.state;
    const newFileName  = e.target.value;
    const currFileObj  = currentFile[currFileName];
    currentFile              = deleteObjProp(currFileName, currentFile);
    currentFile[newFileName] = currFileObj;

    this.setState({
      currentFile,
      currFileName: newFileName
    })
  }

  handleClick() {
    this.setState({
      isTitleClicked: !this.state.isTitleClicked
    })
  }

  async save(linesToSave) {

    let { currentFile, currFileName, fileNames } = this.state;
    let fileName        = '';

    if ( currFileName.includes('untitled') ) {
      fileName = await this.createFileName(currFileName);
    } else {
      fileName = currFileName;
    }

    const payload = {
      linesToSave,
      fileName,
      format: 'tex'
    }
    postToBE(payload, 'save', (error, succ) => {
      if (error) {
        console.log('error = ', error);
      } else {
        console.log('succ = ', succ)
        currentFile[currFileName].savedLatex = linesToSave;
        currentFile[currFileName].isSaved    = true;
        currentFile[fileName]                = currentFile[currFileName];
        
        if (fileName !== currFileName) {
          currentFile = deleteObjProp(currFileName, currentFile);
        }

        fileNames.push(fileName);
        this.setState({
          currentFile,
          fileNames,
          currFileName: fileName
        })
      }
    })
  }

  autoInsertPar(latex) {
    // console.log('latex = ', latex)
    // let parOperators = new Set(['sin','ln','cos','tan','cot','csc','sec','sinh','cosh','tanh','coth','\\operatorname{sech}','arcsin','arccos','arctan','\\operatorname{arccosh}','\\operatorname{arccot}','\\operatorname{arccoth}','\\operatorname{arccsc}','\\operatorname{arcsec}','\\operatorname{arcsech}','\\operatorname{arcsinh}','\\operatorname{arctanh}','arcsech'])

    const parPatt = /(\\sin|\\ln|\\cos|\\tan|\\cot|\\csc|\\sec|\\arcsin|\\arccos|\\arctan|\\operatorname\{(arccosh|arccot|arccoth|arccsc|arcsinh|arcsec|arcsech|arctanh|sech)\})(?!(\\left|h))/g
    const subPatt = /(\\log|\\lim)(?!(_))/g
    
    if (parPatt.test(latex) && !this.state.isPar) {
      this.setState({
        isPar: true
      })
    }

    if (subPatt.test(latex) && !this.state.isSub) {
      this.setState({
        isSub: true
      })
    }
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const { currentFile, currFileName } = this.state
  //   // const prevFiles = prevState.files;

  //   const latexPerLine = currentFile[currFileName].latexPerLine;
  //   const i            = this.getCurrentMathLineIndex();
  //   const latex        = latexPerLine[i];

  //   this.autoInsertPar(latex)
  // }

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

  componentDidMount() {
    const id                              = rando();
    const temp                            = [id];
    const { currentFile, currFileName }         = this.state;
    currentFile[currFileName].MathLines         = [ this.createMathLineElement(id, '') ];
    currentFile[currFileName].orderOfComponents = temp;

    getFileNames( currFileName, (err, fileNames) => {
      if (err) {
        console.error(err);
      } else {
        this.setState({
          currentFile,
          fileNames
        })
      }
    })
  }

  getCurrentMathLineIndex() {
    const { currentFile, currFileName } = this.state;
    const currentMathLineId = currentFile[currFileName].currentMathLineId;
    const orderOfComponents = currentFile[currFileName].orderOfComponents;
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

  setCurrFileStateAndFocusLastMathline = (currentFile, lineIdx, currFileName) => {
    this.setState({
      currentFile
      }, () => {
        let ul = document.getElementById('ul');
        if (ul && ul.children[0] && ul.children[0].childNodes[0] && ul.children[0].childNodes[0].children[0] && ul.children[0].childNodes[0].children[0].children[0]) {
          let ulArr =  ul.children
          let textArea = ulArr[lineIdx] ? ulArr[lineIdx].childNodes[0].childNodes[0].childNodes[0] : null;
          if (textArea) {
            textArea.focus()
          }
        }
        const currFile = this.state.currentFile[currFileName];
        const latex = currFile.latexPerLine[lineIdx]
        this.getIndexFromLatex(latex, 0)
      }
    )
  }

  backspaceComponent = () => {
    let { currentFile, currFileName } = this.state;

    let MathLines           = currentFile[currFileName].MathLines;
    let latexArrayPerLine   = currentFile[currFileName].latexArrayPerLine;
    let orderOfComponents   = currentFile[currFileName].orderOfComponents;
    let latexPerLine        = currentFile[currFileName].latexPerLine;
    const current           = this.getCurrentMathLineIndex();
    const prior             = current - 1;

    MathLines.splice(current, 1);
    latexArrayPerLine.splice(current, 1);
    orderOfComponents.splice(current, 1);
    latexPerLine.splice(current, 1);

    currentFile[currFileName].MathLines         = MathLines;
    currentFile[currFileName].currentMathLineId = orderOfComponents[prior];
    currentFile[currFileName].latexArrayPerLine = latexArrayPerLine;
    currentFile[currFileName].orderOfComponents = orderOfComponents;
    currentFile[currFileName].latexPerLine      = latexPerLine;
    
    this.setCurrFileStateAndFocusLastMathline(currentFile, prior, currFileName);
  }

  insertComponent() {
    let { currentFile, currFileName, cursorPos } = this.state;

    const latexPerLine = currentFile[currFileName].latexPerLine;
    const MathLines    = currentFile[currFileName].MathLines;

    let afterCursor = cursorPos.a;
    let tempMathLines = [...MathLines];
    const i = this.getCurrentMathLineIndex();
    let tempOrder = [];
    let id = '';

    const current = i;
    const next    = i+1;
    let string    = '';
    let snip      = '';
    let remainder = '';

    if (latexPerLine[current]) {
      string = latexPerLine[current];
      remainder = string.slice(0, afterCursor);
      latexPerLine[current] = remainder;
      snip = string.slice(afterCursor);
    }

    
    // latexPerLine[next] = snip
    id                     = rando()
    const currentComponent = this.createMathLineElement(id, remainder);
    tempMathLines[current] = currentComponent;
    // }
    id                     = rando()
    const newComponent     = this.createMathLineElement(id, snip);
    
    tempMathLines.splice(next, 0, newComponent);
    latexPerLine.splice(next, 0, snip);

    tempMathLines.map( mathline => {
      // console.log('mathline = ', mathline)
      tempOrder.push(mathline.props.id);
    })

    currentFile[currFileName].latexPerLine      = latexPerLine;
    currentFile[currFileName].MathLines         = tempMathLines;
    currentFile[currFileName].orderOfComponents = [...tempOrder];

    this.setCurrFileStateAndFocusLastMathline(currentFile, next, currFileName);
  }

  moveCursor(mod) {
    const { currentFile, currFileName } = this.state
    const orderOfComponents = currentFile[currFileName].orderOfComponents;
    const lenRows = orderOfComponents.length;
    const lastRow = lenRows - 1;
    let i = this.getCurrentMathLineIndex()
    // console.log('i (1) = ', i)
    if (mod) {
      if ( mod < 0 && i <= 0 ) {
        i = 0
      } else if ( (mod < 0 && i > 0) || (mod > 0 && i < lastRow) ) {
        i = i + mod
      }
    }
    // console.log('i (2) = ', i)
    let ul = document.getElementById('ul')
        if (ul && ul.children[0] && ul.children[0].childNodes[0] && ul.children[0].childNodes[0].children[0] && ul.children[0].childNodes[0].children[0].children[0]) {
          let ulArr =  ul.children
          // console.log('ulArr[i] = ', ulArr[i])
          let textArea = ulArr[i] ? ulArr[i].childNodes[0].childNodes[0].childNodes[0] : null;
          // console.log('textArea = ', textArea)
          if (textArea) {
            textArea.focus();
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
    const { currentFile, currFileName }         = this.state;
    currentFile[currFileName].currentMathLineId = Id;
    
    this.setState({
      currentFile
    })
  }

  handleFocus(e) {
    let { currentFile, currFileName } = this.state
    const latexPerLine = currentFile[currFileName].latexPerLine;
    const i = this.getCurrentMathLineIndex()
    const latex = latexPerLine[i]
    this.convertLatexToObject(latex, i)
    this.getIndexFromLatex(latex, 0)
  }

  handleKeyUpEvents(e) {
    if (e.key === 'Control') {
      this.setState({
        isCTRLdown: false
      })
    }
  }

  setNativeValue(element, value){
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
    if (value === '(') {
      // console.log('this.state.isPar: ', this.state.isPar)
      this.setState({
        isPar: false
      }, () => {
        // console.log('this.state.isPar: ', this.state.isPar)
      })
    } else if (value === '_') {
      this.setState({
        isSub: false
      })
    }
  }

  handleKeyDownEvents(e) {
    
    const fetchIndices = (patt, str) => {
      let match
      // let word
      let index
      let indices = []
      while ((match = patt.exec(str)) !== null) {
        // word = match[0]
        index = match.index
        indices.push(index)
      }
      // console.log('indices = ', indices)
      return indices
    }

    const checkLastWord = (searchedWords, latex) => {
      let outcome
      for (let i=0; i<searchedWords.length; i++) {
        let searchedWord = searchedWords[i]
        let pattPar = new RegExp(`${searchedWord}\\\\left\\(`, 'g')
        let patt    = new RegExp(`${searchedWord}`, 'g')
        let searchedWordLocations = fetchIndices(patt, latex)
        if (searchedWordLocations.length > 0) {
          let parLocations = fetchIndices(pattPar, latex)
          // console.log(`searchedWord = ${searchedWord}, searchedWordLocations = ${searchedWordLocations}, parLocations = ${parLocations}`)
          let lastWordIndex = searchedWordLocations.pop()
          let lastParIndex = parLocations.pop()
          if (lastWordIndex === lastParIndex) {
            outcome = false
          } else if (lastParIndex < lastWordIndex || !lastParIndex) {
            outcome = true
          }
          // console.log(`searchedWord = ${searchedWord}, lastWordIndex = ${lastWordIndex}, lastParIndex = ${lastParIndex}`)
        }
      }
      return outcome
    }

    const typeWord = (wordInput, latex) => {
        for (let i=0; i<wordInput.length; i++) {
          let letter = wordInput[i]
          const textarea = document.getElementsByTagName('textarea')[0]
          this.setNativeValue(textarea, letter)
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
        bool: lastWord && word ? lastWord === word : false,
        numNests:  arrowArr && arrowArr.length ? arrowArr.length : 0
      }
    }

    const {
      currentFile,
      currFileName,
      // cursorPos,
      isPar,
      isSub
    }                  = this.state;
    const i            = this.getCurrentMathLineIndex();
    const isSaved      = currentFile[currFileName].isSaved;
    const latexPerLine = currentFile[currFileName].latexPerLine;
    const latex        = latexPerLine[i];

    if (isSaved && e.key !== 'Space' && e.key !== 'Enter') {
      currentFile[currFileName].isSaved = false;
      this.setState({
        currentFile
      })
    }

    // const inputWidth   = latex ? latex.length : 0;

    // if (e.key) {
    //   e.preventDefault()
    //   let stroke = ''
    //   if (e.key == ' ') {
    //     stroke = ' '
    //   } else if (e.key == 'Backspace') {
    //     console.log('Backspace')
    //   } else if (isLetter(e.key)) {
    //     stroke = e.key
    //   }

    //   this.setState({
    //     strokeRecord: this.state.strokeRecord + stroke
    //   })
    // }

    if (e.key === 'Backspace') {

      if (!isSaved) {

        let linesToCompare = this.concatenateLatex(latexPerLine);

        if (currentFile[currFileName].savedLatex === linesToCompare) {

          currentFile[currFileName].isSaved = true;
          this.setState({
            currentFile
          })

        }

      }
      const i         = this.getCurrentMathLineIndex();
      const currLatex = latexPerLine[i];

      if (!currLatex) {
        this.backspaceComponent();
      }
      // DO NOT DELETE, THIS CODE MIGHT BECOME NECESSARY

      // if (latex && checkLastWord('log_{ }', latex)) {
      //   const subParent = document.getElementsByClassName('mq-hasCursor')[0].parentNode
      //   subParent.parentNode.removeChild(subParent)
      // }

    } else if (e.key === 'Enter') {
      // Carriage Return
      this.insertComponent()
      this.convertLatexToObject(latex, i)

    } else if (e.key === '(') {

      this.setState({
        isPar: false
      })

    } else if (e.key === 'ArrowLeft') {

      // let _mod = cursorPos.b === -1 ? 0 : -1 
      this.convertLatexToObject(latex, i)
      // this.getIndexFromLatex(latex, _mod)
      // this.moveCursor()
      // console.log('cursorPos = ', this.state.cursorPos)

    } else if (e.key === 'ArrowRight') {

      let logPatt   = /\\log_(\{|(\\)?\w+(\s)?|\\cdot|\\div|\+|-|\\frac\{|\}\{|\})+/g
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
        if ( latex && bool && numArrowRights === numNests) {
          const textarea = document.getElementsByTagName('textarea')[0]
          this.setNativeValue(textarea, '(')
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

      // let _mod = cursorPos.a === inputWidth ? 0 : 1
      this.convertLatexToObject(latex, i)
      // this.getIndexFromLatex(latex, _mod)
      // this.moveCursor()
      // console.log('cursorPos = ', this.state.cursorPos)

    } else if (e.key === 'ArrowUp') {

      // this.convertLatexToObject(latex, i)
      this.moveCursor(-1)

    } else if (e.key === 'ArrowDown') {

      // this.convertLatexToObject(latex, i)
      this.moveCursor(1)

    } else if (e.key === 'Control') {
      // console.log('control')
      this.setState({
        isCTRLdown: true
      })

    } else if (e.key === 'Alt') {
      // console.log('control')
      this.setState({
        isALTdown: true
      })

    } else if (e.key === 'a') {
      if (this.state.isCTRLdown) {
        if ( latex  ) {
          e.preventDefault()
          const textarea      = document.getElementsByTagName('textarea')[0]
          this.setNativeValue(textarea, '∀')
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    } else if (e.key === '/') {
      if (this.state.isCTRLdown) {
        typeWord('\\overline', latex)
      }
    } else if (e.key === '.') {
      
      if (this.state.isCTRLdown) {
        e.preventDefault()
        const textarea = document.getElementsByTagName('textarea')[0]
        this.setNativeValue(textarea, '→')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }

    } else if (e.key === 'Space') {
      // DO NOT DELETE, THIS CODE MIGHT BECOME NECESSARY

      // if (latex && checkLastWord('log_{ }', latex)) {
      //   const subParent = document.getElementsByClassName('mq-hasCursor')[0].parentNode
      //   subParent.parentNode.removeChild(subParent)
      // }

    } else if (e.key === 'h') {
      console.log('key listener for h fired')
      let words = ['sinh','sech','cosh','tanh','coth','arccosh']
      if ( latex && checkLastWord(words, latex) ) {
        const textarea = document.getElementsByTagName('textarea')[0]
        this.setNativeValue(textarea, '(')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }

    } else if (e.key) {
    
      if ( latex && isSub ) {
        const textarea = document.getElementsByTagName('textarea')[0]
        this.setNativeValue(textarea, '_')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
        
      }

      if ( latex && isPar ) {
        console.log('sin fired')
        const textarea = document.getElementsByTagName('textarea')[0]
        this.setNativeValue(textarea, '(')
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }

    }
  }

  // CONVERT_LATEX_TO_OBJECT
  convertLatexToObject(latex, index) {
    let el     = document.getElementById('ul')
    // let e     = document.querySelector('.mq-root-block:last-child')
    // let afterCursorVar = document.querySelector('.mq-cursor + var')
    // let afterCursorSpan = document.querySelector('.mq-cursor + span')
    // let beforeCursorVar = document.querySelector('.mq-cursor ~ var')
    // let beforeCursorSpan = document.querySelector('.mq-cursor ~ span')
    // let afterCursor = afterCursorVar ? afterCursorVar : afterCursorSpan
    // let beforeCursor = beforeCursorVar ? beforeCursorVar : beforeCursorSpan

    // let cursorParent = document.querySelector('.mq-hasCursor')

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
        // let last = list[list.length - 1]
        // let lastChild = list[last]


        // if (list[i-2] && list[i-2].innerText == 'l' && list[i-1] && list[i-1].innerText == 'o' && list[i].innerText == 'g') {
        //   list[i-2].parentNode.removeChild(list[i-2])
        //   list[i-2].parentNode.removeChild(list[i-2])
        //   list[i-2].innerHTML = 'log'
      
        // } 

        let obj   = {}
        obj.value = child.children.length === 0 ? child.innerText : getSmallestNode(child, true)
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
    // let AC     = '';
    // let CP     = '';
    // let CPC    = '';
    // let BC     = '';
    let E      = '';
    // let isLast = false

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
        if ((!item.name.includes('mq-non-leaf') || item.name.includes('mq-nthroot mq-non-leaf')) && item.name !== "mq-scaled") {
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

    // const filterDuplicateContainer = (arr) => {
    //   const output = []
    //   for (let i=0; i<arr.length; i++) {
    //     if (arr[i-1] === 'container' && arr[i] === 'container') {
    //       continue
    //     } else {
    //       output.push(arr[i])
    //     }
    //   }
    //   return output
    // }

    if (el && el.children[0] && el.children[0].childNodes[0] && el.children[0].childNodes[0].children[0] && el.children[0].childNodes[0].children[0].children[0]) {
      let list = el.children[0].childNodes[0].children[1].children

      E       = getSmallestNode(list)
      // let arr = flattenLatexElementObject(E)
      // arr     = filterDuplicateContainer(arr)
      // if (arr) {
      //   for (let i=0; i<arr.length; i++) {
      //     let item = arr[i]
      //     if (item === 'mq-cursor') {
      //       BC = i - 1
      //       AC = i
      //     }
      //   }
      // }
    }

    // if (afterCursor && afterCursor.attributes) {
    //   AC = afterCursor.attributes['mathquill-command-id'].value ? afterCursor.attributes['mathquill-command-id'].value : ''
    // }
    // if (beforeCursor && beforeCursor.attributes && beforeCursor.attributes['mathquill-command-id']) {
    //   BC = beforeCursor.attributes['mathquill-command-id'].value ? beforeCursor.attributes['mathquill-command-id'].value : ''
    // }
    // if (cursorParent && cursorParent.attributes && cursorParent.attributes['mathquill-block-id']) {
      // CP = cursorParent.attributes['mathquill-block-id'].value ? cursorParent.attributes['mathquill-block-id'].value : ''
      // CPC = cursorParent.attributes['class'].value ? cursorParent.attributes['class'].value : '' 
    // }
    // if (CP && !AC) {
    //   isLast = true
    // }
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
      if (latex.includes(domEl)) {
        latex = latex.split(domEl).join(ltxStr);
      }
      return latex
    }
    // latex = searchAndReplace('→', '\\rightarrow')
    // latex = searchAndReplace('∞', '\\infty')
    // let alphaPatt = /(?<!\\)alpha/g
    // latex = latex.replace(alphaPatt, '')
    // if (latex.includes('→')) {
    //   latex = latex.replaceAll('→', '\\rightarrow')
    // }

    return latex
  }
  
  getLatexPerLine(latex, id) {
    let { currentFile, currFileName }           = this.state;
    const latexPerLine                    = currentFile[currFileName].latexPerLine;
    
    const latexArrayPerLine               = currentFile[currFileName].latexArrayPerLine;
    
    const i                               = this.getCurrentMathLineIndex();
    latex                                 = this.shortCutKey(latex);
    latexPerLine[i]                       = latex;
    latexArrayPerLine[i]                  = [...parseLatex(latex, [])]
    currentFile[currFileName].latexPerLine      = latexPerLine;
    console.log('currentFile[currFileName].latexPerLine = ', currentFile[currFileName].latexPerLine)
    currentFile[currFileName].latexArrayPerLine = latexArrayPerLine;
    this.getIndexFromLatex(latex, 0)

    this.setState({
      currentFile
    }, () => {
      this.convertLatexToObject(latex, i)
      // this.moveCursor()
    })
  }

  render() {
    let {
      currentFile,
      currFileName,
      isTitleClicked,
      fileNames
    }               = this.state;
    const MathLines = currentFile[currFileName] ? currentFile[currFileName].MathLines : null;
    const isSaved = currentFile[currFileName] ? currentFile[currFileName].isSaved : false;
    return (
      <div id="MathPad" onKeyDown={this.handleKeyDownEvents} onKeyUp={this.handleKeyUpEvents} onMouseDown={this.handleFocus}>
        <Header
          checkToSave={this.checkToSave}
          fileNames={fileNames}
          currFileName={currFileName}
          loadFile={this.loadFile}
          createNewFile={this.createNewFile}
          isSaved={isSaved}
        />
        {
          isTitleClicked
            ? <Form>
                <Form.Group id="titleInput" controlId="formTitle">
                  <Form.Control type="text" placeholder={this.state.currFileName} onChange={this.handleTitleChange} />
                </Form.Group>
                <Button id="titleSubmit" variant="primary" onClick={this.handleClick}>
                  Submit
                </Button>
              </Form>
            : <div id='title' onClick={this.handleClick}>{this.state.currFileName}</div>
        }
        {
          MathLines
            ? <ul id='ul'>{ MathLines }</ul>
            : null
        }
      </div>
    );
  }
}

export default MathPad;

/* <input type="text" id="titleInput" placeholder={this.state.currFileName} onChange={this.handleTitleChange} /> */