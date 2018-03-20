/*
 * ChartPage
 *
 * List all the Charts
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import H1 from 'components/H1';

export default class ChartPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  // Since state and props are static,
  // there's no need to re-render this component
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Chart Page</title>
          <meta name="description" content="Chart page" />
        </Helmet>
        <H1>
          <div>
            datepicker, chart
          </div>
        </H1>
      </div>
    );
  }
}
