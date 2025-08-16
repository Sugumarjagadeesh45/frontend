// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import axios from 'axios';
// import MapView, { Marker } from 'react-native-maps';

// // Auto-detect base URL
// const getBaseURL = () => {
//   if (Platform.OS === 'android') {
//     if (__DEV__) return 'http://10.0.2.2:5000/api/users'; // Android emulator
//     return 'http://192.168.1.107:5000/api/users'; // Physical Android device
//   }
//   return 'http://localhost:5000/api/users'; // iOS simulator
// };

// export default function Screen1() {
//   const [location, setLocation] = useState(null);
//   const [lastLocation, setLastLocation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL = getBaseURL();

//   // Fetch current location
//   const getCurrentLocation = async () => {
//     Geolocation.getCurrentPosition(
//       async (position) => {
//         const coords = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         };
//         console.log("📍 My current location:", coords);
//         setLocation(coords);

//         try {
//           const res = await axios.post(`${BASE_URL}/location`, coords, {
//             headers: { 'Content-Type': 'application/json' },
//           });
//           console.log("✅ Sent location to backend:", res.data);
//         } catch (err) {
//           console.log("❌ Error sending location:", err.message);
//         }
//       },
//       (error) => {
//         console.log("❌ Location Error:", error.message);
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   // Fetch last saved location from backend
//   const fetchLastLocation = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/location/last`);
//       console.log("📂 Last saved location from backend:", res.data);
//       setLastLocation(res.data.location || res.data);
//     } catch (err) {
//       console.log("❌ Error fetching last location:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getCurrentLocation();
//     fetchLastLocation();
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Text style={styles.welcome}>👋 Welcome to the Map</Text>

//       {/* Current location */}
//       <Text style={styles.heading}>📍 My Current Location</Text>
//       {location ? (
//         <>
//           <Text style={styles.coords}>Latitude: {location.latitude}</Text>
//           <Text style={styles.coords}>Longitude: {location.longitude}</Text>
//         </>
//       ) : (
//         <Text style={styles.loading}>Fetching location...</Text>
//       )}

//       {/* Last saved location */}
//       <Text style={[styles.heading, { marginTop: 20 }]}>🗂 Backend Saved Location</Text>
//       {lastLocation ? (
//         <>
//           <Text style={styles.coords}>Latitude: {lastLocation.latitude}</Text>
//           <Text style={styles.coords}>Longitude: {lastLocation.longitude}</Text>
//         </>
//       ) : (
//         <Text style={styles.loading}>Loading last location...</Text>
//       )}

//       {/* Google Map */}
//       {location && (
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//         >
//           {/* Current location marker */}
//           <Marker
//             coordinate={location}
//             title="My Current Location"
//             pinColor="blue"
//           />
//           {/* Last saved location marker */}
//           {lastLocation && (
//             <Marker
//               coordinate={lastLocation}
//               title="Backend Saved Location"
//               pinColor="green"
//             />
//           )}
//         </MapView>
//       )}

//       {/* Share button */}
//       <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
//         <Text style={styles.buttonText}>📤 Share My Location</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     padding: 20,
//     backgroundColor: '#121212',
//     alignItems: 'center',
//   },
//   welcome: {
//     fontSize: 22,
//     color: '#FFD700',
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 10,
//   },
//   coords: {
//     fontSize: 16,
//     color: '#FFF',
//     backgroundColor: '#333',
//     padding: 6,
//     marginVertical: 4,
//     borderRadius: 5,
//   },
//   loading: {
//     fontSize: 16,
//     color: 'yellow',
//   },
//   map: {
//     width: '100%',
//     height: 300,
//     marginVertical: 20,
//     borderRadius: 10,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

































import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Constants
const PRIMARY_GREEN = '#0bc540';
const LIGHT_GRAY = '#f0f0f0';
const WHITE = '#ffffff';
const { width } = Dimensions.get('window');

