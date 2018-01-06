/**
 * Created by maikuraki on 2017/11/4.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {remote} from 'electron';
import LeftNav from './leftNav';
import BottomControl from './bottomControl';
import Search from './search';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      windowSize: 'normal',
      routers: [
        {
          path: '/',
          component: Search,
        }
      ]
    }
    this.CurrentWindow = remote.getCurrentWindow();
    this.CurrentWindow.on('maximize', (e, cmd) => {
      this.setState({
        windowSize: 'maximize',
      })
    });
    this.CurrentWindow.on('unmaximize', (e, cmd) => {
      this.setState({
        windowSize: 'normal',
      })
    });
  }

  minimize() {
    this.CurrentWindow.minimize();
  }

  resizeWindow() {
    if(this.state.windowSize == 'normal') {
      this.CurrentWindow.maximize();
    }else if(this.state.windowSize == 'maximize') {
      this.CurrentWindow.unmaximize();
    }
  }

  close() {
    this.CurrentWindow.close();
  }

  render() {
    let routers = this.state.routers || [];
    return (
      <Router>
        <div className="wrap">
        <div className="blur"></div>
          <div className="main-wrap"
          onMouseMove={(e) => {this.refs.BottomControl.mouseMove(e)}}
          onMouseUp={(e) => {this.refs.BottomControl.mouseUp(e)}}
        >
          <audio id="audio" src="./download/Sigrid-EverybodyKnows.mp3"/>
          <div className="window-head">
            <div className="app-name">Groove Music</div>
            <div className="drag-bar"></div>
            <div className="window-option-button">
              <div className="small iconfont icon-zuixiaohua" onClick={this.minimize.bind(this)}></div>
              <div className={`big iconfont ${this.state.windowSize == 'normal'?'icon-fangbiankuang':'icon-chuangkou01'}`} onClick={this.resizeWindow.bind(this)}></div>
              <div className="close iconfont icon-guanbi1" onClick={this.close.bind(this)}></div>
            </div>
          </div>
          <div className="window-content">
            <Route render={props => <LeftNav {...props} />} />
            <div className="right-content">
            <Switch>
              {
                routers.map((data, k) => {
                  return (
                    <Route key={k} path={data.path} component={data.component} />
                  )
                })
              }
            </Switch>
            </div>
            <BottomControl ref="BottomControl" />
          </div>
        </div>
        </div>
      </Router>
    )
  }
}