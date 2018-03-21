/**
*
* Img
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import messages from './messages';

const ImgWrapper = styled.div`
    text-align: center;
`;

class Img extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ImgWrapper>
        <img src={this.props.src}/>
      </ImgWrapper>
    );
  }
}

Img.propTypes = {

};

export default Img;
