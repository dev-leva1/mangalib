import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../../actions/auth';

const NavbarContainer = styled.nav`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.textLight};
  padding: 0.7rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.accent};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.accentLight};
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
`;

const NavItem = styled.li`
  margin-left: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.textLight};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: ${props => props.theme.accent};
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textLight};
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.accent};
  }
`;

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <>
      <NavItem>
        <NavLink to="/catalog">Каталог</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/profile">Профиль</NavLink>
      </NavItem>
      <NavItem>
        <Button onClick={handleLogout}>Выйти</Button>
      </NavItem>
    </>
  );

  const guestLinks = (
    <>
      <NavItem>
        <NavLink to="/catalog">Каталог</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/login">Войти</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/register">Регистрация</NavLink>
      </NavItem>
    </>
  );

  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">MangaLib</Logo>
        <NavLinks>
          {!loading && (isAuthenticated ? authLinks : guestLinks)}
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar); 