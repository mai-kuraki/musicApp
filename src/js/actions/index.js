import * as TYPE from '../lib/const';

export function setSearchList(val) {
    return {
        type: TYPE.SET_SEARCH_LIST,
        val: val
    }
}

export function setCurSong(val) {
    return {
        type: TYPE.SET_CUR_SONG,
        val: val
    }
}

export function setCurPlaySong(val) {
    return {
        type: TYPE.SET_CUR_PLAY_SONG,
        val: val
    }
}

export function setPlayState(val) {
    return {
        type: TYPE.SET_PLAY_STATE,
        val: val
    }
}