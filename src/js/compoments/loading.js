import React from 'react';
import ReactDOM from 'react-dom';

export default class Loading extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="skype-loader">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        )
    }
}

