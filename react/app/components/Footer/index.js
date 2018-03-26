/**
*
* Footer
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import messages from './messages';
import Img from 'components/Img/Loadable';
import BeetButton from 'components/BeetButton/Loadable';
import Banner from '../../images/banner-beetbot.jpg';
import Price from 'components/Price/Loadable';

const FooterWrapper = styled.div`
    text-align: center;
`;

class Footer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <FooterWrapper>
        <BeetButton>BTC</BeetButton>
        <BeetButton>ETH</BeetButton>
        <BeetButton>fake trades</BeetButton>
        {/*<Img src={Banner}/>*/}
        <Price />
      </FooterWrapper>
    );
  }
}

Footer.propTypes = {

};

export default Footer;
