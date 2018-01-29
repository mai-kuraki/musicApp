import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import store from '../../store';
import Loading from '../loading';
import * as constStr from '../../lib/const';
import * as Actions from '../../actions';
import eventEmitter from '../../lib/eventEmitter';

export default class Artist extends React.Component{
    constructor() {
        super();
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

    
    render() {
        let artists = this.props.artists
        let keyword = this.props.keyword;
        return (
            <ul className="artists-item" onScroll={(e) => {this.props.listScroll(e)}}>
                <div className="list-wrap">
                    {
                        artists.map((data, k) => {
                            return(
                                <li className="artists clearfix" key={k}>
                                <div className="avator">
                                    <img src={data.picUrl}/>
                                </div>
                                <div className="info">
                                <span dangerouslySetInnerHTML={{__html: this.findKeyword(data.name, keyword)}}>
                                </span> 
                                <i dangerouslySetInnerHTML={{__html: (data.transNames && data.transNames.length > 0)?`(${this.findKeyword(data.transNames[0], keyword)})`:''}}></i>
                                </div>
                                </li>
                            )
                        })
                    }
                </div>
            </ul>
        )
    }
}