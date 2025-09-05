import React from 'react';
import Link from 'next/link';
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap';

function AdminNavbar() {
  return (
    <>
      <Navbar className='navbar-top navbar-horizontal navbar-dark' expand='md'>
        <Container className='px-4'>
          <NavbarBrand tag={Link} href='/admin/dashboard'>
            <img
              alt='...'
              src={require('assets/img/brand/nextjs_argon_white.png')}
            />
          </NavbarBrand>
          <button className='navbar-toggler' id='navbar-collapse-main'>
            <span className='navbar-toggler-icon' />
          </button>
          <UncontrolledCollapse navbar toggler='#navbar-collapse-main'>
            <div className='navbar-collapse-header d-md-none'>
              <Row>
                <Col className='collapse-brand' xs='6'>
                  <NavbarBrand tag={Link} href='/admin/dashboard'>
                    <img
                      alt='...'
                      src={require('assets/img/brand/nextjs_argon_black.png')}
                    />
                  </NavbarBrand>
                </Col>
                <Col className='collapse-close' xs='6'>
                  <button className='navbar-toggler' id='navbar-collapse-main'>
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className='ml-auto' navbar>
              <NavItem>
                <NavLink
                  tag={Link}
                  href='/admin/dashboard'
                  className='nav-link-icon'
                >
                  <i className='ni ni-planet' />
                  <span className='nav-link-inner--text'>Dashboard</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={Link}
                  href='/auth/register'
                  className='nav-link-icon'
                >
                  <i className='ni ni-circle-08' />
                  <span className='nav-link-inner--text'>Register</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={Link}
                  href='/auth/login'
                  className='nav-link-icon'
                >
                  <i className='ni ni-key-25' />
                  <span className='nav-link-inner--text'>Login</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={Link}
                  href='/admin/profile'
                  className='nav-link-icon'
                >
                  <i className='ni ni-single-02' />
                  <span className='nav-link-inner--text'>Profile</span>
                </NavLink>
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
