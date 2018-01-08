import React from 'react';
import ReactDOM from 'react-dom';
import { Scrollbars } from 'react-custom-scrollbars';

export default class LeftNav extends React.Component {
    constructor() {
        super();
        this.state = {
            menuState: true,
            curRouterName: '',
            item1: [
                {name: '搜索', icon: 'icon-sousuo1', id: 'search'},
                {name: '发现', icon: 'icon-yinle', id: 'find'},
                {name: 'MV', icon: 'icon-mv', id: 'mv'},
                {name: '朋友', icon: 'icon-haoyou', id: 'friend'}
            ]
        }
    }

    componentDidMount() {
        window.onresize = (e) => {
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

    leftNavHandle() {
        this.setState({
            menuState: !this.state.menuState,
        })
    }

    handleNav(router) {
        this.setState({
            curRouterName: router,
        });
        this.props.history.push(`/${router}`);
    }

    render() {
        let item1 = this.state.item1 || [];
        return(
        <div className={`left-nav ${this.state.menuState?'':'shrink'}`}>
            <div className="app-name">Groove Music</div>
            <div className="top-btn"><span className="btn iconfont icon-44" onClick={this.leftNavHandle.bind(this)}></span></div>
            <div className="menu-list">
            <ul className="item item1">
                {
                    item1.map((data, k) => {
                        return (
                            <li className={`${this.state.curRouterName == data.id?'active':''}`} key={k} onClick={this.handleNav.bind(this, data.id)}><span className={`icon iconfont ${data.icon}`}></span><i>{data.name}</i></li>
                        )
                    }) 
                }
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
            </div>
            <div className="user-info"></div>
          </div>
        )
    }
}