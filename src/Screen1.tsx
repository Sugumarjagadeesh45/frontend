// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   Dimensions,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
// import { useNavigation } from '@react-navigation/native';
// import Geolocation from 'react-native-geolocation-service';
// import { Picker } from '@react-native-picker/picker';

// // Constants
// const PRIMARY_GREEN = '#0bc540';
// const LIGHT_GRAY = '#f0f0f0';
// const WHITE = '#ffffff';
// const { width, height } = Dimensions.get('window');

// // Interfaces
// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
// }

// interface Category {
//   id: string;
//   name: string;
// }

// // Mock Data
// const mockProducts: Product[] = [
//   {
//     id: '1',
//     name: 'Smartphone',
//     description: 'Latest model smartphone with great camera',
//     price: 699.99,
//     image: 'https://via.placeholder.com/150',
//   },
//   {
//     id: '2',
//     name: 'Headphones',
//     description: 'Wireless noise-canceling headphones',
//     price: 199.99,
//     image: 'https://via.placeholder.com/150',
//   },
// ];

// const mockCategories: Category[] = [
//   { id: '1', name: 'Electronics' },
//   { id: '2', name: 'Clothing' },
//   { id: '3', name: 'Home' },
//   { id: '4', name: 'Books' },
// ];

// const Screen1 = () => {
//   // Navigation
//   const navigation = useNavigation();

//   // State Management
//   const [activeTab, setActiveTab] = useState('taxi');
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [notificationsVisible, setNotificationsVisible] = useState(false);
//   const [pickup, setPickup] = useState('Current Location');
//   const [dropoff, setDropoff] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [dropoffSuggestions] = useState([
//     { id: '1', name: 'Downtown Mall' },
//     { id: '2', name: 'Central Railway Station' },
//     { id: '3', name: 'City Park' },
//     { id: '4', name: 'Main Hospital' },
//   ]);
//   const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
//   const [selectedRideType, setSelectedRideType] = useState('taxi');

//   // Request location permission
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   // Get current location
//   const getCurrentLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log("My exact location:", { latitude, longitude });
//         setPickup(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
//       },
//       (error) => {
//         console.log("Error getting location:", error);
//         setPickup('Current Location (Unknown)');
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   // Handlers
//   const handleDropoffChange = (text: string) => {
//     setDropoff(text);
//     if (text.length > 2) {
//       const mockSuggestions = [
//         { id: '1', name: `${text} Street` },
//         { id: '2', name: `${text} Mall` },
//         { id: '3', name: `${text} Center` },
//       ];
//       setSuggestions(mockSuggestions);
//       setShowDropoffSuggestions(true);
//     } else {
//       setShowDropoffSuggestions(false);
//     }
//   };

//   const selectSuggestion = (suggestion: { id: string; name: string }) => {
//     setDropoff(suggestion.name);
//     setShowDropoffSuggestions(false);
//   };

//   const toggleMenu = () => {
//     setMenuVisible(!menuVisible);
//     setNotificationsVisible(false);
//   };

//   const toggleNotifications = () => {
//     setNotificationsVisible(!notificationsVisible);
//     setMenuVisible(false);
//   };

//   const getCategoryIcon = (categoryName: string) => {
//     switch (categoryName.toLowerCase()) {
//       case 'electronics':
//         return 'devices';
//       case 'clothing':
//         return 'checkroom';
//       case 'home':
//         return 'home';
//       case 'books':
//         return 'menu-book';
//       default:
//         return 'shopping-cart';
//     }
//   };

//   // Render Functions
//   const renderTaxiContent = () => {
//     return (
//       <View style={styles.contentContainer}>
//         {/* Map placeholder view */}
//         <View style={styles.mapPlaceholder}>
//           <Text style={styles.mapPlaceholderText}>Map View Will Appear Here</Text>
//         </View>

//         <View style={styles.locationContainer}>
//           <View style={styles.locationInput}>
//             <View style={styles.locationIcon}>
//               <MaterialIcons name="my-location" size={20} color={PRIMARY_GREEN} />
//             </View>
//             <TextInput
//               style={styles.input}
//               placeholder="Current Location"
//               value={pickup}
//               editable={false}
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={styles.locationInput}>
//             <View style={styles.locationIcon}>
//               <MaterialIcons name="location-on" size={20} color="#f75555" />
//             </View>
//             <TextInput
//               style={styles.input}
//               placeholder="Where to?"
//               value={dropoff}
//               onChangeText={handleDropoffChange}
//               onFocus={() => dropoff.length > 2 && setShowDropoffSuggestions(true)}
//               placeholderTextColor="#999"
//             />
//           </View>
//         </View>

