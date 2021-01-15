import * as types from './mutations-type-string'

export default {

  [types.SETMANAGER](state, payload) {
    state.manager = payload;
  }

}