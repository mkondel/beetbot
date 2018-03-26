/**
*
* BeetButton
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
// import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
    text-align: center;
    display: inline-block;
    padding: 10px 10px 10px 10px;
`;


class BeetButton extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ButtonWrapper>
        <Button bsStyle='primary'>{this.props.children}</Button>
      </ButtonWrapper>
    );
  }
}

BeetButton.propTypes = {
};

export default BeetButton;
