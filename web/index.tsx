import React from 'react';
import { AppRegistry } from 'react-native';
import App from '../src/App';

// Register the main component
AppRegistry.registerComponent('StopwatchApp', () => App);

// Render to the web DOM
AppRegistry.runApplication('StopwatchApp', {
  rootTag: document.getElementById('app'),
});
