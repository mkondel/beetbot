/*
 * ChartPage
 *
 * List all the Charts
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import H1 from 'components/H1';

export default class BotsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  // Since state and props are static,
  // there's no need to re-render this component
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>BOTS Page</title>
          <meta name="description" content="BOTS page" />
        </Helmet>
        <H1>
          <div>
            All your bots are belong to us!
          </div>
        </H1>
      </div>
    );
  }
}