//         {showDropoffSuggestions && suggestions.length > 0 && (
//           <View style={styles.suggestionsContainer}>
//             {suggestions.map((item: { id: string; name: string }) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={styles.suggestionItem}
//                 onPress={() => selectSuggestion(item)}
//               >
//                 <MaterialIcons name="location-on" size={20} color="#555" style={styles.suggestionIcon} />
//                 <Text style={styles.suggestionText}>{item.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {!showDropoffSuggestions && dropoffSuggestions.length > 0 && (
//           <View style={styles.suggestionsContainer}>
//             <Text style={styles.suggestionsTitle}>Popular nearby locations</Text>
//             {dropoffSuggestions.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={styles.suggestionItem}
//                 onPress={() => selectSuggestion(item)}
//               >
//                 <MaterialIcons name="place" size={20} color={PRIMARY_GREEN} style={styles.suggestionIcon} />
//                 <Text style={styles.suggestionText}>{item.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         <View style={styles.selectContainer}>
//           <Picker
//             selectedValue={selectedRideType}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedRideType(itemValue)}
//           >
//             <Picker.Item label="Book Taxi" value="taxi" />
//             <Picker.Item label="Book E-Vehicle" value="e-vehicle" />
//             <Picker.Item label="Book Port" value="port" />
//           </Picker>
//         </View>

//         <TouchableOpacity style={styles.bookButton}>
//           <Text style={styles.bookButtonText}>Book Ride</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const renderShoppingContent = () => (
//     <ScrollView style={styles.shoppingContainer}>
//       <Text style={styles.sectionTitle}>Featured Products</Text>
      
//       {mockProducts.map((product) => (
//         <View key={product.id} style={styles.productCard}>
//           <View style={styles.productImage}>
//             <MaterialIcons name="image" size={80} color="#ccc" />
//           </View>
//           <View style={styles.productInfo}>
//             <Text style={styles.productName}>{product.name}</Text>
//             <Text style={styles.productDescription}>{product.description}</Text>
//             <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
//           </View>
//         </View>
//       ))}

//       <Text style={styles.sectionTitle}>Categories</Text>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
//         {mockCategories.map((category) => (
//           <TouchableOpacity
//             key={category.id}
//             style={styles.categoryItem}
//           >
//             <View style={styles.categoryIcon}>
//               <MaterialIcons name={getCategoryIcon(category.name)} size={24} color={PRIMARY_GREEN} />
//             </View>
//             <Text style={styles.categoryText}>{category.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </ScrollView>
//   );

//   const renderMenu = () => (
//     <View style={styles.menuContainer}>
//       <View style={styles.menuHeader}>
//         <TouchableOpacity onPress={toggleMenu}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.menuTitle}>Menu</Text>
//       </View>

//       <View style={styles.profileSection}>
//         <View style={styles.profileIcon}>
//           <FontAwesome name="user" size={24} color={PRIMARY_GREEN} />
//         </View>
//         <View style={styles.profileInfo}>
//           <Text style={styles.profileName}>John Doe</Text>
//           <Text style={styles.profilePhone}>+1 234 567 890</Text>
//         </View>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </View>

//       <View style={styles.walletSection}>
//         <View style={styles.walletIcon}>
//           <FontAwesome name="money" size={20} color={PRIMARY_GREEN} />
//         </View>
//         <View style={styles.walletInfo}>
//           <Text style={styles.walletTitle}>Wallet</Text>
//           <Text style={styles.walletBalance}>$50.00</Text>
//         </View>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </View>

//       <View style={styles.menuDivider} />

//       <TouchableOpacity style={styles.menuItem}>
//         <View style={styles.menuIcon}>
//           <MaterialIcons name="payment" size={20} color={PRIMARY_GREEN} />
//         </View>
//         <Text style={styles.menuText}>Payment</Text>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.menuItem}>
//         <View style={styles.menuIcon}>
//           <MaterialIcons name="history" size={20} color={PRIMARY_GREEN} />
//         </View>
//         <Text style={styles.menuText}>My Travel History</Text>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.menuItem}>
//         <View style={styles.menuIcon}>
//           <MaterialIcons name="security" size={20} color={PRIMARY_GREEN} />
//         </View>
//         <Text style={styles.menuText}>Safety</Text>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </TouchableOpacity>

//       <View style={styles.menuDivider} />

