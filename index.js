// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately


import { AppRegistry } from 'react-native';
import RootLayout from './app/_layout';
AppRegistry.registerComponent("Smoothify", () => RootLayout);