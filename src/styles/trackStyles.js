import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    alignContent: "center",
    backgroundColor: "#2f4f4f",
  },
  mapContainer: {
    backgroundColor: "white",
    flexDirection: "column",
    marginBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 40,
  },
  formText: {
    fontSize: 20,
    color: "white",
  },
  new: {
    // backgroundColor: "white",
    // alignItems: "center",
    // justifyContent: "center",
    // borderRadius: 20,
    // marginTop: 50,
    // width: 100,
    // height: 50,
    color: "white",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
  },
  centered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  submitText: {
    fontSize: 16,
    paddingTop: 10,
    color: "#2f4f4f",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: "#2f4f4f",
  },
  loginText: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 2,
    justifyContent: "center",
    marginVertical: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 450,
    marginBottom: 20,
    borderRadius: 20,
  },
  end: {
    flexDirection: "column",

    alignItems: "center",
    paddingTop: 2,
    justifyContent: "center",
  },
  baseText: {
    paddingBottom: 40,
    fontSize: 16,
  },
  loginText: {
    fontSize: 22,
    color: "white",
  },
  signupText: {
    fontSize: 20,
    fontStyle: "italic",
    color: "white",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 40,
    paddingBottom: 10,
    color: "#2f4f4f",
  },
  input: {
    paddingVertical: 6,
    backgroundColor: "white",
    paddingHorizontal: 20,
    marginVertical: 12,
    width: "100%",
    height: 55,
    overflow: "scroll",
    borderRadius: 15,
    marginBottom: 30,
    fontSize: 16,
  },
});
