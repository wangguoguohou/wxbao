import * as Types from '../types/index'

const initialState = {
  index: 1
};

export default function Page1(state = initialState, action = {}) {
  switch (action.type) {
    case Types.TEST:
      return {
        ...state,
        index: action.payload
      };
    default:
      return state;
  }
}

