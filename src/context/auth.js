//TODO: add jwt-decode

import jwtDecode from "jwt-decode";
import * as React from "react";
import {
  getItem as getToken,
  setItem as setItem,
  removeItem as removeToken,
} from "../util/asyncStorage";
export const AdminAuthContext = React.createContext({
  status: "idle",
  adminAuthToken: null,
  loginAdmin: () => {},
  logoutAdmin: () => {},
});
export const useAuthorization = () => {
  const context = React.useContext(AdminAuthContext);
  if (!context) {
    throw new Error("Error");
  }
  return context;
};
export const AdminAuthProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, {
    status: "idle",
    adminAuthToken: null,
  });
  React.useEffect(() => {
    const initState = async () => {
      try {
        const adminAuthToken = await getToken("adminJwtToken");
        const decodedToken = jwtDecode(adminAuthToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          await removeToken("adminJwtToken");
        } else {
          initialState.admin = decodedToken;
        }

        // const adminAuthToken = await getToken();
        if (adminAuthToken !== null) {
          dispatch({ type: "LOGIN_ADMIN", token: adminAuthToken });
        } else {
          dispatch({ type: "LOGOUT_ADMIN" });
        }
      } catch (e) {
        console.log(e);
      }
    };
    initState();
  }, [state, dispatch]);
  const actions = React.useMemo(
    () => ({
      loginAdmin: async (token) => {
        dispatch({ type: "LOGIN_ADMIN", token });
        await AsyncStorage.setItem(token);
      },
      logoutAdmin: async () => {
        dispatch({ type: "LOGOUT_ADMIN" });
        await removeToken();
      },
    }),
    [state, dispatch]
  );
  return (
    <AdminAuthContext.Provider value={{ ...state, ...actions }}>
      {props.children}
    </AdminAuthContext.Provider>
  );
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGOUT_ADMIN":
      return {
        ...state,
        status: "logoutAdmin",
        adminAuthToken: null,
      };
    case "LOGIN_ADMIN":
      return {
        ...state,
        status: "loginAdmin",
        adminAuthToken: action.token,
      };
  }
};
