import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Header from '../common/Header';
import Button from '../common/Button';
import {useApp} from '../../context/AppContext';

const Colors = {
  primary: '#FF6B9D',
  secondary: '#C44569',
  background: '#FFFFFF',
  text: '#2C2C2C',
  gray: '#8E8E93',
  lightGray: '#F8F8F8',
  border: '#E5E5E5',
};

const ProfileScreen = ({navigation}) => {
  const {state, logout, getCartItemsCount} = useApp();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.replace('Onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleMenuPress = (item) => {
    if (item.id === 'logout') {
      handleLogout();
      return;
    }
    
    Alert.alert(item.title, `${item.title} screen would open here.`);
  };

  const menuItems = [
    {
      id: 'address',
      title: 'Address',
      subtitle: 'Manage your delivery addresses',
      icon: 'map-pin',
    },
    {
      id: 'orders',
      title: 'Order History',
      subtitle: 'View your past orders',
      icon: 'package',
    },
    {
      id: 'language',
      title: 'Language',
      subtitle: 'English',
      icon: 'globe',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: 'bell',
    },
  ];

  const supportItems = [
    {
      id: 'contact',
      title: 'Contact Us',
      subtitle: 'Get in touch with our support team',
      icon: 'phone',
    },
    {
      id: 'help',
      title: 'Get Help',
      subtitle: 'FAQ and troubleshooting',
      icon: 'help-circle',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      icon: 'shield',
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      subtitle: 'Our terms of service',
      icon: 'file-text',
    },
  ];

  const renderUserInfo = () => (
    <View style={styles.userSection}>
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          {state.user?.image ? (
            <Image source={{uri: state.user.image}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {state.user?.firstName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
            <Icon name="camera" size={16} color={Colors.background} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {state.user?.firstName && state.user?.lastName
              ? `${state.user.firstName} ${state.user.lastName}`
              : state.user?.firstName || 'Beauty Lover'}
          </Text>
          <Text style={styles.userEmail}>
            {state.user?.email || 'user@example.com'}
          </Text>
          {state.user?.username && (
            <Text style={styles.userUsername}>@{state.user.username}</Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
          <Icon name="edit-3" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{getCartItemsCount()}</Text>
          <Text style={styles.statLabel}>In Cart</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </View>
      </View>
    </View>
  );

  const renderMenuItem = (item, isLast = false) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, isLast && styles.lastMenuItem]}
      onPress={() => handleMenuPress(item)}
      activeOpacity={0.8}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Icon name={item.icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={Colors.gray} />
    </TouchableOpacity>
  );

  const renderMenuSection = (title, items) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuContainer}>
        {items.map((item, index) => 
          renderMenuItem(item, index === items.length - 1)
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <Header
        title="Profile"
        showCartButton
        cartItemsCount={getCartItemsCount()}
        onCartPress={() => Alert.alert('Cart', 'Cart screen would open here')}
        rightIcon={<Icon name="settings" size={24} color={Colors.text} />}
        onRightIconPress={() => Alert.alert('Settings', 'Settings would open here')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {renderUserInfo()}
        
        {/* Premium Upgrade Banner */}
        <View style={styles.premiumBanner}>
          <View style={styles.premiumContent}>
            <View style={styles.premiumIcon}>
              <Icon name="crown" size={24} color={Colors.secondary} />
            </View>
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Get exclusive deals and free shipping
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {renderMenuSection('Account', menuItems)}
        {renderMenuSection('Support', supportItems)}
        
        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
        
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>GlowCart v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with 💄 for beauty lovers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  userSection: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 8,
    borderBottomColor: Colors.lightGray,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.background,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  premiumBanner: {
    backgroundColor: `${Colors.primary}15`,
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  premiumContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.secondary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  premiumButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  premiumButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  logoutButton: {
    borderColor: Colors.primary,
  },
  logoutButtonText: {
    color: Colors.primary,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
});

export default ProfileScreen;