//       <View style={styles.menuFooter}>
//         <Text style={styles.footerText}>App Version 1.0.0</Text>
//         <Text style={styles.footerText}>© 2023 TaxiApp Inc.</Text>
//       </View>
//     </View>
//   );

//   const renderNotifications = () => (
//     <View style={styles.notificationsContainer}>
//       <View style={styles.notificationsHeader}>
//         <TouchableOpacity onPress={toggleNotifications}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.notificationsTitle}>Notifications</Text>
//       </View>

//       <ScrollView>
//         <View style={styles.notificationItem}>
//           <View style={styles.notificationIcon}>
//             <MaterialIcons name="local-offer" size={20} color={PRIMARY_GREEN} />
//           </View>
//           <View style={styles.notificationContent}>
//             <Text style={styles.notificationTitle}>Special Offer</Text>
//             <Text style={styles.notificationText}>Get 20% off on your next ride</Text>
//             <Text style={styles.notificationTime}>2 hours ago</Text>
//           </View>
//         </View>

//         <View style={styles.notificationItem}>
//           <View style={styles.notificationIcon}>
//             <MaterialIcons name="directions-car" size={20} color={PRIMARY_GREEN} />
//           </View>
//           <View style={styles.notificationContent}>
//             <Text style={styles.notificationTitle}>Ride Completed</Text>
//             <Text style={styles.notificationText}>Your ride to Downtown has been completed</Text>
//             <Text style={styles.notificationTime}>Yesterday</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={toggleMenu}>
//           <MaterialIcons name="menu" size={24} color="black" />
//         </TouchableOpacity>

//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[styles.tabButton, activeTab === 'taxi' && styles.activeTab]}
//             onPress={() => setActiveTab('taxi')}
//           >
//             <MaterialIcons name="local-taxi" size={20} color={activeTab === 'taxi' ? 'white' : PRIMARY_GREEN} />
//             <Text style={[styles.tabText, activeTab === 'taxi' && styles.activeTabText]}>Taxi</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.tabButton, activeTab === 'shopping' && styles.activeTab]}
//             onPress={() => setActiveTab('shopping')}
//           >
//             <MaterialIcons name="shopping-cart" size={20} color={activeTab === 'shopping' ? 'white' : PRIMARY_GREEN} />
//             <Text style={[styles.tabText, activeTab === 'shopping' && styles.activeTabText]}>Shopping</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={toggleNotifications}>
//           <MaterialIcons name="notifications" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       {activeTab === 'taxi' ? renderTaxiContent() : renderShoppingContent()}

//       {menuVisible && (
//         <View style={styles.overlay}>
//           {renderMenu()}
//         </View>
//       )}

