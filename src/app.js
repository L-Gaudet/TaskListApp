import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './components/loginpage';
import DashboardPage from './components/DashboardPage';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Switch>
//         <Route exact path="/" component={LoginPage} />
//         <Route path="/dashboard" component={DashboardPage} />
//       </Switch>
//     </BrowserRouter>
//   );
// };

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <React.StrictMode>
    <LoginPage />
  </React.StrictMode>,
  document.getElementById('root')
)

