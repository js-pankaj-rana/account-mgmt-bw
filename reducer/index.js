import { combineReducers } from 'redux';
import { userActions } from '../actioncreators/UserPreferenceAction/userActionType';

import i18n from './i18nReducers';
import scheduleReducer from './scheduleReducer';
import profileSettings from './profileSettings';
import releaseSettings from './releaseSettings';
import newsSettings from './newsSettings';
import accountSettings from './accountSettings';
import ManageUserSettings from './manageUserSettings';
import ManageClient from './manageClient';
import maintenance from './maintenanceReducers';
import featureFlags from './featureFlagsReducers';
import validationError from './validationErrorReducer';

const initialState = {
  userData: '',
  user: null
};

const root = (state = initialState, action) => {
  switch (action.type) {
    case userActions.SET_USER: {
      return {
        ...state,
        user: action.payload
      };
    }

    default:
      return state;
  }
};

const currentView = (state = { module: '' }, action) => {
  if (action.type === userActions.SET_MODULE) {
    return {
      ...state,
      module: action.payload
    };
  }
  return state;
};

const appReducer = combineReducers({
  root,
  i18n,
  scheduleReducer,
  profileSettings,
  releaseSettings,
  newsSettings,
  accountSettings,
  ManageUserSettings,
  currentView,
  ManageClient,
  maintenance,
  featureFlags,
  validationError
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === userActions.LOGOUT_USER) {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;