//       {notificationsVisible && (
//         <View style={styles.overlay}>
//           {renderNotifications()}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingTop: 50,
//     height: 102, // Increased to approximately 1.7 inches (102 pixels at 160 dpi)
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 20,
//     padding: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 18,
//   },
//   activeTab: {
//     backgroundColor: PRIMARY_GREEN,
//   },
//   tabText: {
//     marginLeft: 5,
//     color: PRIMARY_GREEN,
//     fontWeight: '500',
//   },
//   activeTabText: {
//     color: 'white',
//   },
//   contentContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   shoppingContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   mapPlaceholder: {
//     height: 200,
//     backgroundColor: LIGHT_GRAY,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   mapPlaceholderText: {
//     color: '#555',
//     fontSize: 16,
//   },
//   locationContainer: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 2,
//   },
//   locationInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   locationIcon: {
//     width: 24,
//     alignItems: 'center',
//   },
//   suggestionsContainer: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     elevation: 2,
//   },
//   suggestionsTitle: {
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#555',
//   },
//   suggestionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionIcon: {
//     marginRight: 10,
//   },
//   suggestionText: {
//     flex: 1,
//   },
//   selectContainer: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 10,
//     marginTop: 15,
//     elevation: 2,
//     marginBottom: 15,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   bookButton: {
//     backgroundColor: PRIMARY_GREEN,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   bookButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   menuContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     width: '80%',
//     backgroundColor: 'white',
//     padding: 15,
//   },
//   menuHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingTop: 16,
//   },
//   menuTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft: 15,
//   },
//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   profileIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#e0f7f2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   profilePhone: {
//     color: '#777',
//     marginTop: 3,
//   },
//   walletSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   walletIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#e0f7f2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   walletInfo: {
//     flex: 1,
//   },
//   walletTitle: {
//     color: '#777',
//   },
//   walletBalance: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginTop: 3,
//   },
//   menuDivider: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 15,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   menuIcon: {
//     width: 30,
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   menuText: {
//     flex: 1,
//     fontSize: 16,
//   },
//   menuFooter: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   footerText: {
//     color: '#777',
//     fontSize: 12,
//     marginBottom: 5,
//   },
//   notificationsContainer: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     bottom: 0,
//     width: '80%',
//     backgroundColor: 'white',
//     padding: 15,
//   },
//   notificationsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingTop: 16,
//   },
//   notificationsTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft: 15,
//   },
//   notificationItem: {
//     flexDirection: 'row',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   notificationIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#e0f7f2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitle: {
//     fontWeight: 'bold',
//   },
//   notificationText: {
//     color: '#555',
//     marginTop: 3,
//   },
//   notificationTime: {
//     color: '#999',
//     fontSize: 12,
//     marginTop: 5,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   productCard: {
//     flexDirection: 'row',
//     backgroundColor: WHITE,
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 2,
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: LIGHT_GRAY,
//     borderRadius: 5,
//     marginRight: 15,
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   productDescription: {
//     color: '#555',
//     marginBottom: 5,
//     fontSize: 14,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: PRIMARY_GREEN,
//   },
//   categoriesScroll: {
//     paddingHorizontal: 10,
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: 15,
//     width: 80,
//   },
//   categoryIcon: {
//     width: 60,
//     height: 60,
//     backgroundColor: LIGHT_GRAY,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   categoryText: {
//     fontSize: 12,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
// });

// export default Screen1;

















































































import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Constants
const PRIMARY_GREEN = '#0bc540';
const LIGHT_GRAY = '#f0f0f0';
const WHITE = '#ffffff';
const { width, height } = Dimensions.get('window');

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

const Screen1 = () => {
  // Navigation
  const navigation = useNavigation();

  // Refs
  const mapRef = useRef<MapView>(null);

  // State Management
  const [activeTab, setActiveTab] = useState('taxi');
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [pickup, setPickup] = useState('Current Location');
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
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Request location permission
  async function requestLocationPermission() {
    try {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        return auth === 'granted';
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs to access your location',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  useEffect(() => {
    let watchId: number | undefined;

    async function initializeLocation() {
      setLoadingLocation(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Location permission is required');
        setPickup('Current Location (Unknown)');
        setLoadingLocation(false);
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          console.log('Current position:', position);
          const { latitude, longitude } = position.coords;
          const newLocation = {
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          
          setCurrentLocation(newLocation);
          setPickup(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setLoadingLocation(false);
          
          // Animate map to current location
          if (mapRef.current) {
            mapRef.current.animateToRegion(newLocation, 1000);
          }
        },
        (error) => {
          console.log("Error getting location:", error);
          setPickup('Current Location (Unknown)');
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      watchId = Geolocation.watchPosition(
        (position) => {
          console.log('Watch position update:', position);
          const { latitude, longitude } = position.coords;
          const newLocation = {
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          setCurrentLocation(newLocation);
        },
        (error) => console.log("Error watching location:", error),
        { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
      );
    }

    initializeLocation();

    return () => {
      if (watchId !== undefined) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Handlers
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

  // Render Functions
  const renderTaxiContent = () => {
    return (
      <View style={styles.contentContainer}>
        {/* Google Map View */}
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={currentLocation}
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={true}
          showsCompass={true}
          zoomEnabled={true}
          zoomControlEnabled={true}
        >
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description="You are here"
          >
            <View style={styles.customMarker}>
              <MaterialIcons name="location-on" size={30} color={PRIMARY_GREEN} />
            </View>
          </Marker>
        </MapView>

        <View style={styles.locationContainer}>
          <View style={styles.locationInput}>
            <View style={styles.locationIcon}>
              <MaterialIcons name="my-location" size={20} color={PRIMARY_GREEN} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Current Location"
              value={pickup}
              editable={false}
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

      {activeTab === 'taxi' ? renderTaxiContent() : renderShoppingContent()}

      {menuVisible && (
        <View style={styles.overlay}>
          {renderMenu()}
        </View>
      )}

      {notificationsVisible && (
        <View style={styles.overlay}>
          {renderNotifications()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 60,
    height: 120,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 18,
  },
  activeTab: {
    backgroundColor: PRIMARY_GREEN,
  },
  tabText: {
    marginLeft: 5,
    color: PRIMARY_GREEN,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  shoppingContainer: {
    flex: 1,
    padding: 15,
  },
  map: {
    height: 300,
    width: '100%',
    borderRadius: 10,
    marginBottom: 15,
  },
  customMarker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    elevation: 5,
  },
  locationContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  locationIcon: {
    width: 24,
    alignItems: 'center',
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  suggestionsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    flex: 1,
  },
  rideTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  rideTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_GREEN,
    backgroundColor: WHITE,
  },
  selectedRideType: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  rideTypeText: {
    marginTop: 5,
    color: PRIMARY_GREEN,
    fontWeight: '500',
  },
  selectedRideTypeText: {
    color: WHITE,
  },
  bookRideButton: {
    backgroundColor: PRIMARY_GREEN,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookRideButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: 'white',
    padding: 15,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0f7f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  profilePhone: {
    color: '#777',
    marginTop: 3,
  },
  walletSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f7f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  walletInfo: {
    flex: 1,
  },
  walletTitle: {
    color: '#777',
  },
  walletBalance: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 3,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#777',
    fontSize: 12,
    marginBottom: 5,
  },
  notificationsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: 'white',
    padding: 15,
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 16,
  },
  notificationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f7f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
  },
  notificationText: {
    color: '#555',
    marginTop: 3,
  },
  notificationTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 5,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    color: '#555',
    marginBottom: 5,
    fontSize: 14,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_GREEN,
  },
  categoriesScroll: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Screen1;









// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   Dimensions,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
// import { useNavigation } from '@react-navigation/native';
// import Geolocation from 'react-native-geolocation-service';

// // Constants
// const PRIMARY_GREEN = '#0bc540';
// const LIGHT_GRAY = '#f0f0f0';
// const WHITE = '#ffffff';
// const { width, height } = Dimensions.get('window');

// // Interfaces
// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
// }

// interface Category {
//   id: string;
//   name: string;
// }

// // Mock Data
// const mockProducts: Product[] = [
//   {
//     id: '1',
//     name: 'Smartphone',
//     description: 'Latest model smartphone with great camera',
//     price: 699.99,
//     image: 'https://via.placeholder.com/150',
//   },
//   {
//     id: '2',
//     name: 'Headphones',
//     description: 'Wireless noise-canceling headphones',
//     price: 199.99,
//     image: 'https://via.placeholder.com/150',
//   },
// ];

// const mockCategories: Category[] = [
//   { id: '1', name: 'Electronics' },
//   { id: '2', name: 'Clothing' },
//   { id: '3', name: 'Home' },
//   { id: '4', name: 'Books' },
// ];

// const Screen1 = () => {
//   // Navigation
//   const navigation = useNavigation();

//   // State Management
//   const [activeTab, setActiveTab] = useState('taxi');
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [notificationsVisible, setNotificationsVisible] = useState(false);
//   const [pickup, setPickup] = useState('Current Location');
//   const [dropoff, setDropoff] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedRideType, setSelectedRideType] = useState('taxi');
//   const [dropoffSuggestions] = useState([
//     { id: '1', name: 'Downtown Mall' },
//     { id: '2', name: 'Central Railway Station' },
//     { id: '3', name: 'City Park' },
//     { id: '4', name: 'Main Hospital' },
//   ]);
//   const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);

//   // Request location permission
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   // Get current location
//   const getCurrentLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log("My exact location:", { latitude, longitude });
//         setPickup(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
//       },
//       (error) => {
//         console.log("Error getting location:", error);
//         setPickup('Current Location (Unknown)');
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   // Handlers
//   const handleDropoffChange = (text: string) => {
//     setDropoff(text);
//     if (text.length > 2) {
//       const mockSuggestions = [
//         { id: '1', name: `${text} Street` },
//         { id: '2', name: `${text} Mall` },
//         { id: '3', name: `${text} Center` },
//       ];
//       setSuggestions(mockSuggestions);
//       setShowDropoffSuggestions(true);
//     } else {
//       setShowDropoffSuggestions(false);
//     }
//   };

//   const selectSuggestion = (suggestion: { id: string; name: string }) => {
//     setDropoff(suggestion.name);
//     setShowDropoffSuggestions(false);
//   };

//   const toggleMenu = () => {
//     setMenuVisible(!menuVisible);
//     setNotificationsVisible(false);
//   };

//   const toggleNotifications = () => {
//     setNotificationsVisible(!notificationsVisible);
//     setMenuVisible(false);
//   };

//   const getCategoryIcon = (categoryName: string) => {
//     switch (categoryName.toLowerCase()) {
//       case 'electronics':
//         return 'devices';
//       case 'clothing':
//         return 'checkroom';
//       case 'home':
//         return 'home';
//       case 'books':
//         return 'menu-book';
//       default:
//         return 'shopping-cart';
//     }
//   };

//   // Render Functions
//   const renderTaxiContent = () => {
//     return (
//       <View style={styles.contentContainer}>
//         {/* Map placeholder view */}
//         <View style={styles.mapPlaceholder}>
//           <Text style={styles.mapPlaceholderText}>Map View Will Appear Here</Text>
//         </View>

//         <View style={styles.locationContainer}>
//           <View style={styles.locationInput}>
//             <View style={styles.locationIcon}>
//               <MaterialIcons name="my-location" size={20} color={PRIMARY_GREEN} />
//             </View>
//             <TextInput
//               style={styles.input}
//               placeholder="Current Location"
//               value={pickup}
//               editable={false}
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={styles.locationInput}>
//             <View style={styles.locationIcon}>
//               <MaterialIcons name="location-on" size={20} color="#f75555" />
//             </View>
//             <TextInput
//               style={styles.input}
//               placeholder="Where to?"
//               value={dropoff}
//               onChangeText={handleDropoffChange}
//               onFocus={() => dropoff.length > 2 && setShowDropoffSuggestions(true)}
//               placeholderTextColor="#999"
//             />
//           </View>
//         </View>

//         {showDropoffSuggestions && suggestions.length > 0 && (
//           <View style={styles.suggestionsContainer}>
//             {suggestions.map((item: { id: string; name: string }) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={styles.suggestionItem}
//                 onPress={() => selectSuggestion(item)}
//               >
//                 <MaterialIcons name="location-on" size={20} color="#555" style={styles.suggestionIcon} />
//                 <Text style={styles.suggestionText}>{item.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {!showDropoffSuggestions && dropoffSuggestions.length > 0 && (
//           <View style={styles.suggestionsContainer}>
//             <Text style={styles.suggestionsTitle}>Popular nearby locations</Text>
//             {dropoffSuggestions.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={styles.suggestionItem}
//                 onPress={() => selectSuggestion(item)}
//               >
//                 <MaterialIcons name="place" size={20} color={PRIMARY_GREEN} style={styles.suggestionIcon} />
//                 <Text style={styles.suggestionText}>{item.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Ride type selector */}
//         <View style={styles.rideTypeContainer}>
//           <TouchableOpacity 
//             style={[styles.rideTypeButton, selectedRideType === 'taxi' && styles.selectedRideType]}
//             onPress={() => setSelectedRideType('taxi')}
//           >
//             <MaterialIcons name="local-taxi" size={24} color={selectedRideType === 'taxi' ? WHITE : PRIMARY_GREEN} />
//             <Text style={[styles.rideTypeText, selectedRideType === 'taxi' && styles.selectedRideTypeText]}>Book Taxi</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.rideTypeButton, selectedRideType === 'evehicle' && styles.selectedRideType]}
//             onPress={() => setSelectedRideType('evehicle')}
//           >
//             <MaterialIcons name="electric-car" size={24} color={selectedRideType === 'evehicle' ? WHITE : PRIMARY_GREEN} />
//             <Text style={[styles.rideTypeText, selectedRideType === 'evehicle' && styles.selectedRideTypeText]}>E-Vehicle</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.rideTypeButton, selectedRideType === 'port' && styles.selectedRideType]}
//             onPress={() => setSelectedRideType('port')}
//           >
//             <MaterialIcons name="local-shipping" size={24} color={selectedRideType === 'port' ? WHITE : PRIMARY_GREEN} />
//             <Text style={[styles.rideTypeText, selectedRideType === 'port' && styles.selectedRideTypeText]}>Book Port</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={styles.bookRideButton}>
//           <Text style={styles.bookRideButtonText}>BOOK RIDE</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const renderShoppingContent = () => (
//     <ScrollView style={styles.shoppingContainer}>
//       <Text style={styles.sectionTitle}>Featured Products</Text>
      
//       {mockProducts.map((product) => (
//         <View key={product.id} style={styles.productCard}>
//           <View style={styles.productImage}>
//             <MaterialIcons name="image" size={80} color="#ccc" />
//           </View>
//           <View style={styles.productInfo}>
//             <Text style={styles.productName}>{product.name}</Text>
//             <Text style={styles.productDescription}>{product.description}</Text>
//             <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
//           </View>
//         </View>
//       ))}

//       <Text style={styles.sectionTitle}>Categories</Text>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
//         {mockCategories.map((category) => (
//           <TouchableOpacity
//             key={category.id}
//             style={styles.categoryItem}
//           >
//             <View style={styles.categoryIcon}>
//               <MaterialIcons name={getCategoryIcon(category.name)} size={24} color={PRIMARY_GREEN} />
//             </View>
//             <Text style={styles.categoryText}>{category.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </ScrollView>
//   );

//   const renderMenu = () => (
//     <View style={styles.menuContainer}>
//       <View style={styles.menuHeader}>
//         <TouchableOpacity onPress={toggleMenu}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.menuTitle}>Menu</Text>
//       </View>

//       <View style={styles.profileSection}>
//         <View style={styles.profileIcon}>
//           <FontAwesome name="user" size={24} color={PRIMARY_GREEN} />
//         </View>
//         <View style={styles.profileInfo}>
//           <Text style={styles.profileName}>John Doe</Text>
//           <Text style={styles.profilePhone}>+1 234 567 890</Text>
//         </View>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </View>

//       <View style={styles.walletSection}>
//         <View style={styles.walletIcon}>
//           <FontAwesome name="money" size={20} color={PRIMARY_GREEN} />
//         </View>
//         <View style={styles.walletInfo}>
//           <Text style={styles.walletTitle}>Wallet</Text>
//           <Text style={styles.walletBalance}>$50.00</Text>
//         </View>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </View>

//       <View style={styles.menuDivider} />

//       <TouchableOpacity style={styles.menuItem}>
//         <View style={styles.menuIcon}>
//           <MaterialIcons name="payment" size={20} color={PRIMARY_GREEN} />
//         </View>
//         <Text style={styles.menuText}>Payment</Text>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.menuItem}>
//         <View style={styles.menuIcon}>
//           <MaterialIcons name="history" size={20} color={PRIMARY_GREEN} />
//         </View>
//         <Text style={styles.menuText}>My Travel History</Text>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.menuItem}>
//         <View style={styles.menuIcon}>
//           <MaterialIcons name="security" size={20} color={PRIMARY_GREEN} />
//         </View>
//         <Text style={styles.menuText}>Safety</Text>
//         <Feather name="chevron-right" size={20} color="gray" />
//       </TouchableOpacity>

//       <View style={styles.menuDivider} />

//       <View style={styles.menuFooter}>
//         <Text style={styles.footerText}>App Version 1.0.0</Text>
//         <Text style={styles.footerText}>© 2023 TaxiApp Inc.</Text>
//       </View>
//     </View>
//   );

//   const renderNotifications = () => (
//     <View style={styles.notificationsContainer}>
//       <View style={styles.notificationsHeader}>
//         <TouchableOpacity onPress={toggleNotifications}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.notificationsTitle}>Notifications</Text>
//       </View>

//       <ScrollView>
//         <View style={styles.notificationItem}>
//           <View style={styles.notificationIcon}>
//             <MaterialIcons name="local-offer" size={20} color={PRIMARY_GREEN} />
//           </View>
//           <View style={styles.notificationContent}>
//             <Text style={styles.notificationTitle}>Special Offer</Text>
//             <Text style={styles.notificationText}>Get 20% off on your next ride</Text>
//             <Text style={styles.notificationTime}>2 hours ago</Text>
//           </View>
//         </View>

//         <View style={styles.notificationItem}>
//           <View style={styles.notificationIcon}>
//             <MaterialIcons name="directions-car" size={20} color={PRIMARY_GREEN} />
//           </View>
//           <View style={styles.notificationContent}>
//             <Text style={styles.notificationTitle}>Ride Completed</Text>
//             <Text style={styles.notificationText}>Your ride to Downtown has been completed</Text>
//             <Text style={styles.notificationTime}>Yesterday</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={toggleMenu}>
//           <MaterialIcons name="menu" size={24} color="black" />
//         </TouchableOpacity>

//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[styles.tabButton, activeTab === 'taxi' && styles.activeTab]}
//             onPress={() => setActiveTab('taxi')}
//           >
//             <MaterialIcons name="local-taxi" size={20} color={activeTab === 'taxi' ? 'white' : PRIMARY_GREEN} />
//             <Text style={[styles.tabText, activeTab === 'taxi' && styles.activeTabText]}>Taxi</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.tabButton, activeTab === 'shopping' && styles.activeTab]}
//             onPress={() => setActiveTab('shopping')}
//           >
//             <MaterialIcons name="shopping-cart" size={20} color={activeTab === 'shopping' ? 'white' : PRIMARY_GREEN} />
//             <Text style={[styles.tabText, activeTab === 'shopping' && styles.activeTabText]}>Shopping</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={toggleNotifications}>
//           <MaterialIcons name="notifications" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       {activeTab === 'taxi' ? renderTaxiContent() : renderShoppingContent()}

//       {menuVisible && (
//         <View style={styles.overlay}>
//           {renderMenu()}
//         </View>
//       )}

//       {notificationsVisible && (
//         <View style={styles.overlay}>
//           {renderNotifications()}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingTop: 60,  // Increased paddingTop
//     height: 120,     // Increased height to ~1.7 inches (assuming ~160dpi)
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 20,
//     padding: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 18,
//   },
//   activeTab: {
//     backgroundColor: PRIMARY_GREEN,
//   },
//   tabText: {
//     marginLeft: 5,
//     color: PRIMARY_GREEN,
//     fontWeight: '500',
//   },
//   activeTabText: {
//     color: 'white',
//   },
//   contentContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   shoppingContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   mapPlaceholder: {
//     height: 200,
//     backgroundColor: LIGHT_GRAY,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   mapPlaceholderText: {
//     color: '#555',
//     fontSize: 16,
//   },
//   locationContainer: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 2,
//   },
//   locationInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   locationIcon: {
//     width: 24,
//     alignItems: 'center',
//   },
//   suggestionsContainer: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     elevation: 2,
//   },
//   suggestionsTitle: {
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#555',
//   },
//   suggestionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionIcon: {
//     marginRight: 10,
//   },
//   suggestionText: {
//     flex: 1,
//   },
//   rideTypeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 15,
//     marginBottom: 15,
//   },
//   rideTypeButton: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 12,
//     marginHorizontal: 5,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: PRIMARY_GREEN,
//     backgroundColor: WHITE,
//   },
//   selectedRideType: {
//     backgroundColor: PRIMARY_GREEN,
//     borderColor: PRIMARY_GREEN,
//   },
//   rideTypeText: {
//     marginTop: 5,
//     color: PRIMARY_GREEN,
//     fontWeight: '500',
//   },
//   selectedRideTypeText: {
//     color: WHITE,
//   },
//   bookRideButton: {
//     backgroundColor: PRIMARY_GREEN,
//     padding: 18,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   bookRideButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   menuContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     width: '80%',
//     backgroundColor: 'white',
//     padding: 15,
//   },
//   menuHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingTop: 16,
//   },
//   menuTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft: 15,
//   },
//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   profileIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#e0f7f2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   profilePhone: {
//     color: '#777',
//     marginTop: 3,
//   },
//   walletSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   walletIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#e0f7f2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   walletInfo: {
//     flex: 1,
//   },
//   walletTitle: {
//     color: '#777',
//   },
//   walletBalance: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginTop: 3,
//   },
//   menuDivider: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 15,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   menuIcon: {
//     width: 30,
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   menuText: {
//     flex: 1,
//     fontSize: 16,
//   },
//   menuFooter: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   footerText: {
//     color: '#777',
//     fontSize: 12,
//     marginBottom: 5,
//   },
//   notificationsContainer: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     bottom: 0,
//     width: '80%',
//     backgroundColor: 'white',
//     padding: 15,
//   },
//   notificationsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingTop: 16,
//   },
//   notificationsTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft: 15,
//   },
//   notificationItem: {
//     flexDirection: 'row',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   notificationIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#e0f7f2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitle: {
//     fontWeight: 'bold',
//   },
//   notificationText: {
//     color: '#555',
//     marginTop: 3,
//   },
//   notificationTime: {
//     color: '#999',
//     fontSize: 12,
//     marginTop: 5,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   productCard: {
//     flexDirection: 'row',
//     backgroundColor: WHITE,
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 2,
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: LIGHT_GRAY,
//     borderRadius: 5,
//     marginRight: 15,
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   productDescription: {
//     color: '#555',
//     marginBottom: 5,
//     fontSize: 14,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: PRIMARY_GREEN,
//   },
//   categoriesScroll: {
//     paddingHorizontal: 10,
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: 15,
//     width: 80,
//   },
//   categoryIcon: {
//     width: 60,
//     height: 60,
//     backgroundColor: LIGHT_GRAY,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   categoryText: {
//     fontSize: 12,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
// });

// export default Screen1;