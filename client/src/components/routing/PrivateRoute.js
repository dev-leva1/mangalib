import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading }
}) => {
  if (loading) return <div>Загрузка...</div>;
  
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute); 