import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from './components/loginpage';
import DashboardPage from './DashboardPage';

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={LoginPage} />
      <Route exact path="/dashboard" component={DashboardPage} />
    </Switch>
  );
}

export default Routes;
