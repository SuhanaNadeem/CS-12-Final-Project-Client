import jwtDecode from "jwt-decode";
import React, { createContext, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* This file uses AsyncStorage to define a user's "context", which allows them to perform all 
user actions through mutations and queries. This context is handled on login/logout. */

const initialState = {
  user: null,
};

const UserAuthContext = createContext({
  user: null,
  loginUser: (userData) => {},
  logoutUser: () => {},
});

function userAuthReducer(state, action) {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

(async function() {
  const token = await AsyncStorage.getItem("jwtToken");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        await AsyncStorage.removeToken("jwtToken");
      } else {
        initialState.user = decodedToken;
      }
    } catch (e) {
      await AsyncStorage.removeItem("jwtToken");
    }
  }
})();

function UserAuthProvider(props) {
  const [state, dispatch] = useReducer(userAuthReducer, initialState);

  async function loginUser(userData) {
    try {
      await AsyncStorage.setItem("jwtToken", userData.token);
    } catch (e) {
      console.log("Error: " + e);
    }
    dispatch({
      type: "LOGIN_USER",
      payload: userData,
    });
  }

  async function logoutUser() {
    try {
      await AsyncStorage.removeItem("jwtToken");
    } catch (e) {
      console.log("Error: " + e);
    }
    dispatch({ type: "LOGOUT_USER" });
  }

  return (
    <UserAuthContext.Provider
      value={{ user: state.user, loginUser, logoutUser }}
      {...props}
    />
  );
}

export { UserAuthContext, UserAuthProvider };
