import React, { useContext, useEffect, useState } from "react";
import MapView from "react-native-maps";

/* Add a marker on the map based on the friend's current location */

const FriendMapMarker = ({ friend }) => {
  return (
    friend && (
      <MapView.Marker
        coordinate={JSON.parse(friend.location).coords}
        title={friend.name}
        description={"Your friend is here"}
      />
    )
  );
};
export default FriendMapMarker;
