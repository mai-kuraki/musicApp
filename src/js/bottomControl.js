import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as constStr from './const';
import eventEmitter from './eventEmitter';

export default class BottomControl extends React.Component {
    constructor() {
        super();
        this.state = {
            playThumbActive: false,
            playPercent: 0,
            playState: false,
            audioDuration: 0,
            audioCurDuration: 0,
            volume: 1,
            loopType: 1,
            songInfo: {},
            urlInfo: {},
            songDetail: {},
            privileges: {},
        }
    }

    componentDidMount() {
        let audio = document.getElementById('audio');
        audio.addEventListener('durationchange', () => {
        this.durationchange();
        });
        audio.addEventListener('timeupdate', () => {
        this.timeupdate();
        });
        
        window.onresize = (e) => {
        this.updatePlayThumb();
        }

        eventEmitter.on(constStr.INITAUDIO, (songInfo, urlInfo) => {
          this.initAudio(songInfo, urlInfo);
        });
    }

    componentWillUnmount() {
      eventEmitter.removeListener(constStr.INITAUDIO);
    }

    formatSeconds(value) {
        let theTime = parseInt(value);
        let theTime1 = 0;
        let theTime2 = 0;
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        let result;
        if (parseInt(theTime) > 9) {
          result = "" + parseInt(theTime) + "";
        } else {
          result = "0" + parseInt(theTime) + "";
        }
        if (theTime1 > 0) {
          if(parseInt(theTime1) > 9) {
            result = "" + parseInt(theTime1) + ":" + result;
          }else {
            result = "0" + parseInt(theTime1) + ":" + result;
          }
        } else {
          result = "00:" + result;
        }
        if (theTime2 > 0) {
          result = "" + parseInt(theTime2) + ":" + result;
        }
        return result;
    }

    initAudio(songInfo, urlInfo) {
      let audio = document.getElementById('audio');
      audio.play();
      this.setState({
        playState: true,
        songInfo: songInfo,
        urlInfo: urlInfo,
      });
      this.durationchange();
      setTimeout(() => {
        this.getSongDetail();
        this.timeupdate();
      });
    }

    handlePlay() {
        let audio = document.getElementById('audio');
        if(this.state.playState) {
          audio.pause();
        }else {
          audio.play();
        }
        this.setState({
          playState: !this.state.playState,
        });
      }

      handleThumbDown(e) {
        this.setState({
          playThumbActive: true,
        });
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
          let audio = document.getElementById('audio');
          let allWidth = document.getElementById('barTrack').clientWidth;
          let curWidth = document.getElementById('thumbTrack').style.width;
          let playPercent = parseFloat(curWidth) / parseFloat(allWidth - 16);
          let audioDuration = this.state.audioDuration;
          let audioCurDuration = audioDuration * playPercent;
          this.setState({
            playPercent: playPercent,
            audioCurDuration: audioCurDuration,
            playThumbActive: false,
          });
          setTimeout(() => {
            audio.currentTime = this.state.audioCurDuration;
            this.updatePlayThumb();
          })
          
        }
      }
    
      getSongDetail() {
        let songInfo = this.state.songInfo;
        if(!songInfo.id)return;
        (async () => {
          let req = await axios.get(`${__REQUESTHOST}/api/song/detail?ids=${songInfo.id}`);
          if(req.status == 200) {
              let data = req.data;
              if(data.code == 200) {
                  this.setState({
                    songDetail: data.songs.length > 0?data.songs[0]:{},
                    privileges: data.privileges,
                  })
              }
          }
        })();
      }
    
      durationchange() {
        let audio = document.getElementById('audio');
        let audioDuration = audio.duration;
        this.setState({
          audioDuration: audioDuration,
        })
      }
    
      timeupdate() {
        let audio = document.getElementById('audio');
        let currentTime = audio.currentTime;
        let audioDuration = this.state.audioDuration;
        let playPercent = currentTime / audioDuration;
        this.setState({
          playPercent: playPercent,
          audioCurDuration: currentTime,
        });
        if(!this.state.playThumbActive) {
          setTimeout(() => {
            this.updatePlayThumb();
          });
        }
      }
    
      updatePlayThumb() {
        let playPercent = this.state.playPercent;
        let allWidth = document.getElementById('barTrack').clientWidth;
        let left = (allWidth - 16) * playPercent;
        document.getElementById('thumbDot').style.left = `${left}px`;
        document.getElementById('thumbTrack').style.width = `${left}px`;
      }

    render() {
        let songInfo = this.state.songInfo;
        let songDetail = this.state.songDetail;
        let cover;
        if(songDetail.hasOwnProperty('al')) {
          cover = songDetail.al.picUrl;
        }
        return (
            <div className="music-bottom-bar">
            <div className="cover">
              <div className="full-screen"><span className="iconfont icon-wangyequanping"></span></div>
              <img src={cover || "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1446912299,3514293506&fm=27&gp=0.jpg"}/>
            </div>
            <div className="control">
              <div className="pre iconfont icon-xiayishou-copy"></div>
              <div className={`play iconfont ${this.state.playState?'icon-zanting':'icon-bofang'}`} onClick={this.handlePlay.bind(this)}></div>
              <div className="next iconfont icon-xiayishou"></div>
            </div>
            <div className="progress-bar">
              <div className="bar-info">
                <div className="audio-name">
                {
                  songInfo.name
                } <span>{songInfo.hasOwnProperty('artists')?songInfo.artists[0].name:''}</span></div>
                <div className="dur-info"><span>{this.formatSeconds(this.state.audioCurDuration)}</span> / {this.formatSeconds(this.state.audioDuration)}</div>
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
        )
    }
}