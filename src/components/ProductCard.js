import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Accounting for margins and padding

const Colors = {
  primary: '#FF6B9D',
  secondary: '#C44569',
  background: '#FFFFFF',
  text: '#2C2C2C',
  gray: '#8E8E93',
  lightGray: '#F8F8F8',
  border: '#E5E5E5',
  yellow: '#FFD700',
};

const ProductCard = ({
  product,
  onPress,
  onAddToCart,
  showAddButton = true,
  style,
}) => {
  const {
    id,
    title,
    price,
    discountPercentage,
    rating,
    thumbnail,
    images,
    stock,
    brand,
  } = product;

  const imageSource = thumbnail || (images && images[0]) || 'https://via.placeholder.com/200x200?text=No+Image';
  const discountedPrice = discountPercentage 
    ? (price - (price * discountPercentage / 100)).toFixed(2)
    : price.toFixed(2);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart(product);
  };

  const renderRating = () => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="star" size={12} color={Colors.yellow} solid />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star" size={12} color={Colors.gray} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star" size={12} color={Colors.gray} />
      );
    }

    return (
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {stars}
        </View>
        <Text style={styles.ratingText}>({rating.toFixed(1)})</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: imageSource}}
          style={styles.image}
          resizeMode="cover"
        />
        {discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round(discountPercentage)}%
            </Text>
          </View>
        )}
        {stock <= 5 && stock > 0 && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Low Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        {brand && (
          <Text style={styles.brandText} numberOfLines={1}>
            {brand}
          </Text>
        )}
        
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {renderRating()}

        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>
              ${discountedPrice}
            </Text>
            {discountPercentage > 0 && (
              <Text style={styles.originalPrice}>
                ${price.toFixed(2)}
              </Text>
            )}
          </View>
          
          {showAddButton && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}>
              <Icon name="plus" size={16} color={Colors.background} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.lightGray,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 12,
  },
  brandText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 18,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 11,
    color: Colors.gray,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 13,
    color: Colors.gray,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductCard;