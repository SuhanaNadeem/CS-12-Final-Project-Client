//TODO: add jwt-decode

import jwtDecode from "jwt-decode";
import * as React from "react";
import {
  getItem as getToken,
  setItem as setItem,
  removeItem as removeToken,
} from "../util/asyncStorage";
const UserAuthContext = React.createContext({
  status: "idle",
  userAuthToken: null,
  loginUser: () => {},
  logoutUser: () => {},
});
export const useAuthorization = () => {
  const context = React.useContext(UserAuthContext);
  if (!context) {
    throw new Error("Error");
  }
  return context;
};
export const UserAuthProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, {
    status: "idle",
    userAuthToken: null,
  });
  React.useEffect(() => {
    const initState = async () => {
      try {
        const userAuthToken = await getToken("jwtToken");
        const decodedToken = jwtDecode(userAuthToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          await removeToken("jwtToken");
        } else {
          initialState.user = decodedToken;
        }

        // const userAuthToken = await getToken();
        if (userAuthToken !== null) {
          dispatch({ type: "LOGIN_USER", token: userAuthToken });
        } else {
          dispatch({ type: "LOGOUT_USER" });
        }
      } catch (e) {
        console.log(e);
      }
    };
    initState();
  }, [state, dispatch]);
  const actions = React.useMemo(
    () => ({
      loginUser: async (token) => {
        dispatch({ type: "LOGIN_USER", token });
        await AsyncStorage.setItem(token);
      },
      logoutUser: async () => {
        dispatch({ type: "LOGOUT_USER" });
        await removeToken();
      },
    }),
    [state, dispatch]
  );
  return (
    <UserAuthContext.Provider value={{ ...state, ...actions }}>
      {props.children}
    </UserAuthContext.Provider>
  );
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGOUT_USER":
      return {
        ...state,
        status: "logoutUser",
        userAuthToken: null,
      };
    case "LOGIN_USER":
      return {
        ...state,
        status: "loginUser",
        userAuthToken: action.token,
      };
  }
};
