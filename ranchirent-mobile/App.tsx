import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Linking, Modal, ScrollView, Dimensions, TextInput, Alert, ActivityIndicator, RefreshControl, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Property {
    id: number;
    location: string;
    rent: number;
    deposit: number;
    type: string;
    furnishing: string;
    tenantPref: string;
    amenities: string;
    image: string;
}

const FullscreenImageItem = ({ uri }: { uri: string }) => {
    const [loading, setLoading] = useState(true);
    return (
        <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            {loading && <ActivityIndicator size="large" color="#ffffff" style={{ position: 'absolute' }} />}
            <Image
                source={{ uri: uri.trim() }}
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'contain' }}
                onLoadEnd={() => setLoading(false)}
            />
        </View>
    );
};

// Shared Data - Defined before components to ensure availability
// Shared Data - Defined before components to ensure availability
const localities = [
    'Lalpur', 'Ratu Road', 'Doranda', 'Harmu', 'Kanke', 'Bariatu', 'Morabadi',
    'Hinoo', 'Kokar', 'Main Road', 'Namkum', 'Tupudana', 'BIT More', 'Daladali', 'Boreya'
].sort();

// Home Screen Component
function HomeScreen() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fullscreenVisible, setFullscreenVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);


    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedFurnishing, setSelectedFurnishing] = useState<string | null>(null);

    // Booking form states
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [bookingName, setBookingName] = useState('');
    const [bookingPhone, setBookingPhone] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                full: d.toLocaleDateString('en-GB') // DD/MM/YYYY
            });
        }
        return dates;
    };

    // Derive unique locations from loaded properties AND merge with master list
    const availableLocations = Array.from(new Set([
        ...localities,
        ...properties.map(p => p.location)
    ])).filter(Boolean).sort();


    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://script.google.com/macros/s/AKfycbykc3VpXhn8FDcRFWYcbmEW9QINOyYwuIcoP9ILTDZS8gZY8u8DP4oj69TdGIp9lzJ4/exec');
            const data = await response.json();
            setProperties(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProperties();
        setRefreshing(false);
    };

    const filterProperties = () => {
        let filtered = [...properties];

        // Text search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.location.toLowerCase().includes(query) ||
                p.type.toLowerCase().includes(query)
            );
        }

        // Type filter
        if (selectedType) {
            filtered = filtered.filter(p => p.type === selectedType);
        }

        // Location Chip Filter
        if (selectedLocation) {
            filtered = filtered.filter(p => p.location.includes(selectedLocation));
        }

        // Furnishing filter
        if (selectedFurnishing) {
            filtered = filtered.filter(p => p.furnishing === selectedFurnishing);
        }

        setFilteredProperties(filtered);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedType(null);
        setSelectedLocation(null);
        setSelectedFurnishing(null);
    };

    const openWhatsApp = (property: Property) => {
        const message = `Hi! I'm interested in the ${property.type} in ${property.location}`;
        const url = `https://wa.me/917557777987?text=${encodeURIComponent(message)}`;
        Linking.openURL(url);
    };

    const openBookingForm = (property: Property) => {
        setSelectedProperty(property);
        setBookingModalVisible(true);
        setBookingStatus('idle');
        setBookingName('');
        setBookingPhone('');
        setBookingDate('');
        setShowDatePicker(false);
    };

    const submitBooking = async () => {
        if (!bookingName || !bookingPhone || !bookingDate) {
            Alert.alert('Missing Information', 'Please fill in all fields');
            return;
        }

        if (!selectedProperty) return;

        setBookingStatus('loading');

        const formData = {
            Type: 'Tenant',
            Name: bookingName,
            Phone: bookingPhone,
            Location: selectedProperty.location,
            Details: `Booking for: ${selectedProperty.type} (ID: ${selectedProperty.id}) on ${bookingDate}`,
            Status: 'New'
        };

        try {
            await fetch('https://script.google.com/macros/s/AKfycbxhU5xYa1CVrQWJ49VBEsXhSuk_fcUD6Mo1hzm4IgTnaAiTvuYi1xkOx0plDtS9SEGO/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            setBookingStatus('success');
        } catch (error) {
            console.error('Booking error:', error);
            Alert.alert('Error', 'Failed to submit booking. Please try again.');
            setBookingStatus('idle');
        }
    };

    const handleWhatsAppAfterBooking = () => {
        if (!selectedProperty) return;
        const message = `Hello, I submitted a booking request for *${selectedProperty.type}* (ID: ${selectedProperty.id}).\n\n*Name:* ${bookingName}\n*Phone:* ${bookingPhone}\n*Date:* ${bookingDate}`;
        const url = `https://wa.me/917557777987?text=${encodeURIComponent(message)}`;
        Linking.openURL(url);
        setBookingModalVisible(false);
    };

    const openPropertyDetails = (property: Property) => {
        setSelectedProperty(property);
        setCurrentImageIndex(0);
        setModalVisible(true);
    };

    const handleImagePress = (index: number) => {
        setCurrentImageIndex(index);
        setFullscreenVisible(true);
    };

    const closeFullscreen = () => {
        setFullscreenVisible(false);
    };

    const scrollToIndex = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setCurrentImageIndex(index);
    };

    const closeModal = () => {
        setModalVisible(false);
        setBookingModalVisible(false); // Reset booking form
        setSelectedProperty(null);
        setCurrentImageIndex(0);
        setFullscreenVisible(false);
    };

    // Run effects here (after functions are defined)
    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        filterProperties();
    }, [properties, searchQuery, selectedType, selectedFurnishing, selectedLocation]);

    const roomTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK'];
    const furnishingTypes = ['Unfurnished', 'Semi-Furnished', 'Full Furnished'];

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>RanchiRent</Text>
                    <Text style={styles.headerSubtitle}>Find Your Perfect Room</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7C3AED" />
                    <Text style={styles.loadingText}>Loading properties...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ranchi Rent</Text>
                <Text style={styles.headerSubtitle}>Find Your Perfect Room</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by location or type..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Filter Rows */}
                <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Browse by Area</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRowScroll}>
                        {availableLocations.map(loc => (
                            <TouchableOpacity
                                key={loc}
                                style={[styles.filterChip, selectedLocation === loc && styles.filterChipActive]}
                                onPress={() => setSelectedLocation(selectedLocation === loc ? null : loc)}
                            >
                                <Text style={[styles.filterChipText, selectedLocation === loc && styles.filterChipTextActive]}>
                                    {loc}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.filterSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRowScroll}>
                        {/* Room Type Filters */}
                        {roomTypes.map(type => (
                            <TouchableOpacity
                                key={type}
                                style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
                                onPress={() => setSelectedType(selectedType === type ? null : type)}
                            >
                                <Text style={[styles.filterChipText, selectedType === type && styles.filterChipTextActive]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Furnishing Filters */}
                        {furnishingTypes.map(furn => (
                            <TouchableOpacity
                                key={furn}
                                style={[styles.filterChip, selectedFurnishing === furn && styles.filterChipActive]}
                                onPress={() => setSelectedFurnishing(selectedFurnishing === furn ? null : furn)}
                            >
                                <Text style={[styles.filterChipText, selectedFurnishing === furn && styles.filterChipTextActive]}>
                                    {furn}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Clear Filters */}
                        {(searchQuery || selectedType || selectedFurnishing) && (
                            <TouchableOpacity style={styles.clearFilterChip} onPress={clearFilters}>
                                <Text style={styles.clearFilterText}>✕ Clear</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>
            </View>

            <FlatList
                data={filteredProperties}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const imageUrl = item.image ? item.image.split(',')[0] : '';

                    return (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => openPropertyDetails(item)}
                            activeOpacity={0.7}
                        >
                            {imageUrl ? (
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            ) : null}

                            <View style={styles.cardContent}>
                                <View style={styles.typeRow}>
                                    <Text style={styles.typeBadge}>{item.type}</Text>
                                    <Text style={styles.furnishing}>{item.furnishing}</Text>
                                </View>

                                <Text style={styles.location}>📍 {item.location}</Text>

                                <View style={styles.priceRow}>
                                    <View>
                                        <Text style={styles.price}>₹{item.rent.toLocaleString()}</Text>
                                        <Text style={styles.priceLabel}>per month</Text>
                                    </View>
                                </View>

                                <Text style={styles.tapToView}>Tap to view details →</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#7C3AED']}
                        tintColor="#7C3AED"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No properties found</Text>
                        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                            <Text style={styles.clearButtonText}>Clear Filters</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Property Details Modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                {selectedProperty && (
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            {/* Swipeable Image Gallery */}
                            {selectedProperty.image && (() => {
                                const images = selectedProperty.image.split(',').map(img => img.trim());

                                return (
                                    <View style={styles.imageGalleryContainer}>
                                        <ScrollView
                                            horizontal
                                            pagingEnabled
                                            showsHorizontalScrollIndicator={false}
                                            onScroll={(event) => {
                                                const slideSize = event.nativeEvent.layoutMeasurement.width;
                                                const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
                                                setCurrentImageIndex(index);
                                            }}
                                            scrollEventThrottle={16}
                                        >
                                            {images.map((img, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    activeOpacity={0.9}
                                                    onPress={() => handleImagePress(index)}
                                                >
                                                    <Image
                                                        source={{ uri: img }}
                                                        style={styles.detailImage}
                                                        resizeMode="contain"
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>

                                        {/* Page Dots Indicator */}
                                        {images.length > 1 && (
                                            <View style={styles.dotsContainer}>
                                                {images.map((_, index) => (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            styles.dot,
                                                            currentImageIndex === index && styles.activeDot
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                        )}

                                        {/* Image Counter */}
                                        <View style={styles.imageCounter}>
                                            <Text style={styles.imageCounterText}>
                                                {currentImageIndex + 1} / {images.length}
                                            </Text>
                                        </View>

                                        {/* Tap to Expand Hint */}
                                        <View style={styles.expandHint}>
                                            <Text style={styles.expandHintText}>🔍 Tap image to view fullscreen</Text>
                                        </View>
                                    </View>
                                );
                            })()}

                            <View style={styles.detailContent}>
                                {/* Close Button */}
                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Text style={styles.closeButtonText}>✕ Close</Text>
                                </TouchableOpacity>

                                {/* Property Type */}
                                <View style={styles.detailTypeRow}>
                                    <Text style={styles.detailTypeBadge}>{selectedProperty.type}</Text>
                                    <Text style={styles.detailFurnishing}>{selectedProperty.furnishing}</Text>
                                </View>

                                {/* Location */}
                                <Text style={styles.detailLocation}>📍 {selectedProperty.location}</Text>

                                {/* Price Section */}
                                <View style={styles.detailPriceSection}>
                                    <View style={styles.detailPriceBox}>
                                        <Text style={styles.detailPriceLabel}>Monthly Rent</Text>
                                        <Text style={styles.detailPrice}>₹{selectedProperty.rent.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.detailPriceBox}>
                                        <Text style={styles.detailPriceLabel}>Deposit</Text>
                                        <Text style={styles.detailPrice}>₹{selectedProperty.deposit.toLocaleString()}</Text>
                                    </View>
                                </View>

                                {/* Amenities */}
                                {selectedProperty.amenities && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>✨ Amenities</Text>
                                        <Text style={styles.detailSectionText}>{selectedProperty.amenities}</Text>
                                    </View>
                                )}

                                {/* Tenant Preference */}
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailSectionTitle}>👥 Suitable For</Text>
                                    <Text style={styles.detailSectionText}>{selectedProperty.tenantPref}</Text>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={styles.bookButton}
                                        onPress={() => {
                                            openBookingForm(selectedProperty);
                                        }}
                                    >
                                        <Text style={styles.bookButtonText}>📅 Book Visit</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.detailWhatsappButton}
                                        onPress={() => {
                                            openWhatsApp(selectedProperty);
                                        }}
                                    >
                                        <Text style={styles.detailButtonText}>💬 WhatsApp</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Fullscreen Swipeable Gallery */}
                        {fullscreenVisible && selectedProperty?.image && (
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', zIndex: 50 }}>
                                <FlatList
                                    ref={flatListRef}
                                    data={selectedProperty.image.split(',').map(i => i.trim())}
                                    keyExtractor={(_, index) => index.toString()}
                                    horizontal
                                    pagingEnabled
                                    initialScrollIndex={currentImageIndex}
                                    onScrollToIndexFailed={info => {
                                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                                        wait.then(() => {
                                            flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
                                        });
                                    }}
                                    getItemLayout={(_, index) => ({
                                        length: SCREEN_WIDTH,
                                        offset: SCREEN_WIDTH * index,
                                        index,
                                    })}
                                    renderItem={({ item }) => <FullscreenImageItem uri={item} />}
                                    onMomentumScrollEnd={(ev) => {
                                        const newIndex = Math.round(ev.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                                        setCurrentImageIndex(newIndex);
                                    }}
                                />

                                {/* Left Arrow */}
                                {currentImageIndex > 0 && (
                                    <TouchableOpacity
                                        style={styles.navArrowLeft}
                                        onPress={() => scrollToIndex(currentImageIndex - 1)}
                                    >
                                        <Text style={styles.navArrowText}>‹</Text>
                                    </TouchableOpacity>
                                )}

                                {/* Right Arrow */}
                                {currentImageIndex < selectedProperty.image.split(',').length - 1 && (
                                    <TouchableOpacity
                                        style={styles.navArrowRight}
                                        onPress={() => scrollToIndex(currentImageIndex + 1)}
                                    >
                                        <Text style={styles.navArrowText}>›</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={styles.fullscreenCloseButton}
                                    onPress={closeFullscreen}
                                >
                                    <Text style={styles.fullscreenCloseText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
                {/* Booking Form Overlay (Moved Inside) */}
                {bookingModalVisible && (
                    <KeyboardAvoidingView
                        style={[styles.bookingModalOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }]}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={styles.bookingModalContainer}>
                            {bookingStatus === 'success' ? (
                                <View style={styles.bookingSuccessContainer}>
                                    <View style={styles.successIcon}>
                                        <Text style={styles.successIconText}>✓</Text>
                                    </View>
                                    <Text style={styles.successTitle}>Request Sent!</Text>
                                    <Text style={styles.successMessage}>
                                        Ref ID: #{selectedProperty?.id}
                                    </Text>
                                    <Text style={styles.successMessage}>
                                        We have received your details. Our team will call you shortly to confirm the time.
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.whatsappSuccessButton}
                                        onPress={handleWhatsAppAfterBooking}
                                    >
                                        <Text style={styles.whatsappSuccessButtonText}>Message on WhatsApp (Faster)</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.closeSuccessButton}
                                        onPress={() => setBookingModalVisible(false)}
                                    >
                                        <Text style={styles.closeSuccessButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : showDatePicker ? (
                                <View style={styles.dateSelectionContainer}>
                                    <Text style={styles.dateSelectionTitle}>Select a Date</Text>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {generateDates().map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.dateOption}
                                                onPress={() => {
                                                    setBookingDate(item.full);
                                                    setShowDatePicker(false);
                                                }}
                                            >
                                                <Text style={styles.dateOptionDay}>{item.day}</Text>
                                                <Text style={styles.dateOptionDate}>{item.date}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                    <TouchableOpacity style={styles.closeDateButton} onPress={() => setShowDatePicker(false)}>
                                        <Text style={styles.closeDateButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.bookingHeader}>
                                        <Text style={styles.bookingTitle}>Book a Visit</Text>
                                        <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                                            <Text style={styles.bookingCloseButton}>✕</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView style={styles.bookingForm} keyboardShouldPersistTaps="handled">
                                        <View style={styles.formGroup}>
                                            <Text style={styles.formLabel}>Your Name</Text>
                                            <TextInput
                                                style={styles.formInput}
                                                placeholder="Enter your full name"
                                                value={bookingName}
                                                onChangeText={setBookingName}
                                                placeholderTextColor="#999"
                                            />
                                        </View>

                                        <View style={styles.formGroup}>
                                            <Text style={styles.formLabel}>Phone Number</Text>
                                            <TextInput
                                                style={styles.formInput}
                                                placeholder="Enter your mobile number"
                                                value={bookingPhone}
                                                onChangeText={setBookingPhone}
                                                keyboardType="phone-pad"
                                                placeholderTextColor="#999"
                                            />
                                        </View>

                                        <View style={styles.formGroup}>
                                            <Text style={styles.formLabel}>Preferred Date</Text>
                                            <TouchableOpacity
                                                style={styles.dateSelector}
                                                onPress={() => {
                                                    Keyboard.dismiss();
                                                    setShowDatePicker(true);
                                                }}
                                            >
                                                <Text style={[styles.dateSelectorText, !bookingDate && { color: '#999' }]}>
                                                    {bookingDate || 'Select a Date'}
                                                </Text>
                                                <Text style={styles.dateSelectorIcon}>📅</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity
                                            style={[styles.submitButton, bookingStatus === 'loading' && styles.submitButtonDisabled]}
                                            onPress={submitBooking}
                                            disabled={bookingStatus === 'loading'}
                                        >
                                            {bookingStatus === 'loading' ? (
                                                <ActivityIndicator color="#fff" />
                                            ) : (
                                                <Text style={styles.submitButtonText}>Confirm Booking</Text>
                                            )}
                                        </TouchableOpacity>

                                        <Text style={styles.formHint}>
                                            We will confirm via call/WhatsApp shortly.
                                        </Text>
                                    </ScrollView>
                                </>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                )}
            </Modal>





        </View>
    );
}

// Landlord Form Screen Component
function LandlordScreen() {
    const [formData, setFormData] = useState({
        owner: '',
        phone: '',
        address: '',
        location: '',
        rent: '',
        deposit: '',
        type: '',
        furnishing: '',
        tenantPref: [] as string[],
        amenities: [] as string[],
    });

    const [images, setImages] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');


    const roomTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', 'Independent House'];
    const furnishingTypes = ['Unfurnished', 'Semi-Furnished', 'Full Furnished'];
    const tenantPrefs = ['Any', 'Family', 'Bachelors (Men)', 'Bachelors (Women)', 'Students'];
    const amenitiesList = ['Parking', 'Lift', 'Power Backup', 'WiFi', 'Security', 'Western Toilet'];

    const pickImage = async () => {
        if (images.length >= 5) {
            Alert.alert('Limit Reached', 'Maximum 5 images allowed');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            // Correctly handle assets which might be undefined in some cases in types but present in runtime
            const newAssets = result.assets || [];
            const newImages = newAssets.map(asset => asset.uri);
            // Enforce limit locally
            const remainingSlots = 5 - images.length;
            const imagesToAdd = newImages.slice(0, remainingSlots);
            setImages([...images, ...imagesToAdd]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const toggleSelection = (field: 'tenantPref' | 'amenities', item: string) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(item)) {
                return { ...prev, [field]: list.filter(i => i !== item) };
            }
            return { ...prev, [field]: [...list, item] };
        });
    };

    const uploadToImgBB = async (uri: string) => {
        const formData = new FormData();
        const filename = uri.split('/').pop() || 'image.jpg';

        formData.append('image', {
            uri,
            type: 'image/jpeg',
            name: filename,
        } as any);

        const response = await fetch('https://api.imgbb.com/1/upload?key=639af8c66e1d22558be5338e60d150f5', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) return data.data.url;
        throw new Error('Image upload failed');
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.owner || !formData.phone || !formData.location || !formData.type || !formData.rent) {
            Alert.alert('Missing Information', 'Please fill in all required fields');
            return;
        }

        if (images.length === 0) {
            Alert.alert('No Images', 'Please add at least one property image');
            return;
        }

        setStatus('submitting');

        try {
            // Upload images
            const imageUrls = await Promise.all(images.map(uploadToImgBB));

            // Submit to API
            const payload = {
                owner: formData.owner,
                phone: formData.phone,
                address: formData.address,
                location: formData.location,
                rent: formData.rent,
                deposit: formData.deposit,
                type: formData.type,
                furnishing: formData.furnishing,
                tenantPref: formData.tenantPref.join(', '),
                amenities: formData.amenities.join(', '),
                images: imageUrls,
            };

            await fetch('https://script.google.com/macros/s/AKfycbykc3VpXhn8FDcRFWYcbmEW9QINOyYwuIcoP9ILTDZS8gZY8u8DP4oj69TdGIp9lzJ4/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            setStatus('success');

            // Reset form
            setFormData({
                owner: '', phone: '', address: '', location: '', rent: '', deposit: '',
                type: '', furnishing: '', tenantPref: [], amenities: []
            });
            setImages([]);

        } catch (error) {
            console.error('Submission error:', error);
            Alert.alert('Error', 'Failed to submit listing. Please try again.');
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <View style={styles.container}>
                <View style={styles.successContainer}>
                    <View style={styles.successIconLarge}>
                        <Text style={styles.successIconTextLarge}>✓</Text>
                    </View>
                    <Text style={styles.successTitleLarge}>Property Listed!</Text>
                    <Text style={styles.successMessageLarge}>
                        Your property has been submitted. It will be live after a quick verification call.
                    </Text>
                    <TouchableOpacity
                        style={styles.listAnotherButton}
                        onPress={() => setStatus('idle')}
                    >
                        <Text style={styles.listAnotherButtonText}>List Another Property</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.landlordHeader}>
                <Text style={styles.landlordTitle}>List Your Property</Text>
                <Text style={styles.landlordSubtitle}>Free Listing. Verified Tenants.</Text>
            </View>

            <View style={styles.landlordForm}>
                {/* Owner Details */}
                <Text style={styles.sectionTitle}>Owner Details</Text>
                <View style={styles.formRow}>
                    <View style={styles.formHalf}>
                        <Text style={styles.formLabel}>Name *</Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder="Your Name"
                            value={formData.owner}
                            onChangeText={(text) => setFormData({ ...formData, owner: text })}
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.formHalf}>
                        <Text style={styles.formLabel}>Phone *</Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder="Mobile Number"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            keyboardType="phone-pad"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                {/* Location */}
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Locality *</Text>
                    <View style={styles.pickerContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {localities.map(loc => (
                                <TouchableOpacity
                                    key={loc}
                                    style={[styles.optionChip, formData.location === loc && styles.optionChipSelected]}
                                    onPress={() => setFormData({ ...formData, location: loc })}
                                >
                                    <Text style={[styles.optionChipText, formData.location === loc && styles.optionChipTextSelected]}>
                                        {loc}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Address / Landmark</Text>
                    <TextInput
                        style={styles.formInput}
                        placeholder="e.g. Near Nucleus Mall"
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Property Details */}
                <Text style={styles.sectionTitle}>Property Details</Text>
                <View style={styles.formRow}>
                    <View style={styles.formHalf}>
                        <Text style={styles.formLabel}>Type *</Text>
                        <View style={styles.pickerContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {roomTypes.map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[styles.optionChip, formData.type === type && styles.optionChipSelected]}
                                        onPress={() => setFormData({ ...formData, type })}
                                    >
                                        <Text style={[styles.optionChipText, formData.type === type && styles.optionChipTextSelected]}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Furnishing</Text>
                    <View style={styles.pickerContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {furnishingTypes.map(furn => (
                                <TouchableOpacity
                                    key={furn}
                                    style={[styles.optionChip, formData.furnishing === furn && styles.optionChipSelected]}
                                    onPress={() => setFormData({ ...formData, furnishing: furn })}
                                >
                                    <Text style={[styles.optionChipText, formData.furnishing === furn && styles.optionChipTextSelected]}>
                                        {furn}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.formRow}>
                    <View style={styles.formHalf}>
                        <Text style={styles.formLabel}>Rent (₹) *</Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder="Monthly Rent"
                            value={formData.rent}
                            onChangeText={(text) => setFormData({ ...formData, rent: text })}
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.formHalf}>
                        <Text style={styles.formLabel}>Deposit (₹)</Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder="Security Deposit"
                            value={formData.deposit}
                            onChangeText={(text) => setFormData({ ...formData, deposit: text })}
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                {/* Preferences */}
                <Text style={styles.sectionTitle}>Tenant Preferences</Text>
                <View style={styles.chipContainer}>
                    {tenantPrefs.map(pref => (
                        <TouchableOpacity
                            key={pref}
                            style={[styles.selectionChip, formData.tenantPref.includes(pref) && styles.selectionChipSelected]}
                            onPress={() => toggleSelection('tenantPref', pref)}
                        >
                            <Text style={[styles.selectionChipText, formData.tenantPref.includes(pref) && styles.selectionChipTextSelected]}>
                                {pref}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.chipContainer}>
                    {amenitiesList.map(amenity => (
                        <TouchableOpacity
                            key={amenity}
                            style={[styles.selectionChip, formData.amenities.includes(amenity) && styles.selectionChipSelected]}
                            onPress={() => toggleSelection('amenities', amenity)}
                        >
                            <Text style={[styles.selectionChipText, formData.amenities.includes(amenity) && styles.selectionChipTextSelected]}>
                                {amenity}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Photos */}
                <Text style={styles.sectionTitle}>Photos (Max 5) *</Text>
                <View style={styles.imageGrid}>
                    {images.map((uri, index) => (
                        <View key={index} style={styles.imagePreview}>
                            <Image source={{ uri }} style={styles.previewImage} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => removeImage(index)}
                            >
                                <Text style={styles.removeImageText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < 5 && (
                        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                            <Text style={styles.addImageText}>📷</Text>
                            <Text style={styles.addImageLabel}>Add Photo</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButtonLarge, status === 'submitting' && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? (
                        <>
                            <ActivityIndicator color="#fff" />
                            <Text style={styles.submitButtonTextLarge}> Submitting...</Text>
                        </>
                    ) : (
                        <Text style={styles.submitButtonTextLarge}>Submit Free Listing</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.formHintBottom}>
                    By submitting, you agree to our terms. We protect your privacy.
                </Text>
            </View>
        </ScrollView>
    );
}

// Main App with Custom Tab Navigation


export default function App() {
    const [activeTab, setActiveTab] = useState<'Home' | 'List Property'>('Home');

    return (
        <View style={styles.appContainer}>
            <StatusBar style="light" />

            <View style={styles.contentContainer}>
                {activeTab === 'Home' ? <HomeScreen /> : <LandlordScreen />}
            </View>

            {/* Custom Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setActiveTab('Home')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.tabIcon}>🏠</Text>
                    <Text style={[styles.tabLabel, activeTab === 'Home' && styles.tabLabelActive]}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setActiveTab('List Property')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.tabIcon}>➕</Text>
                    <Text style={[styles.tabLabel, activeTab === 'List Property' && styles.tabLabelActive]}>
                        List Property
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        paddingBottom: 0, // Padding handled by tab bar being rendered below
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingVertical: 8,
        paddingBottom: 24, // Extra padding for iPhone home indicator
        height: 80,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    tabLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: '500',
    },
    tabLabelActive: {
        color: '#7C3AED',
        fontWeight: '700',
    },
    // Previous styles...
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#7C3AED',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginTop: 4,
        marginBottom: 16,
    },
    searchContainer: {
        marginBottom: 12,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#333',
    },
    filterSection: {
        marginBottom: 12,
    },
    filterSectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 8,
        paddingHorizontal: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    filterRowScroll: {
        paddingRight: 20,
    },
    filterChip: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterChipActive: {
        backgroundColor: '#fff',
        borderColor: '#7C3AED',
    },
    filterChipText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#7C3AED',
        fontWeight: '600',
    },
    clearFilterChip: {
        backgroundColor: '#ff4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    clearFilterText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#e0e0e0',
    },
    cardContent: {
        padding: 16,
    },
    typeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    typeBadge: {
        backgroundColor: '#7C3AED',
        color: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 'bold',
    },
    furnishing: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    location: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7C3AED',
    },
    priceLabel: {
        fontSize: 12,
        color: '#666',
    },
    tapToView: {
        fontSize: 13,
        color: '#7C3AED',
        fontWeight: '500',
        textAlign: 'right',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    clearButton: {
        backgroundColor: '#7C3AED',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageGalleryContainer: {
        position: 'relative',
        backgroundColor: '#000',
    },
    detailImage: {
        width: SCREEN_WIDTH,
        height: 350,
        backgroundColor: '#000',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    imageCounter: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    imageCounterText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    expandHint: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    expandHintText: {
        color: '#fff',
        fontSize: 11,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    detailContent: {
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    closeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    detailTypeRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    detailTypeBadge: {
        backgroundColor: '#7C3AED',
        color: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    detailFurnishing: {
        fontSize: 14,
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 10,
    },
    detailLocation: {
        fontSize: 20,
        color: '#333',
        marginBottom: 20,
        fontWeight: '600',
    },
    detailPriceSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    detailPriceBox: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginRight: 6,
    },
    detailPriceLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    detailPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#7C3AED',
    },
    detailSection: {
        marginBottom: 20,
    },
    detailSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    detailSectionText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    bookButton: {
        flex: 1,
        backgroundColor: '#7C3AED',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginRight: 6,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    detailWhatsappButton: {
        flex: 1,
        backgroundColor: '#25D366',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginLeft: 6,
    },
    detailButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Booking Modal Styles
    bookingModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bookingModalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        width: '100%',
    },
    dateSelector: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateSelectorText: {
        fontSize: 15,
        color: '#333',
    },
    dateSelectorIcon: {
        fontSize: 16,
    },
    dateSelectionContainer: {
        padding: 20,
        height: 400,
    },
    dateSelectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    dateOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dateOptionDay: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    dateOptionDate: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    closeDateButton: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        alignItems: 'center',
    },
    closeDateButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    bookingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    bookingCloseButton: {
        fontSize: 24,
        color: '#666',
        fontWeight: '300',
    },
    bookingForm: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#7C3AED',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonDisabled: {
        backgroundColor: '#b8a3e8',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formHint: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 12,
    },
    // Success State Styles
    bookingSuccessContainer: {
        padding: 40,
        alignItems: 'center',
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },

    successIconText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    whatsappSuccessButton: {
        width: '100%',
        backgroundColor: '#25D366',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    whatsappSuccessButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeSuccessButton: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeSuccessButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    // Fullscreen Image Styles
    fullscreenContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    navArrowLeft: {
        position: 'absolute',
        left: 10,
        top: '50%',
        marginTop: -25,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
    },
    navArrowRight: {
        position: 'absolute',
        right: 10,
        top: '50%',
        marginTop: -25,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
    },
    navArrowText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: -4,
    },
    fullscreenCloseButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenCloseText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    fullscreenImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    fullscreenTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenHint: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    fullscreenHintText: {
        color: '#fff',
        fontSize: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    // Landlord Form Styles
    landlordHeader: {
        backgroundColor: '#333',
        padding: 24,
        alignItems: 'center',
    },
    landlordTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    landlordSubtitle: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 4,
    },
    landlordForm: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#7C3AED',
        textTransform: 'uppercase',
        marginTop: 20,
        marginBottom: 12,
        letterSpacing: 1,
    },
    formRow: {
        flexDirection: 'row',
        gap: 12,
    },
    formHalf: {
        flex: 1,
        marginRight: 6,
    },
    pickerContainer: {
        marginBottom: 12,
    },
    optionChip: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    optionChipSelected: {
        backgroundColor: '#7C3AED',
        borderColor: '#7C3AED',
    },
    optionChipText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    optionChipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    selectionChip: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginRight: 8,
        marginBottom: 8,
    },
    selectionChipSelected: {
        backgroundColor: '#7C3AED',
        borderColor: '#7C3AED',
    },
    selectionChipText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    selectionChipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    imagePreview: {
        width: (SCREEN_WIDTH - 64) / 3,
        height: (SCREEN_WIDTH - 64) / 3,
        position: 'relative',
        marginRight: 12,
        marginBottom: 12,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#ff4444',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    addImageButton: {
        width: (SCREEN_WIDTH - 64) / 3,
        height: (SCREEN_WIDTH - 64) / 3,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageText: {
        fontSize: 32,
    },
    addImageLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 4,
    },
    submitButtonLarge: {
        backgroundColor: '#333',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    submitButtonTextLarge: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formHintBottom: {
        fontSize: 11,
        color: '#999',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    // Success Screen for Landlord
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    successIconLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successIconTextLarge: {
        fontSize: 60,
        color: '#fff',
        fontWeight: 'bold',
    },
    successTitleLarge: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    successMessageLarge: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    listAnotherButton: {
        backgroundColor: '#333',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    listAnotherButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
