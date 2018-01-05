import * as TYPE from '../lib/const';

const initState = {
    curSong: {},
};

function main(state = initState, action) {
    switch (action.type) {
        case TYPE.SET_CUR_SONG:
        console.log(action)
            return Object.assign({}, state, {
                curSong: action.val
            });
        default:
            return state;
    }
}

export default main;