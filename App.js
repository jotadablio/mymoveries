import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import MoviesListScreen from './src/screens/MoviesListScreen';
import SeriesListScreen from './src/screens/SeriesListScreen';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/utils/colors';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Image,
  ActivityIndicator,
  Platform,
  Dimensions,
  ImageBackground 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');

// Componente de Splash Screen
const SplashScreen = ({ onFinish }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Animação de fade in e scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Timer para simular carregamento
    const timer = setTimeout(() => {
      // Animação de fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.splashContainer}>
      <ImageBackground
        source={require('./src/assets/images/mymoverieslogo.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(74, 0, 0, 0.7)', 'rgba(42, 0, 0, 0.9)']}
          style={styles.overlay}
        >
          <Animated.View 
            style={[
              styles.logoContainer, 
              { 
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <ActivityIndicator 
              size="large" 
              color={colors.primary} 
              style={styles.loader} 
            />
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.backgroundDark }
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MoviesList" component={MoviesListScreen} />
        <Stack.Screen name="SeriesList" component={SeriesListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  }
});
