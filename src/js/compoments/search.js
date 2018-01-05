import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import store from '../store';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Loading from './loading';
import * as constStr from '../lib/const';
import * as Actions from '../actions';
import eventEmitter from '../lib/eventEmitter';

export default class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            keyword: '',
            songs: [],
            songCount: 0,
            resultShow: false,
            curSong: {},
            hasSearch: false,
            loading: false,
            moreMenu: false,
            limit: 30,
        }
    }

    componentDidMount() {
        eventEmitter.on(constStr.PLAYNEXT,  () => {
            this.nextSong();
        });
        eventEmitter.on(constStr.PLAYPREV,  () => {
            this.prevSong();
        });
        $(document).on('click', '.window-content', (e) => {
            let className = $(e.target).attr('class') || '';
            if(!(className.indexOf('more-menu') > -1 || $(e.target).parents('.more-menu').length > 0 || className.indexOf('iconmore') > -1)) {
                this.setState({
                    moreMenu: false,
                });
            }
        })
    }

    componentWillUnmount() {
        eventEmitter.removeListener(constStr.PLAYNEXT);
        eventEmitter.removeListener(constStr.PLAYPREV);
    }

    loading() {
        this.setState({
            loading: true,
        })
    }

    loadingEnd() {
        this.setState({
            loading: false,
        })
    }

    search() {
        let keyword = this.state.keyword;
        if(!keyword) return;
        this.loading();
        (async () => {
            let req = await axios.get(`${__REQUESTHOST}/api/search?keywords=${keyword}`);
            this.loadingEnd();
            if(req.status == 200) {
                let data = req.data;
                if(data.code == 200) {
                    let songs = this.state.songs
                    let newSongs = songs.concat(data.result.songs || [])
                    this.setState({
                        hasSearch: true,
                        songCount: data.result.songCount,
                        songs: newSongs, 
                    });
                    store.dispatch(Actions.setSearchList(newSongs));
                    console.log(store.getState());
                }
            }
        })();
    }

    nextSong() {
        let curSong = this.state.curSong;
        let songs = this.state.songs;
        let all = songs.length;
        let curIndex;
        songs.map((data, k) => {
            if(data.id == curSong.id) {
                curIndex = k;
            }
        });
        if(curIndex < all - 1) {
            this.setState({
                curSong: songs[curIndex + 1],
            });
            store.dispatch(Actions.setCurSong(songs[curIndex + 1]));
            setTimeout(() => {
                this.playSong();
            })
        }
    }

    prevSong() {
        let curSong = this.state.curSong;
        let songs = this.state.songs;
        let all = songs.length;
        let curIndex;
        songs.map((data, k) => {
            if(data.id == curSong.id) {
                curIndex = k;
            }
        });
        if(curIndex > 0) {
            this.setState({
                curSong: songs[curIndex - 1],
            });
            store.dispatch(Actions.setCurSong(songs[curIndex - 1]))
            setTimeout(() => {
                this.playSong();
            })
        }
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

    handleInput(e) {
        this.setState({
            keyword: e.target.value || '',
        })
    }

    handleInputUp(e) {
        if(e.keyCode == 13) {
            this.search();
        }
    }

    songSelect(songData, e) {
        this.setState({
            curSong: songData,
        });
        store.dispatch(Actions.setCurSong(songData))
        let el = e.target;
        $(el).parents('li').siblings().removeClass('select');
        $(el).parents('li').addClass('select');
    }

    playSong() {
        let songData = this.state.curSong;
        if(!songData.id)return;
        (async () => {
            let req = await axios.get(`${__REQUESTHOST}/api/music/url?id=${songData.id}`);
            if(req.status == 200) {
                let data = req.data;
                if(data.code == 200) {
                    let sourceUrl = data.data[0].url;
                    document.getElementById('audio').src = sourceUrl;
                    setTimeout(() => {
                        eventEmitter.emit(constStr.INITAUDIO, songData, data.data[0]);
                    });
                }
            }
        })();
    }

    moreMenu(e) {
        this.setState({
            moreMenu: true,
        });
        let y = e.clientY,wY = $(window).height();
        let tag = $(e.target);
        setTimeout(() => {
            let top = 0;
            if(y > (wY - $('.more-menu').height() - 60)) {
                top = tag.parents('li').offset().top + 24 - $('.songs-item').offset().top - $('.more-menu').height();
            }else {
                top = tag.parents('li').offset().top + 24 - $('.songs-item').offset().top;
            }
            $('.more-menu').css('top', top + 'px');
        });
    }

    render() {
        let songs = this.state.songs;
        let curSong = this.state.curSong;
        return(
            <div className="search-page">
            <Scrollbars
              renderView={props => <div {...props} className="scroll-box"/>}
              renderTrackVertical={props => <div {...props} className="track-vertical"/>}
              renderThumbVertical={({ style, ...props }) => <div {...props} className="thumb-vertical"/>}
            >
                <div className="search-box">
                    <input type="text" id="searchbox" 
                    value={this.state.keyword} 
                    placeholder="搜索音乐、歌手、歌词、用户" 
                    onChange={this.handleInput.bind(this)}
                    onKeyUp={this.handleInputUp.bind(this)}
                    />
                    <span className="iconfont search-btn icon-sousuo1" onClick={this.search.bind(this)}></span>
                </div>
                {
                    this.state.loading?
                    <div className="search-loading">
                    <Loading/>
                    </div>:null
                }
                {
                    this.state.hasSearch?
                    <div className="result-area">
                    <Tabs>
                    <TabList>
                        <Tab>单曲</Tab>
                        <Tab>歌手</Tab>
                        <Tab>专辑</Tab>
                        <Tab>MV</Tab>
                        <Tab>歌单</Tab>
                        <Tab>主播电台</Tab>
                        <Tab>用户</Tab>
                    </TabList>
                
                    <TabPanel>
                        <ul className="songs-item">
                        {
                            songs.map((data, k) => {
                                return (
                                    <li className="clearfix" key={k} onClick={this.songSelect.bind(this, data)}>
                                        <div className="coum coum-1">
                                            <span>{data.name}</span>
                                            {
                                                data.mvid?<i className="mv iconfont icon-mv1"></i>:null
                                            }
                                        </div>
                                        <div className="coum coum-2">
                                            <div className="c-w">
                                            <span className="play iconfont icon-bofang1" onClick={this.playSong.bind(this)}></span>
                                            <span className="more iconmore iconfont icon-caidan" onClick={this.moreMenu.bind(this)}></span>
                                            <span className="download-flag iconfont icon-gou"></span>
                                            </div>
                                        </div>
                                        <div className="coum coum-3">
                                            {
                                                data.artists[0].name
                                            }
                                        </div>
                                        <div className="coum coum-4">
                                            {
                                                data.album.name
                                            }
                                        </div>
                                        <div className="coum coum-5">
                                            {
                                                this.formatSeconds(data.duration / 1000)
                                            }
                                        </div>
                                        <div className="coum coum-6">
                                        {
                                            1 === 2?<span className="sq iconfont icon-ttpodicon"></span>:null
                                        }
                                        </div>
                                    </li>
                                )
                            })
                        }
                        {
                            this.state.moreMenu?
                            <div className="more-menu">
                                <div className="item">
                                <button>下一首播放</button>
                                </div>
                                <span className="line"></span>
                                <div className="item">
                                <button>收藏</button>
                                <button>下载</button>
                                <button>评论</button>
                                <button>分享</button>
                                </div>
                                <span className="line"></span>
                                <div className="item">
                                <button>歌手：{curSong.artists[0].name}</button>
                                <button>专辑：{curSong.album.name}</button>
                                {
                                    curSong.mvid?
                                    <button>查看MV</button>:null
                                }
                                <button>打开文件所在目录</button>
                                </div>
                            </div>:null
                        }
                        </ul>
                    </TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                </Tabs>
                </div>:null
                }
                </Scrollbars>
            </div>
        )
    }
}