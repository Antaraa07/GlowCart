import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const Colors = {
  primary: '#FF6B9D',
  secondary: '#C44569',
  background: '#FFFFFF',
  text: '#2C2C2C',
  gray: '#8E8E93',
  lightGray: '#F8F8F8',
};

const Header = ({
  title,
  subtitle,
  showBackButton = false,
  showCartButton = false,
  showSearchButton = false,
  cartItemsCount = 0,
  onBackPress,
  onCartPress,
  onSearchPress,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  backgroundColor = Colors.background,
  textColor = Colors.text,
  style,
  titleStyle,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();

  const renderLeftContent = () => {
    if (leftIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLeftIconPress}
          activeOpacity={0.7}>
          {leftIcon}
        </TouchableOpacity>
      );
    }

    if (showBackButton) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress}
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color={textColor} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.placeholder} />;
  };

  const renderRightContent = () => {
    const rightElements = [];

    if (showSearchButton) {
      rightElements.push(
        <TouchableOpacity
          key="search"
          style={styles.iconButton}
          onPress={onSearchPress}
          activeOpacity={0.7}>
          <Icon name="search" size={24} color={textColor} />
        </TouchableOpacity>
      );
    }

    if (showCartButton) {
      rightElements.push(
        <TouchableOpacity
          key="cart"
          style={styles.iconButton}
          onPress={onCartPress}
          activeOpacity={0.7}>
          <View>
            <Icon name="shopping-bag" size={24} color={textColor} />
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      rightElements.push(
        <TouchableOpacity
          key="custom"
          style={styles.iconButton}
          onPress={onRightIconPress}
          activeOpacity={0.7}>
          {rightIcon}
        </TouchableOpacity>
      );
    }

    if (rightElements.length === 0) {
      return <View style={styles.placeholder} />;
    }

    return (
      <View style={styles.rightContent}>
        {rightElements}
      </View>
    );
  };

  const headerStyle = [
    styles.header,
    {
      paddingTop: insets.top,
      backgroundColor: transparent ? 'transparent' : backgroundColor,
    },
    transparent && styles.transparentHeader,
    style,
  ];

  return (
    <>
      <StatusBar
        barStyle={textColor === Colors.text ? 'dark-content' : 'light-content'}
        backgroundColor={transparent ? 'transparent' : backgroundColor}
        translucent={transparent}
      />
      <View style={headerStyle}>
        <View style={styles.content}>
          {renderLeftContent()}
          
          <View style={styles.titleContainer}>
            {title && (
              <Text style={[styles.title, {color: textColor}, titleStyle]} numberOfLines={1}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, {color: textColor}]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
          
          {renderRightContent()}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  transparentHeader: {
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  rightContent: {
    flexDirection: 'row',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Header;