import * as Types from '../types/Page2'

const initialState = {
  page2: 1
};

export default function Page2(state = initialState, action = {}) {
  switch (action.type) {
    case Types.TEST:
      return {
        ...state,
        page2: action.payload
      };
    default:
      return state;
  }
}

