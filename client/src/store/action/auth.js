import axios from "../../utils/axiox.base"
import * as types from "./types"

export const authStart = () => ({
  type: types.AUTH_START, payload: {
    isloading: true
  }
});

export const authSuccess = (token, userId, user, msg) => ({
  type: types.AUTH_SUCCESS,
  payload: {
    token,
    userId,
    user,
    msg
  }

});

export const authFailed = msg => ({
  type: types.AUTH_FAILED,
  payload: msg
});

export const auth = (authData) => {
  return (dispatch) => {
    dispatch(authStart())
    axios.post("/user/", authData)
      .then(res => {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(authSuccess(user, token))
      })
      .catch(err => dispatch(authFailed(err)));
  }
};

export const logInFailed = (msg) => {
  return {
    type: types.LOGINFAILED,
    payload: msg
  }
};

export const login = (authData) => {
  console.log("token")
  return (dispatch) => {
    dispatch(authStart())
    axios.post("/user/login", authData)
      .then(res => {
        const { user, token } = res.data;
        localStorage.setItem("token", token);
        console.log(token)
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(authSuccess(user, token))
      })
      .catch(err => {
        console.log(err.response)

        // dispatch(logInFailed(err.response.data))
      })
  }
};


export const loadAuthUser = (token) => {
  axios.defaults.headers.common['x-access-token'] = `${token}`;
  return (dispatch) => {
    axios.get('/auth/user')
      .then(
        res => {
          localStorage.setItem("user", JSON.stringify(res.data));
          dispatch(authSuccess(res.data, token))
          console.log(res.data)
        }
      )
      .catch(
        error => {
          if (error.response) {
            dispatch(logout());
          } else if (error.request) {
            dispatch(logout());
          }
        }
      )
  }
};


export const logout = () => {
  return {
    type: types.LOGOUT_SUCCESS
  }
};