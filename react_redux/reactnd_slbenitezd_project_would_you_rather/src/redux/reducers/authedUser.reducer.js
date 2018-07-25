import { LOG_IN, LOG_OUT } from '../actions/types.action'

export default function authedUser(state = null, action) {
  switch (action.type) {
    case LOG_IN:
      return action.authedUser
    case LOG_OUT:
      return null
    default:
      return state
  }
}