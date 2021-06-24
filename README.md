# Street Guard

### Dependencies

>Node v. 7.17.0

>Expo v. 4.5.2

### Usage
`git clone` this repository in your desired directory. Inside a terminal within this directory, run `cd CS-12-Final-Project-Client`. Run `npm install`. Then, do `expo start`. This will start the client app. To run the server, see CS-12-Final-Project-Server.

### Description
For many people, in recent times especially, simply walking the streets of their hometown for everyday activities comes with major risk; reaching into a pocket or bag for a phone -- the best tool in isolated emergencies -- becomes dangerous in many situations. These include police and thief encounters, where an unjust scenario is transpiring. This is where Street Guard comes in. Street Guard is a voice-activated emergency-alert app with a specialty -- not only does it trigger emergency text messages, it also starts a recording whenever a police officer or thief is detected, based on a growing database of flagged words. This app is a proof-of-concept, and not meant to be deployed as of yet.

### Feature List
- Listens to device microphone in the background to detect police and thieves
- Automatically records audio if user is in danger
- Replay previous recordings of encounters within the app
- Share audio recordings over text
- Send voice-triggered text messages in critical situations
- Add and remove friends
- View and share location with friends on a map (toggleable)
- Create unique activation phrases
- View a listing of all police and thief activation phrases
- Push notifications

### How it Works

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
