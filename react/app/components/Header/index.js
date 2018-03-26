/**
*
* Header
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
// import Price from 'components/Price/Loadable';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
    text-align: center;
`;

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <HeaderWrapper>
        {/*<span>All your beetcoin are belong to us.</span>*/}
        {/*<br/>*/}
        <span>The price of bitcoin is too damn high!</span>
      </HeaderWrapper>
    );
  }
}

Header.propTypes = {

};

export default Header;
