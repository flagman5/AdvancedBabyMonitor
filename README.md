# AdvancedBabyMonitor
Audio only baby monitor that has a 10 second delay before notifying parents. 

USE AT OWN RISK. There is no notification when the bluetooth connection to the speaker is dropped!! This is why I decided not to publish on Play store, because it is very risky. I have not come across any programmable bluetooth speakers so it is not really possible for the common person to build something commercially acceptable.

Yes, ideally once triggered the phone should just relay the crying sounds, but unfortunately it is very difficult to stream audio on an android app, so I had to just play a default music clip. There are some left over code from these attempts, such as the request for audio permissions which really isn't necessary with a music clip.

## Workflow

1. Once the app starts, the app will listen for changes in sound level
2. When the sound decibels goes beyond 60 dB, the app will begin to wait for 10 seconds
3. If after 10 seconds the sound level is still over 60 dB, a song will play on the bluetooth speaker (Yes, it is the Kick from Inception to wake you up!)
4. If after 10 seconds the sound level is not over 60 dB, then no song will play. 

## Dependencies

Check the package.json file. Also I did install Crashlytics but removed my config file, so you might want to look up how to install it or de-install it if you don't want it in various gradle files.

## Install Instructions

This is a standard React Native app, simply follow instructions to init a RN app, dump these files in, run 
- `npm install`
- `react-native link`
- `react-native run-android`

### *did not bother with iOS, feel free to try it
