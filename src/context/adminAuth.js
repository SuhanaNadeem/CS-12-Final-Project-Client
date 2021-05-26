import jwtDecode from "jwt-decode";
import React, { createContext, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const initialState = {
  admin: null,
};

const AdminAuthContext = createContext({
  admin: null,
  loginAdmin: (adminData) => {},
  logoutAdmin: () => {},
});

function adminAuthReducer(state, action) {
  switch (action.type) {
    case "LOGIN_ADMIN":
      return {
        ...state,
        admin: action.payload,
      };
    case "LOGOUT_ADMIN":
      return {
        ...state,
        admin: null,
      };
    default:
      return state;
  }
}

(async function () {
  const token = await AsyncStorage.getItem("adminJwtToken");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        await AsyncStorage.removeToken("adminJwtToken");
      } else {
        initialState.admin = decodedToken;
      }
    } catch (e) {
      await AsyncStorage.removeItem("adminJwtToken");
    }
  }
})();

function AdminAuthProvider(props) {
  // const _retrieveData = async () => {
  // const token = await AsyncStorage.getItem("adminJwtToken");
  // console.log("hi there");
  // if (token) {
  //   console.log(decodedToken);
  //   const decodedToken = jwtDecode(token);
  //   if (decodedToken.exp * 1000 < Date.now()) {
  //     await AsyncStorage.AsyncStorage.removeItem("adminJwtToken");
  //   } else {
  //     initialState.admin = decodedToken;
  //   }
  // }
  // };
  // await _retrieveData();
  // await handleToken();

  const [state, dispatch] = useReducer(adminAuthReducer, initialState);

  // useEffect(() => {
  //   const initState = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("adminJwtToken");
  //       const decodedToken = jwtDecode(token);
  //       if (decodedToken.exp * 1000 < Date.now()) {
  //         await removeToken("adminJwtToken");
  //       } else {
  //         initialState.admin = decodedToken;
  //       }

  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   initState();
  // }, [state, dispatch]);

  async function loginAdmin(adminData) {
    try {
      await AsyncStorage.setItem("adminJwtToken", adminData.token);
    } catch (e) {
      console.log("Error: " + e);
    }
    dispatch({
      type: "LOGIN_ADMIN",
      payload: adminData,
    });
  }

  async function logoutAdmin() {
    try {
      await removeToken("adminJwtToken");
    } catch (e) {
      console.log("Error: " + e);
    }
    dispatch({ type: "LOGOUT_ADMIN" });
  }

  return (
    <AdminAuthContext.Provider
      value={{ admin: state.admin, loginAdmin, logoutAdmin }}
      {...props}
    />
  );
}

export { AdminAuthContext, AdminAuthProvider };
