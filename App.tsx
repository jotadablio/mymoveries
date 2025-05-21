import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import MoviesListScreen from './src/screens/MoviesListScreen';
import SeriesListScreen from './src/screens/SeriesListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' }
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MoviesList" component={MoviesListScreen} />
        <Stack.Screen name="SeriesList" component={SeriesListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
