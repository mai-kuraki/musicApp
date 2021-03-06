import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as constStr from '../lib/const';
import store from '../store';
import * as Actions from '../actions';
import eventEmitter from '../lib/eventEmitter';

export default class BottomControl extends React.Component {
    constructor() {
        super();
        this.state = {
            playThumbActive: false,
            volThumbActive: false,
            volumeSet: false,
            mute: false,
            playPercent: 0,
            playState: false,
            audioDuration: 0,
            audioCurDuration: 0,
            audioBuffered: 0,
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
        audio.addEventListener('ended', () => {
          this.handlePlay();
          this.handleNext();
        });
        audio.addEventListener('progress', () => {
          if(audio.buffered.length > 0) {
            this.setState({
              audioBuffered: audio.buffered.end(0),
            });
            setTimeout(() => {
              this.updateBuffered();
            })
          }
          
        });

        window.onresize = (e) => {
          this.updatePlayThumb();
          this.updateBuffered();
        }

        eventEmitter.on(constStr.INITAUDIO, (songInfo, urlInfo) => {
          this.initAudio(songInfo, urlInfo);
        });
        let volume = audio.volume;
        this.setState({
          volume: volume,
        });
        setTimeout(() => {
          this.updateVolume();
        });
        
    }

    updateVolume() {
      let audio = document.getElementById('audio');
      let volume = this.state.volume;
      audio.volume = volume;
      let volDot = document.getElementById("volDot");
      let volThumb = document.getElementById("volThumb");
      volDot.style.left = (volume * 100) + '%';
      volThumb.style.width = (volume * 100) + '%';
      if(this.state.mute) {
        this.setState({
          mute: false,
        });
        audio.muted = false;
      }
    }

    updateBuffered() {
      let audioDuration = this.state.audioDuration;
      let audioBuffered = this.state.audioBuffered;
      let percent = audioBuffered / audioDuration;
      let allWidth = document.getElementById('barTrack').clientWidth;
      let width = allWidth * percent;
      document.getElementById('buffered').style.width = `${width}px`;
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
      store.dispatch(Actions.setPlayState(true));
      store.dispatch(Actions.setCurPlaySong(songInfo));
      this.setState({
        playState: true,
        songInfo: songInfo,
        urlInfo: urlInfo,
        audioBuffered: 0,
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
          store.dispatch(Actions.setPlayState(false));
        }else {
          audio.play();
          store.dispatch(Actions.setPlayState(true));
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

      handleVolDown(e) {
        this.setState({
          volThumbActive: true,
        });
      }

      handleMute() {
        let mute = this.state.mute;
        let audio = document.getElementById('audio');
        audio.muted = !mute;
        if(mute) {
          this.setState({
            mute: false,
          });
          this.updateVolume();
        }else {
          this.setState({
            mute: true,
          });
          let volDot = document.getElementById("volDot");
          let volThumb = document.getElementById("volThumb");
          volDot.style.left = 0 + '%';
          volThumb.style.width = 0 + '%';
        }
        
      }
    
      mouseMove(e) {
        if(this.state.playThumbActive) {
          let trackOffsetX = document.getElementById('barTrack').offsetLeft;
          let allWidth = document.getElementById('barTrack').clientWidth;
          let newLeft = e.clientX - trackOffsetX - 8;
          if(newLeft < 0)newLeft = 0;
          if(newLeft > allWidth - 16)newLeft = allWidth - 16;
          document.getElementById('thumbDot').style.left = `${newLeft}px`;
          document.getElementById('thumbTrack').style.width = `${newLeft}px`;
        }
        if(this.state.volThumbActive) {
          let trackOffsetX = document.getElementById('volTrack').getBoundingClientRect().left;
          let allWidth = document.getElementById('volTrack').clientWidth;
          let newLeft = e.clientX - trackOffsetX;
          if(newLeft < 0)newLeft = 0;
          if(newLeft > allWidth)newLeft = allWidth;
          let percent = newLeft / allWidth;
          this.setState({
            volume: percent,
          });
          setTimeout(() => {
            this.updateVolume();
          })
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
        if(this.state.volThumbActive) {
          this.setState({
            volThumbActive: false,
          });
        }
      }

      trackClick(e) {
          let trackOffsetX = document.getElementById('barTrack').offsetLeft;
          let allWidth = document.getElementById('barTrack').clientWidth;
          let newLeft = e.clientX - trackOffsetX;
          let playPercent = parseFloat(newLeft) / parseFloat(allWidth);
          let audioDuration = this.state.audioDuration;
          let audioCurDuration = audioDuration * playPercent;
          this.setState({
            playPercent: playPercent,
            audioCurDuration: audioCurDuration,
          });
          setTimeout(() => {
            audio.currentTime = this.state.audioCurDuration;
            this.updatePlayThumb();
          });
      }
    
      volTrackClick(e) {
        let trackOffsetX = document.getElementById('volTrack').getBoundingClientRect().left;
        let allWidth = document.getElementById('volTrack').clientWidth;
        let newLeft = e.clientX - trackOffsetX;
        if(newLeft < 0)newLeft = 0;
        if(newLeft > allWidth)newLeft = allWidth;
        let percent = newLeft / allWidth;
        this.setState({
          volume: percent,
        });
        setTimeout(() => {
          this.updateVolume();
        })
    }

      getSongDetail() {
        let songInfo = this.state.songInfo;
        if(!songInfo.id)return;
        (async () => {
          try {
            let req = await axios.get(`${__REQUESTHOST}/api/song/detail?ids=${songInfo.id}`, {timeout: 30 * 1000});
            if(req.status == 200) {
                let data = req.data;
                if(data.code == 200) {
                    this.setState({
                      songDetail: data.songs.length > 0?data.songs[0]:{},
                      privileges: data.privileges,
                    })
                }
            }
          }catch(e) {

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

      handleNext() {
        eventEmitter.emit(constStr.PLAYNEXT);
      }

      handlePrev() {
        eventEmitter.emit(constStr.PLAYPREV);
      }
      handleVolumeSet() {
        this.setState({
          volumeSet: !this.state.volumeSet,
        })
      }
    render() {
        let songInfo = this.state.songInfo;
        let songDetail = this.state.songDetail;
        let cover;
        if(songDetail.hasOwnProperty('al')) {
          cover = songDetail.al.picUrl;
        }
        let volume = this.state.volume;
        let mute = this.state.mute;
        return (
            <div className="music-bottom-bar">
            <div className="cover">
              <div className="full-screen"><span className="iconfont icon-wangyequanping"></span></div>
              <img src={cover || "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1446912299,3514293506&fm=27&gp=0.jpg"}/>
            </div>
            <div className="control">
              <div className="pre iconfont icon-shangyiqu" onClick={this.handlePrev.bind(this)}></div>
              <div className={`play iconfont ${this.state.playState?'icon-pause_circle_filled':'icon-bofang3'}`} onClick={this.handlePlay.bind(this)}></div>
              <div className="next iconfont icon-shangyiqu-copy" onClick={this.handleNext.bind(this)}></div>
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
                  <div className="buffered" id="buffered"></div>
                  <div className="track" onClick={this.trackClick.bind(this)}></div>
                </div>
            </div>
            <div className="other">
              <div className="fav">
                <div className="fav-icon iconfont icon-heart"></div>
              </div>
              <div className="volume">
                <div className={`volume-control ${this.state.volumeSet?'volume-control-active':''}`}>
                  <span className={`icon iconfont ${(volume == 0 || mute)?'icon-bofangqi-yinliang1':'icon-bofangqi-yinliang'}`} onClick={this.handleMute.bind(this)}></span>
                  <div className="vol-track-wrap">
                    <div className="vol-dot" id="volDot" onMouseDown={this.handleVolDown.bind(this)}><i> </i></div>
                    <div className="vol-thumb" id="volThumb"> </div>
                    <div className="vol-track" id="volTrack" onClick={this.volTrackClick.bind(this)}> </div>
                  </div>
                </div>
                <div className={`volume-icon iconfont ${(volume == 0 || mute)?'icon-bofangqi-yinliang1':'icon-bofangqi-yinliang'}`} onClick={this.handleVolumeSet.bind(this)}></div>
              </div>
              <div className="loop">
                <div className="loop-icon iconfont icon-list-loop"></div>
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