import React, { Component } from 'react';
import './index.css';
import { Navbar, Nav, MenuItem, NavDropdown } from 'react-bootstrap';
// import {Typeahead} from 'react-bootstrap-typeahead';

class Header extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Navbar id="Header" collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <div className="white Alegreya">MathNotes</div>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>  
          <Nav>
              {/* <Typeahead
              labelKey="user"
              placeholder="Search a user..."
              onChange={(selected) => {
                this.props.handleSearchQuery(selected)
              }}
              options={names}
            />  */}
            <NavDropdown className="Alegreya" eventKey={3} title="Export project" id="basic-nav-dropdown">
              <MenuItem className="Alegreya" eventKey={3.1}>DocX</MenuItem>
              <MenuItem className="Alegreya" eventKey={3.2}>Pages</MenuItem>
              <MenuItem className="Alegreya" eventKey={3.3}>Pdf</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header