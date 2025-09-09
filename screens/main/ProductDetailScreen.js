import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Button from '../common/Button';
import Header from '../common/Header';
import {useApp} from '../../context/AppContext';

const {width, height} = Dimensions.get('window');

const Colors = {
  primary: '#FF6B9D',
  secondary: '#C44569',
  background: '#FFFFFF',
  text: '#2C2C2C',
  gray: '#8E8E93',
  lightGray: '#F8F8F8',
  border: '#E5E5E5',
  yellow: '#FFD700',
  green: '#34C759',
};

const ProductDetailsScreen = ({route, navigation}) => {
  const {product} = route.params;
  const {addToCart, getCartItemsCount} = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const scrollViewRef = useRef();

  const images = product.images || [product.thumbnail];
  const discountedPrice = product.discountPercentage 
    ? (product.price - (product.price * product.discountPercentage / 100)).toFixed(2)
    : product.price.toFixed(2);

  const handleAddToBag = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    Alert.alert(
      'Added to Bag',
      `${quantity}x ${product.title} has been added to your bag.`,
      [
        {text: 'Continue Shopping', style: 'cancel'},
        {text: 'View Bag', onPress: () => Alert.alert('Bag', 'Bag screen would open here')},
      ]
    );
  };

  const updateQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="star" size={16} color={Colors.yellow} solid />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star" size={16} color={Colors.gray} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star" size={16} color={Colors.gray} />
      );
    }

    return stars;
  };

  const renderImageGallery = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
        }}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{uri: image}}
            style={styles.productImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {images.length > 1 && (
        <View style={styles.imageIndicators}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === selectedImageIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}

      {product.discountPercentage > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            -{Math.round(product.discountPercentage)}% OFF
          </Text>
        </View>
      )}
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.infoContainer}>
      {/* Brand and Title */}
      <View style={styles.titleSection}>
        {product.brand && (
          <Text style={styles.brandText}>{product.brand}</Text>
        )}
        <Text style={styles.title}>{product.title}</Text>
      </View>

      {/* Rating and Reviews */}
      {product.rating && (
        <View style={styles.ratingSection}>
          <View style={styles.starsContainer}>
            {renderStars(product.rating)}
          </View>
          <Text style={styles.ratingText}>
            {product.rating.toFixed(1)} (127 reviews)
          </Text>
        </View>
      )}

      {/* Price Section */}
      <View style={styles.priceSection}>
        <Text style={styles.currentPrice}>${discountedPrice}</Text>
        {product.discountPercentage > 0 && (
          <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
        )}
        <View style={styles.savingsContainer}>
          {product.discountPercentage > 0 && (
            <Text style={styles.savingsText}>
              You save ${(product.price - parseFloat(discountedPrice)).toFixed(2)}
            </Text>
          )}
        </View>
      </View>

      {/* Stock Status */}
      <View style={styles.stockSection}>
        <Icon 
          name={product.stock > 0 ? "check-circle" : "x-circle"} 
          size={16} 
          color={product.stock > 0 ? Colors.green : Colors.primary} 
        />
        <Text style={[
          styles.stockText,
          {color: product.stock > 0 ? Colors.green : Colors.primary}
        ]}>
          {product.stock > 0 
            ? `In Stock (${product.stock} available)` 
            : 'Out of Stock'
          }
        </Text>
      </View>

      {/* Quantity Selector */}
      <View style={styles.quantitySection}>
        <Text style={styles.quantityLabel}>Quantity</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[styles.quantityButton, quantity === 1 && styles.disabledButton]}
            onPress={() => updateQuantity(-1)}
            disabled={quantity === 1}>
            <Icon name="minus" size={18} color={quantity === 1 ? Colors.gray : Colors.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, quantity === 10 && styles.disabledButton]}
            onPress={() => updateQuantity(1)}
            disabled={quantity === 10}>
            <Icon name="plus" size={18} color={quantity === 10 ? Colors.gray : Colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{product.description}</Text>
    </View>
  );

  const renderHighlights = () => (
    <View style={styles.highlightsSection}>
      <Text style={styles.sectionTitle}>Product Highlights</Text>
      <View style={styles.highlightItem}>
        <Icon name="package" size={16} color={Colors.primary} />
        <Text style={styles.highlightText}>Dimensions: 2.5 x 1.2 x 4 inches</Text>
      </View>
      <View style={styles.highlightItem}>
        <Icon name="shield" size={16} color={Colors.primary} />
        <Text style={styles.highlightText}>2-year warranty included</Text>
      </View>
      <View style={styles.highlightItem}>
        <Icon name="truck" size={16} color={Colors.primary} />
        <Text style={styles.highlightText}>Free shipping on orders over $50</Text>
      </View>
      <View style={styles.highlightItem}>
        <Icon name="award" size={16} color={Colors.primary} />
        <Text style={styles.highlightText}>Cruelty-free and vegan formula</Text>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.reviewsSection}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {/* Mock Reviews */}
      <View style={styles.review}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <View style={styles.reviewerAvatar}>
              <Text style={styles.reviewerInitial}>S</Text>
            </View>
            <View>
              <Text style={styles.reviewerName}>Sarah M.</Text>
              <View style={styles.reviewStars}>
                {renderStars(5)}
              </View>
            </View>
          </View>
          <Text style={styles.reviewDate}>2 days ago</Text>
        </View>
        <Text style={styles.reviewText}>
          Amazing product! The quality is excellent and it lasts all day. 
          Definitely recommend for anyone looking for long-lasting coverage.
        </Text>
      </View>

      <View style={styles.review}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <View style={styles.reviewerAvatar}>
              <Text style={styles.reviewerInitial}>M</Text>
            </View>
            <View>
              <Text style={styles.reviewerName}>Maria L.</Text>
              <View style={styles.reviewStars}>
                {renderStars(4)}
              </View>
            </View>
          </View>
          <Text style={styles.reviewDate}>1 week ago</Text>
        </View>
        <Text style={styles.reviewText}>
          Good value for money. The color payoff is nice and it's easy to apply.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <Header
        showBackButton
        onBackPress={() => navigation.goBack()}
        showCartButton
        cartItemsCount={getCartItemsCount()}
        onCartPress={() => Alert.alert('Cart', 'Cart screen would open here')}
        rightIcon={<Icon name="heart" size={24} color={Colors.gray} />}
        onRightIconPress={() => Alert.alert('Wishlist', 'Added to wishlist')}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        
        {renderImageGallery()}
        {renderProductInfo()}
        {renderDescription()}
        {renderHighlights()}
        {renderReviews()}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            ${(parseFloat(discountedPrice) * quantity).toFixed(2)}
          </Text>
        </View>
        <Button
          title="Add to Bag"
          onPress={handleAddToBag}
          disabled={product.stock === 0}
          style={styles.addToBagButton}
        />
      </View>
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
  imageContainer: {
    height: width,
    position: 'relative',
  },
  productImage: {
    width: width,
    height: width,
    backgroundColor: Colors.lightGray,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 12,
  },
  brandText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 30,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.gray,
  },
  priceSection: {
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.gray,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  savingsText: {
    fontSize: 14,
    color: Colors.green,
    fontWeight: '500',
  },
  stockSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  descriptionSection: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: Colors.lightGray,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  highlightsSection: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: Colors.lightGray,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  reviewsSection: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: Colors.lightGray,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  review: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewerInitial: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.gray,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 120,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  addToBagButton: {
    flex: 1,
    marginLeft: 16,
  },
});

export default ProductDetailsScreen;