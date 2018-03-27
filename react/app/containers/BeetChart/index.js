/**
 *
 * BeetChart
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import styled from 'styled-components';
import ChartComponent from 'components/ChartComponent/Loadable';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import messages from './messages';

const BeetWrapper = styled.div`
    // background: #dddddd;
    // background: #eaba66;
    height: 100%;
    text-align: center;
`;

export class BeetChart extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
      return (
          <BeetWrapper>
              <Helmet>
                  <title>Beetcoin</title>
                  <meta name="description" content="Description of BeetChart" />
              </Helmet>
              {/*<FormattedMessage {...messages.header} />*/}
              <ChartComponent/>
          </BeetWrapper>
      );
    }
}

BeetChart.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

const withConnect = connect(null, mapDispatchToProps);
const withSaga = injectSaga({ key: 'beetChart', saga });

export default compose(
    withSaga,
    withConnect,
)(BeetChart);
