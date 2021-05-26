import jwtDecode from "jwt-decode";
import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

(async function () {
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
  // const _retrieveData = async () => {
  // const token = await AsyncStorage.getItem("jwtToken");
  // console.log("hi there");
  // if (token) {
  //   console.log(decodedToken);
  //   const decodedToken = jwtDecode(token);
  //   if (decodedToken.exp * 1000 < Date.now()) {
  //     await AsyncStorage.AsyncStorage.removeItem("jwtToken");
  //   } else {
  //     initialState.user = decodedToken;
  //   }
  // }
  // };
  // await _retrieveData();
  // await handleToken();

  const [state, dispatch] = useReducer(userAuthReducer, initialState);

  // useEffect(() => {
  //   const initState = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("jwtToken");
  //       const decodedToken = jwtDecode(token);
  //       if (decodedToken.exp * 1000 < Date.now()) {
  //         await removeToken("jwtToken");
  //       } else {
  //         initialState.user = decodedToken;
  //       }

  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   initState();
  // }, [state, dispatch]);

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
      await removeToken("jwtToken");
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
