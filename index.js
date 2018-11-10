import { AppRegistry, YellowBox } from 'react-native';
import App from "./src/App";

YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
    'Module RCTImageLoader requires',
    'Warning: isMounted(...) is deprecated', 'Module RCTImageLoader',
]);

AppRegistry.registerComponent('easySellApp', () => App);
