import React from 'react';
import { StyleSheet, Text, View, ToastAndroid } from 'react-native';
import CameraView from './components/Camera'
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import Quiz from './components/Quiz';

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isCamera: false,
    photo: null,
    isFace:false,
    isQuiz:false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  

  flipCamera = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  }

  capture = async (camera) => {
    const photo = await camera.takePictureAsync();
    console.log('photo *********', photo);
    const face = await this.detectFaces(photo.uri)
    console.log('face ===>',face)
    const isFace = face.faces.length ? true : false
    this.setState({ photo: photo.uri,isFace })
    !isFace && ToastAndroid.show('Error No Face Found !', ToastAndroid.SHORT);
  }

  

  backToHome = () => {
    this.setState({ isCamera: false })
  }

  backToCamera = () => {
    this.setState({ photo: null })
  }

  detectFaces = async imageUri => {
    const options = { mode: FaceDetector.Constants.Mode.fast };
    return await FaceDetector.detectFacesAsync(imageUri, options);
  };

  startQuiz = () => {
    this.setState({isQuiz:true})
  }

render(){
  return (
    <View style={{flex:1}}>
      { this.state.isQuiz ? <Quiz /> : <CameraView 
        type={this.state.type}
        flipCamera={this.flipCamera}
        hasCameraPermission={this.state.hasCameraPermission}
        backToHome={this.backToHome}
        capture={this.capture}
        photo={this.state.photo}
        backToCamera={this.backToCamera}
        isFace = {this.state.isFace}
        startQuiz={this.startQuiz}
      />}
      {/* <Quiz /> */}
    </View>
  );
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
