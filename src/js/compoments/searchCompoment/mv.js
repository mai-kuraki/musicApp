import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import store from '../../store';
import Loading from '../loading';
import * as constStr from '../../lib/const';
import * as Actions from '../../actions';
import eventEmitter from '../../lib/eventEmitter';

export default class MV extends React.Component{
    constructor() {
        super();
    }

    
    render() {
        return (
            
            <div>
         这里是MV
                </div>
         
        )
    }
}