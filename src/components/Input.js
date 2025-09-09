import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Colors = {
  primary: '#FF6B9D',
  secondary: '#C44569',
  background: '#FFFFFF',
  text: '#2C2C2C',
  gray: '#8E8E93',
  lightGray: '#F8F8F8',
  border: '#E5E5E5',
  error: '#FF3B30',
  success: '#34C759',
};

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  success,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (success) return Colors.success;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label,
          error && styles.errorLabel,
          success && styles.successLabel,
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        {borderColor: getBorderColor()},
        isFocused && styles.focusedContainer,
        error && styles.errorContainer,
        success && styles.successContainer,
        !editable && styles.disabledContainer,
        style,
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={secureTextEntry ? togglePasswordVisibility : onRightIconPress}
            activeOpacity={0.7}>
            {secureTextEntry ? (
              <Icon 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color={Colors.gray} 
              />
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={styles.messageContainer}>
          <Icon name="alert-circle" size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {success && !error && (
        <View style={styles.messageContainer}>
          <Icon name="check-circle" size={14} color={Colors.success} />
          <Text style={styles.successText}>{success}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  errorLabel: {
    color: Colors.error,
  },
  successLabel: {
    color: Colors.success,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  focusedContainer: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorContainer: {
    borderColor: Colors.error,
  },
  successContainer: {
    borderColor: Colors.success,
  },
  disabledContainer: {
    backgroundColor: Colors.lightGray,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 14,
  },
  inputWithLeftIcon: {
    marginLeft: 12,
  },
  inputWithRightIcon: {
    marginRight: 12,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    padding: 4,
    marginLeft: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginLeft: 6,
    flex: 1,
  },
  successText: {
    fontSize: 14,
    color: Colors.success,
    marginLeft: 6,
    flex: 1,
  },
});

export default Input;