import { showLoading, hideLoading } from 'react-redux-loading'
import { LOG_IN, LOG_OUT } from './types.action'
import { saveUser } from '../../utils/api'

function logInUser(authedUser) {
  return {
    type: LOG_IN,
    authedUser,
  }
}

function logOutUser() {
  return {
    type: LOG_OUT,
    aurhedUser: null,
  }
}

export function handleLogInUser(user) {
  // Optimistic updating
  return (dispatch) => {
    dispatch(showLoading())

    return saveUser({ user })
      .then((user) => dispatch(logInUser(user)))
      .then(() => dispatch(hideLoading()))
  }
}

export function handleLogOutUser() {
  // Optimistic updating
  return (dispatch) => {
    dispatch(showLoading())

    return saveUser(null)
      .then(() => dispatch(logOutUser()))
      .then(() => dispatch(hideLoading()))
  }
}