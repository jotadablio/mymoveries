import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { colors } from '../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  // Animações
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequência de animações
    // 1. Fade in do logo
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 2. Movimento do logo para cima
    Animated.timing(logoTranslateY, {
      toValue: -height * 0.1, // Movimento mais suave para cima
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // 3. Fade in dos botões
    Animated.timing(buttonsOpacity, {
      toValue: 1,
      duration: 500,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundDark, colors.backgroundDarker]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor={colors.backgroundDark} />
          
          <View style={styles.mainContainer}>
            {/* Logo animado */}
            <Animated.View 
              style={[
                styles.logoContainer, 
                { 
                  opacity: logoOpacity,
                  transform: [{ translateY: logoTranslateY }]
                }
              ]}
            >
              <Image 
                source={require('../assets/images/logomymoveriespng.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.content,
                { opacity: buttonsOpacity }
              ]}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('MoviesList')}>
                <Text style={styles.buttonText}>Filmes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SeriesList')}>
                <Text style={styles.buttonText}>Séries</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  logoContainer: {
    width: width * 0.8,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: '100%',
    height: '110%',
    marginTop: 140,
    marginBottom: -6
  },
  content: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
  },
});

export default HomeScreen;
