import Login from "./page/Login"
import HomeIndex from "./page/home/HomeIndex"
import Page from "./page/home//Page"

import { createStackNavigator } from 'react-navigation';

const App = createStackNavigator({
  Login: { screen: Login },
  Home: { screen: HomeIndex },
  Page: { screen: Page },
});

export default App;