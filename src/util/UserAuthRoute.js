import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { UserAuthContext } from "../context/userAuth";

function UserAuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(UserAuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default UserAuthRoute;
