import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Beauty/cosmetic related keywords to filter products
const BEAUTY_KEYWORDS = [
  'mascara', 'lipstick', 'foundation', 'concealer', 'powder', 'blush',
  'eyeshadow', 'eyeliner', 'perfume', 'nail', 'skincare', 'cream',
  'serum', 'moisturizer', 'cleanser', 'toner', 'beauty', 'makeup',
  'cosmetic', 'essence', 'primer', 'highlighter', 'contour', 'bronzer'
];

// Function to check if a product is beauty-related
const isBeautyProduct = (product) => {
  const searchText = `${product.title} ${product.description} ${product.category}`.toLowerCase();
  return BEAUTY_KEYWORDS.some(keyword => searchText.includes(keyword));
};

// API Functions
export const apiService = {
  // Fetch all products and filter beauty products
  async getBeautyProducts() {
    try {
      const response = await api.get('/products?limit=100');
      const allProducts = response.data.products;
      
      // Filter beauty products
      let beautyProducts = allProducts.filter(isBeautyProduct);
      
      // If no beauty products found, use some products as mock beauty products
      if (beautyProducts.length === 0) {
        beautyProducts = allProducts.slice(0, 10).map(product => ({
          ...product,
          title: product.title.includes('Essence') ? product.title : `Beauty ${product.title}`,
          category: 'beauty',
          description: `Premium beauty product: ${product.description}`,
        }));
      }

      // Ensure we have some beauty-specific products
      const mockBeautyProducts = [
        {
          id: 1001,
          title: 'Essence Mascara Lash Princess',
          description: 'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting formula.',
          price: 9.99,
          discountPercentage: 7.17,
          rating: 4.94,
          stock: 5,
          brand: 'Essence',
          category: 'beauty',
          thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
          images: [
            'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
            'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/2.png'
          ],
        },
        {
          id: 1002,
          title: 'Eyeshadow Palette with Mirror',
          description: 'The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it\'s convenient for on-the-go makeup application.',
          price: 19.99,
          discountPercentage: 5.5,
          rating: 4.6,
          stock: 44,
          brand: 'Glamour Beauty',
          category: 'beauty',
          thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
          images: [
            'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png',
            'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/2.png'
          ],
        },
        {
          id: 1003,
          title: 'Powder Canister',
          description: 'The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth finish.',
          price: 14.99,
          discountPercentage: 18.14,
          rating: 3.82,
          stock: 59,
          brand: 'Velvet Touch',
          category: 'beauty',
          thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png',
          images: [
            'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png',
            'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/2.png'
          ],
        },
      ];

      // Combine filtered products with mock products, ensuring no duplicates
      const combinedProducts = [...mockBeautyProducts];
      beautyProducts.forEach(product => {
        if (!combinedProducts.find(p => p.id === product.id)) {
          combinedProducts.push(product);
        }
      });

      return {
        products: combinedProducts,
        total: combinedProducts.length,
      };
    } catch (error) {
      console.error('Error fetching beauty products:', error);
      throw new Error('Failed to fetch products. Please try again.');
    }
  },

  // Search products
  async searchProducts(query) {
    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
      const searchResults = response.data.products;
      
      // Filter for beauty products or return all if query might be beauty-related
      const beautyKeywordInQuery = BEAUTY_KEYWORDS.some(keyword => 
        query.toLowerCase().includes(keyword)
      );
      
      if (beautyKeywordInQuery) {
        return {
          products: searchResults,
          total: searchResults.length,
        };
      }
      
      const beautyResults = searchResults.filter(isBeautyProduct);
      return {
        products: beautyResults,
        total: beautyResults.length,
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Search failed. Please try again.');
    }
  },

  // Get single product
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product details.');
    }
  },

  // Get product categories
  async getCategories() {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories.');
    }
  },

  // Mock login function (since dummyjson doesn't have proper auth for this use case)
  async login(email, password) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Return mock user data
      return {
        id: 1,
        firstName: 'Beauty',
        lastName: 'Lover',
        email: email,
        username: email.split('@')[0],
        image: 'https://i.pravatar.cc/150?u=' + email,
        token: 'mock-jwt-token-' + Date.now(),
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Mock register function
  async register(userData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { fullName, email, password, confirmPassword } = userData;
      
      // Mock validation
      if (!fullName || !email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Return mock user data
      const [firstName, ...lastNameParts] = fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      return {
        id: Date.now(),
        firstName,
        lastName,
        email,
        username: email.split('@')[0],
        image: 'https://i.pravatar.cc/150?u=' + email,
        token: 'mock-jwt-token-' + Date.now(),
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
};

export default apiService;