// Auto-detect base URL for backend
const getBaseURL = () => {
  if (Platform.OS === 'android') {
    if (__DEV__) return 'http://10.0.2.2:5000/api/users'; // Android emulator
    return 'http://192.168.1.107:5000/api/users'; // Physical Android device
  }
  return 'http://localhost:5000/api/users'; // iOS simulator
};

// Interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

// Mock Data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone',
    description: 'Latest model smartphone with great camera',
    price: 699.99,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Headphones',
    description: 'Wireless noise-canceling headphones',
    price: 199.99,
    image: 'https://via.placeholder.com/150',
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Home' },
  { id: '4', name: 'Books' },
];

export default function Screen1() {
  const navigation = useNavigation();
  const BASE_URL = getBaseURL();

  // State Management for UI
  const [activeTab, setActiveTab] = useState('taxi');
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRideType, setSelectedRideType] = useState('taxi');
  const [dropoffSuggestions] = useState([
    { id: '1', name: 'Downtown Mall' },
    { id: '2', name: 'Central Railway Station' },
    { id: '3', name: 'City Park' },
    { id: '4', name: 'Main Hospital' },
  ]);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);

  // State Management for Location
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [lastSavedLocation, setLastSavedLocation] = useState<Location | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Handlers for UI
  const handlePickupChange = (text: string) => {
    setPickup(text);
  };

  const handleDropoffChange = (text: string) => {
    setDropoff(text);
    if (text.length > 2) {
      const mockSuggestions = [
        { id: '1', name: `${text} Street` },
        { id: '2', name: `${text} Mall` },
        { id: '3', name: `${text} Center` },
      ];
      setSuggestions(mockSuggestions);
      setShowDropoffSuggestions(true);
    } else {
      setShowDropoffSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: { id: string; name: string }) => {
    setDropoff(suggestion.name);
    setShowDropoffSuggestions(false);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    setNotificationsVisible(false);
  };

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
    setMenuVisible(false);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    navigation.navigate('WelcomeScreen3');
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'electronics':
        return 'devices';
      case 'clothing':
        return 'checkroom';
      case 'home':
        return 'home';
      case 'books':
        return 'menu-book';
      default:
        return 'shopping-cart';
    }
  };

  // Handlers for Location & Backend
  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('📍 My current location:', coords);
        setCurrentLocation(coords);
        setPickup('My Current Location'); // Auto-fill pickup location

        try {
          const res = await axios.post(`${BASE_URL}/location`, coords, {
            headers: { 'Content-Type': 'application/json' },
          });
          console.log('✅ Sent location to backend:', res.data);
        } catch (err) {
          console.log('❌ Error sending location:', err.message);
        }
      },
      (error) => {
        console.log('❌ Location Error:', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchLastLocation = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/location/last`);
      console.log('📂 Last saved location from backend:', res.data);
      setLastSavedLocation(res.data.location || res.data);
    } catch (err) {
      console.log('❌ Error fetching last location:', err.message);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Effect to run on component mount
  useEffect(() => {
    getCurrentLocation();
    fetchLastLocation();
  }, []);

  // Render Functions
  const renderTaxiContent = () => {
    return (
      <View style={styles.contentContainer}>
        {/* Map View */}
        <View style={styles.mapContainer}>
          {loadingLocation ? (
            <Text style={styles.mapLoadingText}>Loading map...</Text>
          ) : currentLocation ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={currentLocation}
                title="My Current Location"
                pinColor="blue"
              />
              {lastSavedLocation && (
                <Marker
                  coordinate={lastSavedLocation}
                  title="Last Saved Location"
                  pinColor="green"
                />
              )}
            </MapView>
          ) : (
            <Text style={styles.mapLoadingText}>Could not get location. Check permissions.</Text>
          )}
        </View>

        <View style={styles.locationInputContainer}>
          <View style={styles.locationInput}>
            <View style={styles.locationIcon}>
              <MaterialIcons name="my-location" size={20} color={PRIMARY_GREEN} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter Pickup Location"
              value={pickup}
              onChangeText={handlePickupChange}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.locationInput}>
            <View style={styles.locationIcon}>
              <MaterialIcons name="location-on" size={20} color="#f75555" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Where to?"
              value={dropoff}
              onChangeText={handleDropoffChange}
              onFocus={() => dropoff.length > 2 && setShowDropoffSuggestions(true)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {showDropoffSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((item: { id: string; name: string }) => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => selectSuggestion(item)}
              >
                <MaterialIcons name="location-on" size={20} color="#555" style={styles.suggestionIcon} />
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!showDropoffSuggestions && dropoffSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Popular nearby locations</Text>
            {dropoffSuggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => selectSuggestion(item)}
              >
                <MaterialIcons name="place" size={20} color={PRIMARY_GREEN} style={styles.suggestionIcon} />
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Ride type selector */}
        <View style={styles.rideTypeContainer}>
          <TouchableOpacity
            style={[styles.rideTypeButton, selectedRideType === 'taxi' && styles.selectedRideType]}
            onPress={() => setSelectedRideType('taxi')}
          >
            <MaterialIcons name="local-taxi" size={24} color={selectedRideType === 'taxi' ? WHITE : PRIMARY_GREEN} />
            <Text style={[styles.rideTypeText, selectedRideType === 'taxi' && styles.selectedRideTypeText]}>Book Taxi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rideTypeButton, selectedRideType === 'evehicle' && styles.selectedRideType]}
            onPress={() => setSelectedRideType('evehicle')}
          >
            <MaterialIcons name="electric-car" size={24} color={selectedRideType === 'evehicle' ? WHITE : PRIMARY_GREEN} />
            <Text style={[styles.rideTypeText, selectedRideType === 'evehicle' && styles.selectedRideTypeText]}>E-Vehicle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rideTypeButton, selectedRideType === 'port' && styles.selectedRideType]}
            onPress={() => setSelectedRideType('port')}
          >
            <MaterialIcons name="local-shipping" size={24} color={selectedRideType === 'port' ? WHITE : PRIMARY_GREEN} />
            <Text style={[styles.rideTypeText, selectedRideType === 'port' && styles.selectedRideTypeText]}>Book Port</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.bookRideButton}>
          <Text style={styles.bookRideButtonText}>BOOK RIDE</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderShoppingContent = () => (
    <ScrollView style={styles.shoppingContainer}>
      <Text style={styles.sectionTitle}>Featured Products</Text>

      {mockProducts.map((product) => (
        <View key={product.id} style={styles.productCard}>
          <View style={styles.productImage}>
            <MaterialIcons name="image" size={80} color="#ccc" />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
        {mockCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
          >
            <View style={styles.categoryIcon}>
              <MaterialIcons name={getCategoryIcon(category.name)} size={24} color={PRIMARY_GREEN} />
            </View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <View style={styles.menuHeader}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Menu</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          <FontAwesome name="user" size={24} color={PRIMARY_GREEN} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profilePhone}>+1 234 567 890</Text>
        </View>
        <Feather name="chevron-right" size={20} color="gray" />
      </View>

      <View style={styles.walletSection}>
        <View style={styles.walletIcon}>
          <FontAwesome name="money" size={20} color={PRIMARY_GREEN} />
        </View>
        <View style={styles.walletInfo}>
          <Text style={styles.walletTitle}>Wallet</Text>
          <Text style={styles.walletBalance}>$50.00</Text>
        </View>
        <Feather name="chevron-right" size={20} color="gray" />
      </View>

      <View style={styles.menuDivider} />

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuIcon}>
          <MaterialIcons name="payment" size={20} color={PRIMARY_GREEN} />
        </View>
        <Text style={styles.menuText}>Payment</Text>
        <Feather name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuIcon}>
          <MaterialIcons name="history" size={20} color={PRIMARY_GREEN} />
        </View>
        <Text style={styles.menuText}>My Travel History</Text>
        <Feather name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuIcon}>
          <MaterialIcons name="security" size={20} color={PRIMARY_GREEN} />
        </View>
        <Text style={styles.menuText}>Safety</Text>
        <Feather name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <View style={styles.menuIcon}>
          <MaterialIcons name="logout" size={20} color={PRIMARY_GREEN} />
        </View>
        <Text style={styles.menuText}>Logout</Text>
        <Feather name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>

      <View style={styles.menuDivider} />

      <View style={styles.menuFooter}>
        <Text style={styles.footerText}>App Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2023 TaxiApp Inc.</Text>
      </View>
    </View>
  );

  const renderNotifications = () => (
    <View style={styles.notificationsContainer}>
      <View style={styles.notificationsHeader}>
        <TouchableOpacity onPress={toggleNotifications}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.notificationsTitle}>Notifications</Text>
      </View>

      <ScrollView>
        <View style={styles.notificationItem}>
          <View style={styles.notificationIcon}>
            <MaterialIcons name="local-offer" size={20} color={PRIMARY_GREEN} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Special Offer</Text>
            <Text style={styles.notificationText}>Get 20% off on your next ride</Text>
            <Text style={styles.notificationTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationIcon}>
            <MaterialIcons name="directions-car" size={20} color={PRIMARY_GREEN} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Ride Completed</Text>
            <Text style={styles.notificationText}>Your ride to Downtown has been completed</Text>
            <Text style={styles.notificationTime}>Yesterday</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'taxi' && styles.activeTab]}
            onPress={() => setActiveTab('taxi')}
          >
            <MaterialIcons name="local-taxi" size={20} color={activeTab === 'taxi' ? 'white' : PRIMARY_GREEN} />
            <Text style={[styles.tabText, activeTab === 'taxi' && styles.activeTabText]}>Taxi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'shopping' && styles.activeTab]}
            onPress={() => setActiveTab('shopping')}
          >
            <MaterialIcons name="shopping-cart" size={20} color={activeTab === 'shopping' ? 'white' : PRIMARY_GREEN} />
            <Text style={[styles.tabText, activeTab === 'shopping' && styles.activeTabText]}>Shopping</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleNotifications}>
          <MaterialIcons name="notifications" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {activeTab === 'taxi' ? renderTaxiContent() : renderShoppingContent()}

      {/* Overlays */}
      {menuVisible && <View style={styles.overlay}>{renderMenu()}</View>}
      {notificationsVisible && <View style={styles.overlay}>{renderNotifications()}</View>}
    </View>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 20,
    padding: 3,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: PRIMARY_GREEN,
  },
  tabText: {
    marginLeft: 5,
    color: PRIMARY_GREEN,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: WHITE,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.4,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapLoadingText: {
    color: '#888',
    fontSize: 16,
  },
  locationInputContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
    marginBottom: 15,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationIcon: {
    width: 30,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  suggestionsContainer: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
    marginBottom: 15,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  rideTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 15,
  },
  rideTypeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedRideType: {
    backgroundColor: PRIMARY_GREEN,
  },
  rideTypeText: {
    marginTop: 5,
    fontSize: 12,
    color: PRIMARY_GREEN,
    fontWeight: 'bold',
  },
  selectedRideTypeText: {
    color: WHITE,
  },
  bookRideButton: {
    backgroundColor: PRIMARY_GREEN,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookRideButtonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  shoppingContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: LIGHT_GRAY,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_GREEN,
    marginTop: 10,
  },
  categoriesScroll: {
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    backgroundColor: WHITE,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#555',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  menuContainer: {
    width: '75%',
    height: '100%',
    backgroundColor: WHITE,
    padding: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profilePhone: {
    fontSize: 14,
    color: '#888',
  },
  walletSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 10,
    marginBottom: 20,
  },
  walletIcon: {
    marginRight: 15,
  },
  walletInfo: {
    flex: 1,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletBalance: {
    fontSize: 14,
    color: PRIMARY_GREEN,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  menuFooter: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  notificationsContainer: {
    width: '75%',
    height: '100%',
    backgroundColor: WHITE,
    padding: 20,
    marginLeft: 'auto',
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  notificationsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
});