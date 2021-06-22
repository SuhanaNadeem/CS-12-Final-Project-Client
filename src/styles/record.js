import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    flexDirection: "column",
    paddingHorizontal: 25,
  },

  titleText: {
    fontSize: 20,
    color: "#2f4f4f",
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 60,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2f4f4f",
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
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
  image: {
    width: "100%",
    resizeMode: "cover", // or 'stretch'
  },
  centered: {
    flexDirection: "column",

    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginText: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 2,
    justifyContent: "center",
    marginVertical: 10,
  },
  end: {
    flexDirection: "column",

    alignItems: "center",
    paddingTop: 2,
    justifyContent: "center",
  },
  baseText: {
    paddingBottom: 40,
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
    paddingTop: 30,
    paddingBottom: 10,
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
