import MapView from "react-native-maps";
// import FriendMapMarker from "./FriendMapMarker";

const FriendMapMarker = ({ friend, styles }) => {

  return friend && (
    <MapView.Marker
        coordinate={JSON.parse(friend.location).coords}
        title={friend.name}
        description={"Your friend."}
    />
  );
};
export default FriendMapMarker;
