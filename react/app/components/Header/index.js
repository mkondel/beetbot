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
// import Img from 'components/Img/Loadable';

const HeaderWrapper = styled.div`
    text-align: center;
`;
const ImgWrapper = styled.div`
    max-width: 60px;
    display: inline-flex;
`;
const DonateWrapper = styled.div`
    text-align: left;
    font-size: x-small;
    padding-left: 5px;
`;
const AnotherWrapper = styled.div`
    display: inline-block;
    position: relative;
`;

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        {/*<Img src='avatar.png' alt='avatar'/>*/}
        <ImgWrapper>
          <img src='avatar.png'/>
        </ImgWrapper>
        <AnotherWrapper>
          <Donate coin='BTC' addr='14FP4HGMGU4m4gpWYQwiFYyjeDsXd4BhDE'/>
          <Donate coin='LTC' addr='LKSup2r941U3wH5yXbiCRXay1NUoWg6gBc'/>
          <Donate coin='ETH' addr='0xa56191e487792e178cae6dcd72f61ed4c701f6b0'/>
          <Donate coin='BCH' addr='17rnBjebeLddLEjXUDVsMnjvyYa1AMdTqe'/>
        </AnotherWrapper>
        <HeaderWrapper>
          {<span>GDAX BTC-USD (20 ticks/candle)</span>}
        </HeaderWrapper>
      </div>
    );
  }
}

const Donate = ({coin, addr}) => (
<DonateWrapper>
  <b>{coin}:</b> {addr}
</DonateWrapper>
)

Header.propTypes = {

};

export default Header;
