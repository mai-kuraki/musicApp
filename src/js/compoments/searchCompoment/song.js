import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import store from '../../store';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Loading from '../loading';
import * as constStr from '../../lib/const';
import * as Actions from '../../actions';
import eventEmitter from '../../lib/eventEmitter';

export default class Song extends React.Component{
    constructor() {
        super();
    }

    componentDidMount() {
    }

    findKeyword(str, keyword) {
        let reg = eval(`/${keyword}/ig`);
        let regRes = reg.exec(str);
        console.log(regRes, typeof regRes)
        if(regRes && typeof regRes === 'object') {
            let s = regRes[0];
            str = str.replace(reg, `<em class="keyword">${s}</em>`);
        }
        return str;
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
    
    render() {
        let songs = this.props.songs;
        let curSong = this.props.curSong;
        let curPlaySong = this.props.curPlaySong;
        let playState = this.props.playState;
        let keyword = this.props.keyword;
        return (
            <ul className="songs-item" onScroll={(e) => {this.props.listScroll(e)}}>
                <div className="list-wrap">
                {
                    songs.map((data, k) => {
                        return (
                            <li className="clearfix" key={k} onClick={(e) => {this.props.songSelect(data, e)}}>
                                <div className="coum coum-1">
                                {
                                    curPlaySong.id == data.id && playState?
                                    <em className="playing iconfont icon-yinliang"></em>:null
                                } 
                                {
                                    curPlaySong.id == data.id && !playState?
                                    <em className="playing iconfont icon-yinliang1"></em>:null
                                }    
                                <span dangerouslySetInnerHTML={{__html: this.findKeyword(data.name, keyword)}}></span>
                                    {
                                        data.mvid?<i className="mv iconfont icon-mv2"></i>:null
                                    }
                                </div>
                                <div className="coum coum-2">
                                    <div className="c-w">
                                    <span className="play iconfont icon-bofang1" onClick={(e) => {this.props.playSong(null, e)}}></span>
                                    <span className="more iconmore iconfont icon-gengduo" onClick={(e) => {this.props.moreMenu(e)}}></span>
                                    <span className="download-flag iconfont icon-gou"></span>
                                    </div>
                                </div>
                                <div className="coum coum-3" dangerouslySetInnerHTML={{__html: this.findKeyword(data.artists[0].name || '', keyword)}}></div>
                                <div className="coum coum-4" dangerouslySetInnerHTML={{__html: this.findKeyword(data.album.name || '', keyword)}}></div>
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
                    this.props.moreMenuState?
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
                </div>
            </ul>
        )
    }
}