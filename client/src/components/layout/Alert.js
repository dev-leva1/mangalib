import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

const AlertContainer = styled.div`
  position: fixed;
  top: 70px;
  right: 20px;
  z-index: 1000;
  width: 300px;
`;

const AlertItem = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  &.alert-danger {
    background-color: ${props => props.theme.danger};
    color: white;
  }
  
  &.alert-success {
    background-color: ${props => props.theme.success};
    color: white;
  }
  
  &.alert-info {
    background-color: ${props => props.theme.info};
    color: white;
  }
`;

const Alert = ({ alerts }) => {
  if (alerts !== null && alerts.length > 0) {
    return (
      <AlertContainer>
        {alerts.map(alert => (
          <AlertItem key={alert.id} className={`alert-${alert.alertType}`}>
            {alert.msg}
          </AlertItem>
        ))}
      </AlertContainer>
    );
  }
  
  return null;
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert); 