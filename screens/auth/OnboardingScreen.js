import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Button from '../../components/Button';

const {width, height} = Dimensions.get('window');

const Colors = {
  primary: '#FF6B9D',
  secondary: '#C44569',
  background: '#FFFFFF',
  text: '#2C2C2C',
  gray: '#8E8E93',
  lightGray: '#F8F8F8',
};

const OnboardingScreen = ({navigation}) => {
  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <View style={styles.content}>
        {/* Logo/Image Section */}
        <View style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>💄</Text>
            </View>
            <View style={styles.brandContainer}>
              <Text style={styles.brandName}>GlowCart</Text>
              <Text style={styles.brandSubtitle}>Beauty E-commerce</Text>
            </View>
          </View>
          
          {/* Decorative Elements */}
          <View style={styles.decorativeContainer}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Discover Your{'\n'}
            <Text style={styles.highlightText}>Perfect Look</Text>
          </Text>
          
          <Text style={styles.tagline}>
            Your Beauty, Delivered
          </Text>
          
          <Text style={styles.description}>
            Explore thousands of beauty products from top brands. 
            Find everything you need to express your unique style and glow with confidence.
          </Text>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            size="large"
            style={styles.getStartedButton}
          />
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={styles.featureText}>Premium Products</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🚚</Text>
              <Text style={styles.featureText}>Fast Delivery</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💝</Text>
              <Text style={styles.featureText}>Best Prices</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 2,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },
  decorativeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.1,
  },
  circle1: {
    width: 100,
    height: 100,
    backgroundColor: Colors.primary,
    top: '10%',
    left: '10%',
  },
  circle2: {
    width: 60,
    height: 60,
    backgroundColor: Colors.secondary,
    top: '20%',
    right: '15%',
  },
  circle3: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary,
    bottom: '10%',
    left: '20%',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 8,
  },
  highlightText: {
    color: Colors.primary,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flex: 0.8,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  getStartedButton: {
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default OnboardingScreen;