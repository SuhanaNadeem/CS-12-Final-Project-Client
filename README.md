# Street Guard Client

### Client Usage

Once you have `CS-12-Final-Project-Client` and `CS-12-Final-Project-Server` stored in a root directory and your environment fully configured, do the following:

- Open a terminal within `CS-12-Final-Project-Client` and run `npm install`. This will install all the project's node dependencies, and only needs to be done once.
- Run `expo login` and enter your Expo app credentials.
- Run `expo start`. This will start the Expo client app, opening _Metro Bundler_.
- Scan the QR code there from your camera app (for IOS) or Expo app (for Android).
- Run the server by referring to _CS-12-Final-Project-Server_.

### Description

For many people, in recent times especially, simply walking the streets of their hometown for everyday activities comes with major risk. Even reaching into a pocket or bag for a phone becomes dangerous in many situations. These include police and thief encounters where an unjust scenario is transpiring. This is where Street Guard comes in. Street Guard is a voice-activated emergency-alert app with a specialty -- not only does it trigger emergency text messages, it also starts a recording whenever a police officer or thief is detected, based on a growing database of flagged phrases. User-selected voice keys for recording activation and deactivation, and an in-app map tracking the user's and their friends' locations are just a few of the ways Street Guard applies the power of technology to social justice issues. This app is a proof-of-concept, and not meant to be deployed in emergency situtations as of yet.

### Feature List

- Listen to device microphone in the background to detect police, thieves, and voice (start, stop, panic) keys
- Automatically record and store audio if user is in danger
- Play previous recordings of encounters within the app
- Share audio recordings over text
- Send voice-triggered text messages in critical situations
- Add, request, search, and remove friends within the app
- View and share location with friends on a map (toggleable)
- Create unique voice activation (start, stop, panic) keys
- View a listing of all police and thief activation phrases
- Send push notifications asking for audio and location permission, and notifying background/event recording start/stop

### How it Works

When logged into the app, the user will be presented with the option to allow background recordings. When enabled, Street Guard will record chunks of audio which will be match against a database of keywords and phrases used by police officers and thieves, triggering the recording to be saved when a match is found. These phrases are not restricted purely to the app's database however; users themselves are able to set their own start, stop, and panic key phrases that they can use to trigger events in our app, like saving recordings and sending SMS messages with location data. Users can friend others in the app as well, in order to monitor their friends' locations if they choose to have the feature enabled.

### API List

- Amazon S3 Simple Storage Service
- Expo Location SDK
- Expo MapView SDK
- Expo AV SDK
- Google Cloud Speech-to-Text

### Stack

- MongoDB
- Apollo GraphQL
- React Native
- Expo

### Notes

- Ideally, audio would be streamed from the user's microphone to the our server for speech-to-text and danger-detection, as well as event recordings themselves. In order to build a program that works efficiently with our tools (Expo specifically), we've simplified streaming to periodic, short chunks of audio, for both background and event recordings.
- The programmatical SMS feature is enabled via a
  trial account, allowing only certain phone numbers to be messaged to on 'panic'. Purchasing a Twilio account and removing the code indicated in `sendTwilioSMS()` would fix this.
- This app relies on the Google Cloud Speech-to-Text API for transcribing audio recordings as well as Amazon's S3 service for storing these recordings. As such, an internet connection is required for our app to function as intended. In the future, it would be ideal to
  fulfill both these features off the web, using
  downloaded local maps and built-in libraries.

### Sources

Here are our major sources for this project. More sources are included in specific parts of our client and server apps, as well as our `package.json` files in both ends.

- **App Setup and Learning Resources**

  - [Introduction to Expo Docs](https://docs.expo.io/)
  - [Apollo GraphQL React Native Docs](https://www.apollographql.com/docs/react/integrations/react-native/)
  - [Expo Async Storage Docs](https://docs.expo.io/versions/latest/sdk/async-storage/)
  - [React Native Style](https://reactnative.dev/docs/style)
  - [Expo Routing and Navigation Docs](https://docs.expo.io/guides/routing-and-navigation/)
  - [React Native Icons](https://oblador.github.io/react-native-vector-icons/)

* **Transcriptions (Speech-to-Text)**

  - [Google Cloud Speech-to-Text Docs](https://cloud.google.com/speech-to-text/docs/libraries)
  - [Google Cloud Speech-to-Text Node.js Demo](https://www.youtube.com/watch?v=naZ8oEKuR44&ab_channel=GoogleCloudTech)

- **Recordings and Storage**

  - [React Native S3 Module](https://www.npmjs.com/package/react-native-aws3)
  - [Expo Audio SDK Docs](https://docs.expo.io/versions/latest/sdk/audio/)
  - [Amazon S3 Node.js Docs](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html)

- **Location and Maps**

  - [Expo Location SDK Docs](https://docs.expo.io/versions/latest/sdk/location/)
  - [Expo MapView SDK Docs](https://docs.expo.io/versions/latest/sdk/map-view/)

- **Sharing and Messaging**

  - [Twilio SMS Send Messages Docs](https://www.twilio.com/docs/sms/send-messages)
  - [Twilio SMS Node.js Quickstart Docs](https://www.twilio.com/docs/sms/quickstart/node)
  - [Expo Notifications SDK Docs](https://docs.expo.io/versions/latest/sdk/notifications/)
  - [Expo SMS SDK Docs](https://docs.expo.io/versions/v41.0.0/sdk/sms/)
  - [GraphQL Filter Search Article](https://www.howtographql.com/react-apollo/7-filtering-searching-the-list-of-links/) [MongoDB Docs Aggregation](https://docs.mongodb.com/manual/tutorial/text-search-in-aggregation/)
