import * as TYPE from '../lib/const';

const initState = {
    searchSongs: [],
};

function search(state = initState, action) {
    switch (action.type) {
        case TYPE.SET_SEARCH_LIST:
            return Object.assign({}, state, {
                searchSongs: action.val
            });
        default:
            return state;
    }
}

export default search;