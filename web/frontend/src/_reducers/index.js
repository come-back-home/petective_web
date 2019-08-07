import { combineReducers } from 'redux'

import { authentication } from './authentication.reducer'
import { users } from './users.reducer'
import { alert } from './alert.reducer'
import { resetPassword } from './resetPassword.reducer'
import { environment } from './environment.reducer'

const rootReducer = combineReducers({
  authentication,
  users,
  alert,
  resetPassword,
  environment
})

export default rootReducer
