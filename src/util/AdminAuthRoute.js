import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AdminAuthContext } from "../context/adminAuth";

function AdminAuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AdminAuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default AdminAuthRoute;
