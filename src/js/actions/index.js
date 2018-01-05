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