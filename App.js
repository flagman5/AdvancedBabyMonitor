/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, PermissionsAndroid} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import RNSoundLevel from 'react-native-sound-level';
import Icon from 'react-native-vector-icons/Ionicons';
import KeepAwake from 'react-native-keep-awake';
import { AudioPlayer } from 'react-native-audio-player-recorder';
import Sound from 'react-native-sound';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      monitorStatus: false,
      beginWait: false,
      isTransmitting: false,
      //audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
      currentDB: 0,
      speakerConnected: 'Not Connected',
    };
    this.startMonitor = this.startMonitor.bind(this);
    this.stopMonitor = this.stopMonitor.bind(this);
    this.checkSound = this.checkSound.bind(this);
    this.requestAudioPermission();
  }

  componentDidMount() {

    AudioPlayer.getOutputs(outputs => {
      if(outputs.includes("Bluetooth")) {
        this.setState({speakerConnected: 'Connected'});
      }
    });

    this.track = new Sound('kick.mp4', Sound.MAIN_BUNDLE, (e) => {
      if (e) {
        console.log('error loading track:', e);
        alert("error loading "+e);
      }
    });
  }

  // don't forget to stop it
  componentWillUnmount() {
    RNSoundLevel.stop();
    this.track.release();
  }

  async requestAudioPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        'title': 'Cool App Audio Permission',
        'message': 'Cool App needs access to your Audio ' +
                   'so you can take awesome Audio.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the Audio")
    } else {
      console.log("Audio permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}
  startMonitor() {
    console.log("turned on")
    RNSoundLevel.start();
    KeepAwake.activate();
    this.setState({ monitorStatus: true
    }, this.runMonitor );

  }

  runMonitor() {
    this.checkSound();

    this.intervalId = BackgroundTimer.setInterval(() => {
	      // this will be executed every 200 ms
	      // even when app is the the background
      if(this.state.monitorStatus) {

        if(this.state.currentDB > -60 && !this.state.beginWait) {
            this.setState({beginWait: true});
        }
        else if(this.state.currentDB > -60 && this.state.beginWait && !this.state.isTransmitting){
          this.setState({beginWait: false});
          this.transmit();
        }
      }
    }, 10000);


  }

  stopMonitor() {
    this.setState({monitorStatus: false});
    BackgroundTimer.clearInterval(this.intervalId);
    RNSoundLevel.stop();
    KeepAwake.deactivate();
    this.track.stop();
    console.log("turned off")
  }

  checkSound() {

    RNSoundLevel.onNewFrame = (data) => {
      // see "Returned data" section below
      this.setState({currentDB: data.value});
      console.log(data);
    }
  }

  wait(ms){
     var start = new Date().getTime();
     var end = start;
     while(end < start + ms) {
       end = new Date().getTime();
    }
  }

  transmit() {
    //run for 30 sec then stop

    this.setState({isTransmitting: true});
    this.track.play();

    this.timeoutID = setTimeout(() => {
      this.setState({isTransmitting: false});
      this.track.stop();
    }, 30000);

  }



  showButton() {
    if(this.state.monitorStatus) {
      return (<Icon name="ios-close-circle"  size={100} color="#01a699" onPress={this.stopMonitor}/>)
    }
    else {
      return (<Icon name="ios-arrow-dropright-circle"  size={100} color="#01a699" onPress={this.startMonitor}/>);

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Advanced Baby Monitor!</Text>
        <TouchableOpacity
           style={{

               alignItems:'center',
               justifyContent:'center',
               width:100,
               height:100,
               backgroundColor:'#fff',
               borderRadius:100,
             }}
         >
           {this.showButton()}
         </TouchableOpacity>
         <Text style={styles.instructions}>Currently at {this.state.currentDB} dB </Text>
         <Text style={styles.instructions}>Bluetooth speaker conenction: {this.state.speakerConnected} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
