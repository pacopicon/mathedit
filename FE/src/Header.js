import React from 'react';
import './index.css';
// import { Navbar, Nav, MenuItem, NavDropdown } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import NavDropdown from 'react-bootstrap/NavDropdown'
// import {Typeahead} from 'react-bootstrap-typeahead';
import { FILES_URL } from './mathUtils/VARS';

const Header = (props) => {

  const renderDropdown = () => {
    const dropdownItems = [];
    const len           = props.fileNames.length;
    if (len > 0) {
      for (let i=0; i<len; i++) {
        const fileName = props.fileNames[i];
        dropdownItems.push(
          <NavDropdown.Item key={i} onClick={() => props.loadFile(fileName)}>{fileName}</NavDropdown.Item>
        )
      }
    } else {
      dropdownItems.push(
        <NavDropdown.Item key={1}>No Saved Files</NavDropdown.Item>
      )
    }
    return dropdownItems;
  }

  const downloadFile = () => {
    const file = props.currFileName
    const url = FILES_URL + `${file}.tex`;
    fetch(url)
      .then( response => {
        response.blob().then( blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = `${file}.tex`
          a.click();
        })
      })
  }

  return  <Navbar bg="light" expand="sm" collapseOnSelect>
            <Navbar.Brand id="brand">
              Math Notes
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Button variant="outline-success" onClick={() => { props.createNewFile() }}className="Alegreya">Create New File</Button>
                {
                  !props.isSaved 
                  ? <Button variant="outline-success" onClick={() => { props.checkToSave(true) }}className="Alegreya">Save current</Button>
                  : ''
                }
                
                <Button variant="outline-success" onClick={downloadFile}className="Alegreya">Download current</Button>
                
                <NavDropdown title="Files" id="basic-nav-dropdown">
                  {
                    renderDropdown()
                  }
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
}

export default Header


