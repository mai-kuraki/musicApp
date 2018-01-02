import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class Search extends React.Component {
    constructor() {
        super();
    }

    search() {
        let keyword = document.getElementById('searchbox').value || '';
        if(!keyword) return;
        (async () => {
            let req = await axios.get(`${__REQUESTHOST}/api/search?keywords=${keyword}`);
            if(req.status == 200) {

            }
        })();
    }

    render() {
        return(
            <div className="search-page">
                <input type="text" id="searchbox"/>
                <button onClick={this.search.bind(this)}>搜索</button>
            </div>
        )
    }
}