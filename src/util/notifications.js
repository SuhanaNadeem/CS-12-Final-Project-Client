import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
export async function sendPushNotification({
  expoPushToken,
  data,
  title,
  body,
}) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data,
    // title: "Title",
    // body: "Body",
    // data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export async function registerForPushNotificationsAsync() {
  let token;
  console.log("registerForPushNotificationsAsync entered");
  if (Constants.isDevice) {
    console.log("Constants.isDevice condition true");
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    console.log("await Notifications.getExpoPushTokenAsync()");
    console.log(await Notifications.getExpoPushTokenAsync())
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("token:");
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
