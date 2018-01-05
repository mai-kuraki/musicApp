import {combineReducers} from 'redux';
import main from './main';
import search from './search';

const rootReducer = combineReducers({
    main,
    search
});

export default rootReducer;