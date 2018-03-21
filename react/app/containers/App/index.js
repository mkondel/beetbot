/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'components/Header/Loadable';
import HomePage from 'containers/HomePage/Loadable';
import BeetChart from 'containers/BeetChart/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

const AppWrapper = styled.div`
    background: #cccccc;
    // background: #caacec88;
    // background: #ecd5ac;
    height: 100%;
`;

export default function App() {
  return (
    <AppWrapper>
      <Header/>
      <Switch>
        <Route exact path="/" component={BeetChart} />
        <Route exact path="/home" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </AppWrapper>
  );
}
