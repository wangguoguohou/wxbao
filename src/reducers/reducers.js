import { combineReducers } from 'redux'

import Page1 from '../containers/Page1/reducer/Page1'
import Page2 from '../containers/Page2/reducer/Page2'
//import DATDrawHome from '../containers/DATDrawHome/reducer/DATDrawHome'
//import AddressSearch from '../containers/AddressSearch/reducer/AddressSearch'
//import DATDrawing from '../containers/DATDrawing/reducer/DATDrawing'
//import DATDrawInfo from '../containers/DATDrawInfo/reducer/DATDrawInfo'
//import RoofSetting from '../containers/RoofSetting/reducer/RoofSetting'
//import HistoryProject from '../containers/HistoryProject/reducer/HistoryProject'

export default combineReducers({
    Page1,
    Page2,
    // DATDrawHome,
    // AddressSearch,
    // HistoryProject,
    // DATDrawing,
    // RoofSetting,
    // DATDrawInfo
});