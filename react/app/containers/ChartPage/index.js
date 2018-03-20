/*
 * ChartPage
 *
 * List all the Charts
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import H1 from 'components/H1';

import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
          <title>Chart</title>
          <meta name="description" content="Chart page" />
        </Helmet>
        <H1>
          <div>
            <p>datepicker, chart</p>
            <Example/>
          </div>
        </H1>
      </div>
    );
  }
}


class Example extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
    />;
  }
}