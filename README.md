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
When logged into the app, the user will be presented with the option to allow background recordings. When enabled, Street Guard will record chunks of audio which will be match against a database of keywords and phrases used by police officers and thieves, triggering the recording to be saved when a match is found. These phrases are not restricted purely to the app's database however; users themselves are able to set their own start, stop, and panic key phrases that they themselves can use to trigger events in our app, like saving recordings and sending SMS messages with location data. Users can friend others in the app as well in order to monitor their friends and be able to view their location if they choose to have the feature enabled.

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

- This app relies heavily on the Google Cloud Speech-to-Text API for transcribing audio recordings as well as Amazon's S3 service for storing these recordings. As such, an internet connection is required for our app to function as intended.

### Sources

- **Recordings and Storage**
  - [React Native S3 Module](https://www.npmjs.com/package/react-native-aws3)
  - [Expo Audio SDK Docs](https://docs.expo.io/versions/latest/sdk/audio/)
- **Location and Maps**
  - [Expo Location SDK Docs](https://docs.expo.io/versions/latest/sdk/location/)
  - [Expo MapView SDK Docs](https://docs.expo.io/versions/latest/sdk/map-view/)
- **Messaging and Sharing**
  - [Twilio SMS](https://www.twilio.com/messaging)
  - [Expo Notifications SDK Docs](https://docs.expo.io/versions/latest/sdk/notifications/)
  - [Expo SMS SDK Docs](https://docs.expo.io/versions/v41.0.0/sdk/sms/)
