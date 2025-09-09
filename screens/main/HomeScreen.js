import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Header from '../common/Header';
import ProductCard from '../common/ProductCard';
import Button from '../common/Button';
import {useApp} from '../../context/AppContext';
import {apiService} from '../../services/api';

const Colors = {
  primary: '#FF6B9D',
  secondary: '#C44569',
  background: '#FFFFFF',
  text: '#2C2C2C',
  gray: '#8E8E93',
  lightGray: '#F8F8F8',
  border: '#E5E5E5',
};

const HomeScreen = ({navigation}) => {
  const {state, setProducts, addToCart, getCartItemsCount} = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (!searchQuery.trim()) {
      setFilteredProducts(state.products);
    } else {
      const filtered = state.products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, state.products]);

  const loadProducts = async () => {
    try {
      const response = await apiService.getBeautyProducts();
      setProducts(response.products);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadProducts();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      const response = await apiService.searchProducts(query);
      setProducts(response.products);
    } catch (error) {
      Alert.alert('Search Error', error.message);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', {product});
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert(
      'Added to Cart',
      `${product.title} has been added to your cart.`,
      [{text: 'OK'}]
    );
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const renderProductCard = ({item, index}) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      onAddToCart={handleAddToCart}
      style={[
        styles.productCard,
        index % 2 === 0 ? styles.leftCard : styles.rightCard,
      ]}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Hello, {state.user?.firstName || 'Beauty Lover'}! 👋
        </Text>
        <Text style={styles.welcomeSubtext}>
          Discover your perfect beauty products
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <Icon name="x" size={18} color={Colors.gray} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
          <Icon name="sliders" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesRow}>
          {['All', 'Makeup', 'Skincare', 'Fragrance', 'Tools'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                category === 'All' && styles.activeCategoryButton,
              ]}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.categoryButtonText,
                  category === 'All' && styles.activeCategoryButtonText,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <Text style={styles.productCount}>
          {filteredProducts.length} products
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="shopping-bag" size={64} color={Colors.gray} />
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `No products match "${searchQuery}". Try a different search term.`
          : 'Unable to load products. Please try again.'}
      </Text>
      <Button
        title="Retry"
        onPress={() => searchQuery ? setSearchQuery('') : loadProducts()}
        variant="outline"
        size="medium"
        style={styles.retryButton}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.footerLoaderText}>Loading more products...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <Header
        title="GlowCart"
        showCartButton
        cartItemsCount={getCartItemsCount()}
        onCartPress={() => Alert.alert('Cart', 'Cart screen would open here')}
        rightIcon={<Icon name="bell" size={24} color={Colors.text} />}
        onRightIconPress={() => Alert.alert('Notifications', 'Notifications would show here')}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={state.loading ? null : renderEmptyState}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.listContainer,
          filteredProducts.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        onEndReached={() => {
          // Implement pagination here if needed
        }}
        onEndReachedThreshold={0.1}
      />

      {state.loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  headerContent: {
    paddingBottom: 16,
  },
  welcomeSection: {
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: Colors.gray,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  categoryButton: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  activeCategoryButtonText: {
    color: Colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  productCount: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  productCard: {
    marginBottom: 16,
  },
  leftCard: {
    marginRight: 8,
  },
  rightCard: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerLoaderText: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 12,
  },
});

export default HomeScreen;