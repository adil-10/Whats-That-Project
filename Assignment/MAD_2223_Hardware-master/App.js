import React, { Component } from 'react';

import GlobalStyling from './src/views/globalStyling';
import LocationExample from './src/views/location';
import CameraBasic from './src/views/camera';
import CameraTakePicture from './src/views/camera-takephoto';
import CameraSendToServer from './src/views/camera-sendtoserver';
import DisplayImage from './src/views/display.js';


export default class App extends Component {
  render() {
    return (
      <DisplayImage />
    )
  }
}