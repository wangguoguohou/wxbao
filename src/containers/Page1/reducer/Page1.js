import * as Types from '../types/Page1'

const initialState = {
  page1: 1
};

export default function Page1(state = initialState, action = {}) {
  switch (action.type) {
    case Types.TEST:
      return {
        ...state,
        page1: action.payload
      };
    default:
      return state;
  }
}

