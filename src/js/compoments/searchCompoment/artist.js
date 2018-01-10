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

    
    render() {
        return (
            <ul className="songs-item" onScroll={(e) => {this.props.listScroll(e)}}>
                <div className="list-wrap">
                
                </div>
            </ul>
        )
    }
}