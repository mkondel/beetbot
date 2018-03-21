/**
*
* Header
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import messages from './messages';
import Img from 'components/Img/Loadable';
import Banner from '../../images/banner-beetbot.jpg';

const HeaderWrapper = styled.div`
    text-align: right;
`;

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <HeaderWrapper>
        {/*<FormattedMessage {...messages.header} />*/}
        <Img src={Banner}/>
      </HeaderWrapper>
    );
  }
}

Header.propTypes = {

};

export default Header;
