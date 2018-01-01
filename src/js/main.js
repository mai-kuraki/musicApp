/**
 * Created by maikuraki on 2017/11/14.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {remote} from 'electron';
import { Scrollbars } from 'react-custom-scrollbars';


export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      windowSize: 'normal',
      menuState: true,
      playThumbActive: false,
      playPercent: 0,
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

  componentDidMount() {
    window.onresize = (e) => {
      let playPercent = this.state.playPercent;
      let allWidth = document.getElementById('barTrack').clientWidth;
      let left = (allWidth - 16) * playPercent;
      document.getElementById('thumbDot').style.left = `${left}px`;
      document.getElementById('thumbTrack').style.width = `${left}px`;
      if(window.innerWidth < 730) {
        if(this.state.menuState) {
          this.setState({
            menuState: false,
          })
        }
      }else{
        if(!this.state.menuState) {
          this.setState({
            menuState: true,
          })
        }
      }
    }
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

  leftNavHandle() {
    this.setState({
      menuState: !this.state.menuState,
    })
  }

  handleThumbDown(e) {
    this.setState({
      playThumbActive: true,
    })
  }

  mouseMove(e) {
    if(this.state.playThumbActive){
      let trackOffsetX = document.getElementById('barTrack').offsetLeft;
      let allWidth = document.getElementById('barTrack').clientWidth;
      let newLeft = e.clientX - trackOffsetX - 8;
      if(newLeft < 0)newLeft = 0;
      if(newLeft > allWidth - 16)newLeft = allWidth - 16;
      document.getElementById('thumbDot').style.left = `${newLeft}px`;
      document.getElementById('thumbTrack').style.width = `${newLeft}px`;
    }
  }

  mouseUp(e) {
    if(this.state.playThumbActive) {
      let allWidth = document.getElementById('barTrack').clientWidth;
      let curWidth = document.getElementById('thumbTrack').style.width;
      this.setState({
        playPercent: parseFloat(curWidth) / parseFloat(allWidth - 16),
        playThumbActive: false,
      })
    }
  }

  render() {
    return (
      <div className="main-wrap" 
        onMouseMove={this.mouseMove.bind(this)}
        onMouseUp={this.mouseUp.bind(this)}
      >
        <div className="window-head">
          <div className="app-name">网易云音乐</div>
          <div className="drag-bar"></div>
          <div className="window-option-button">
            <div className="small iconfont icon-zuixiaohua" onClick={this.minimize.bind(this)}></div>
            <div className={`big iconfont ${this.state.windowSize == 'normal'?'icon-fangbiankuang':'icon-chuangkou01'}`} onClick={this.resizeWindow.bind(this)}></div>
            <div className="close iconfont icon-guanbi1" onClick={this.close.bind(this)}></div>
          </div>
        </div>
        <div className="window-content">
          <div className={`left-nav ${this.state.menuState?'':'shrink'}`}>
            <div className="top-btn"><span className="btn iconfont icon-44" onClick={this.leftNavHandle.bind(this)}></span></div>
            <div className="menu-list">
            <Scrollbars
              renderTrackVertical={props => <div {...props} className="track-vertical"/>}
              renderThumbVertical={({ style, ...props }) => <div {...props} className="thumb-vertical"/>}
            >
            <ul className="item item1">
                <li className="active"><span className="icon iconfont icon-sousuo1"></span><i>搜索</i></li>
                <li><span className="icon iconfont icon-yinle"></span><i>发现</i></li>
                <li><span className="icon iconfont icon-mv"></span><i>MV</i></li>
                <li><span className="icon iconfont icon-haoyou"></span><i>朋友</i></li>
              </ul>
              <div className="open-btn"><span className="btn iconfont icon-zhankai" onClick={this.leftNavHandle.bind(this)}></span></div>
              <h3 className="item-title"><span>我的音乐</span></h3>
              <ul className="item item2">
                <li><span className="icon iconfont icon-yinle_music"></span><i>本地音乐</i></li>
                <li><span className="icon iconfont icon-iconfwwdxz"></span><i>下载管理</i></li>
                <li><span className="icon iconfont icon-shijian"></span><i>最近播放</i></li>
                <li><span className="icon iconfont icon-yun"></span><i>我的音乐云盘</i></li>
                <li><span className="icon iconfont icon-yuleyinlediantai"></span><i>我的电台</i></li>
                <li><span className="icon iconfont icon-tianjiawenjianjia"></span><i>我的收藏</i></li>
              </ul>
              <h3 className="item-title item-title2"><span>创建的歌单</span></h3>
              <ul className="item item3">
                <li><span className="icon iconfont icon-Pingjia"></span><i>我喜欢的音乐</i></li>
                <li><span className="icon iconfont icon-yinleliebiao"></span><i>污小雅</i></li>
                <li><span className="icon iconfont icon-yinleliebiao"></span><i>仓木麻衣</i></li>
                <li><span className="icon iconfont icon-yinleliebiao"></span><i>王力宏</i></li>
                <li><span className="icon iconfont icon-yinleliebiao"></span><i>1989</i></li>
                <li><span className="icon iconfont icon-yinleliebiao"></span><i>avril</i></li>
              </ul>
            </Scrollbars>
            </div>
            <div className="user-info"></div>
          </div>
          <div className="right-content"> </div>
          <div className="music-bottom-bar">
            <div className="cover">
              <div className="full-screen"><span className="iconfont icon-wangyequanping"></span></div>
              <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1446912299,3514293506&fm=27&gp=0.jpg"/>
            </div>
            <div className="control">
              <div className="pre iconfont icon-xiayishou-copy"></div>
              <div className="play iconfont icon-bofang"></div>
              <div className="next iconfont icon-xiayishou"></div>
            </div>
            <div className="progress-bar">
              <div className="bar-info">
                <div className="audio-name">永远的第一天（Live）- live <span>王力宏</span></div>
                <div className="dur-info"><span>00:00</span> / 05:00</div>
              </div>
              <div className="bar-track" id="barTrack">
                  <div className="thumb-dot"
                       id="thumbDot"
                    onMouseDown={this.handleThumbDown.bind(this)}
                  ><i></i></div>
                  <div className="thumb-track" id="thumbTrack"></div>
                  <div className="track"></div>
                </div>
            </div>
            <div className="other">
              <div className="fav">
                <div className="fav-icon iconfont icon-heart"></div>
              </div>
              <div className="loop">
                <div className="loop-icon iconfont icon-list-loop"></div>
              </div>
              <div className="volume">
                <div className="volume-icon iconfont icon-bofangqi-yinliang"></div>
              </div>
              <div className="list">
                <div className="list-icon iconfont icon-liebiaoshouqi1"></div>
                <span className="num">65</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}