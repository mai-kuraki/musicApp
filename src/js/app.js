/**
 * Created by maikuraki on 2017/11/4.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Main from './main';

class App extends React.Component {
  construct() {}

  render() {
    return (
      <Router>
        <div className="wrap">
          <Switch>
            <Route path="/" component={Main}></Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(
  <App/>, document.getElementById('main'));