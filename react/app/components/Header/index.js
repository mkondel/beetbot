import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner2.png';
import messages from './messages';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <A href="#">
          <Img src={Banner} alt="react-boilerplate - Logo" />
        </A>
        <NavBar>
          <HeaderLink to="/chart">
            <FormattedMessage {...messages.chart} />
          </HeaderLink>
          <HeaderLink to="/bots">
            <FormattedMessage {...messages.bots} />
          </HeaderLink>
        </NavBar>
      </div>
    );
  }
}

export default Header;
