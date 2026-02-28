// // import React, { useState, useCallback, useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { useNavigate } from 'react-router-dom';
// // import { createPackage } from '../../features/packages/packageSlice';
// // import {
// //   Box,
// //   Typography,
// //   Button,
// //   Paper,
// //   Stepper,
// //   Step,
// //   StepLabel,
// //   Grid,
// //   TextField,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   FormControlLabel,
// //   Switch,
// //   Alert,
// //   Snackbar,
// //   FormHelperText,
// //   CircularProgress
// // } from '@mui/material';
// // // ✅ Import Leaflet Components
// // import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';

// // // Fix for default Leaflet marker icon issue in Webpack/Vite
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // });

// // const COLORS = {
// //   primary: '#1976d2',
// //   primaryLight: '#e3f2fd',
// //   success: '#2e7d32',
// //   error: '#c62828',
// //   text: '#000',
// //   textSecondary: '#555',
// //   background: '#fff',
// //   border: '#e0e0e0',
// //   cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
// // };

// // // ✅ UPDATED: Added Location Map Step
// // const steps = [
// //   { label: 'Info', description: 'Title, destination, duration' },
// //   { label: 'Price', description: 'Prices, capacity' },
// //   { label: 'Content', description: 'Inclusions, itinerary' },
// //   { label: 'Location Map', description: 'Pick location on map' }, // New Step
// //   { label: 'Media', description: 'Upload images' },
// //   { label: 'Review', description: 'Final check' }
// // ];

// // // ✅ Component to handle map clicks inside the form
// // function LocationPicker({ onLocationSelect, initialLat, initialLng }) {
// //   const [markerPosition, setMarkerPosition] = useState(
// //     initialLat && initialLng ? [parseFloat(initialLat), parseFloat(initialLng)] : [-1.2921, 36.8219] // Default to Nairobi
// //   );
// //   const [isFetchingAddress, setIsFetchingAddress] = useState(false);

// //   useMapEvents({
// //     click: async (e) => {
// //       const { lat, lng } = e.latlng;
// //       setMarkerPosition([lat, lng]);
// //       onLocationSelect(lat, lng, 'Searching address...');
      
// //       // Fetch Address from OpenStreetMap (Nominatim)
// //       setIsFetchingAddress(true);
// //       try {
// //         const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
// //         const data = await response.json();
// //         const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
// //         onLocationSelect(lat, lng, address);
// //       } catch (error) {
// //         console.error("Error fetching address:", error);
// //         onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
// //       } finally {
// //         setIsFetchingAddress(false);
// //       }
// //     },
// //   });

// //   return (
// //     <>
// //       <Marker position={markerPosition} draggable={true} eventHandlers={{
// //         dragend: (e) => {
// //           const { lat, lng } = e.target.getLatLng();
// //           setMarkerPosition([lat, lng]);
// //           onLocationSelect(lat, lng, 'Address updated via drag');
// //         }
// //       }} />
// //       {isFetchingAddress && (
// //         <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, background: 'white', padding: '5px 10px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
// //           <CircularProgress size={20} /> <span style={{ fontSize: '12px' }}>Finding address...</span>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// // export default function CreatePackage() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const { loading, error } = useSelector((state) => state.packages);

// //   const [activeStep, setActiveStep] = useState(0);
  
// //   const [formData, setFormData] = useState({
// //     title: '',
// //     description: '',
// //     destination: '',
// //     duration_days: '',
// //     duration_nights: '',
// //     category: 'wildlife',
// //     price_adult: '',
// //     price_child: '',
// //     max_capacity: 20,
// //     status: 'published',
// //     is_featured: false,
// //     inclusions: '',
// //     exclusions: '',
// //     itinerary: '',
// //     images: [],
// //     // Location Fields
// //     location_lat: '',
// //     location_lng: '',
// //     location_address: ''
// //   });

// //   const [errors, setErrors] = useState({});
// //   const [imagePreviews, setImagePreviews] = useState([]);
// //   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Auto-calculate nights when days change
// //   useEffect(() => {
// //     if (formData.duration_days && !formData.duration_nights) {
// //       const days = parseInt(formData.duration_days);
// //       if (days > 0) {
// //         setFormData(prev => ({ ...prev, duration_nights: days - 1 }));
// //       }
// //     }
// //   }, [formData.duration_days]);

// //   const validateField = useCallback((name, value) => {
// //     let error = '';
// //     switch (name) {
// //       case 'title':
// //         if (!value.trim()) error = 'Package title is required';
// //         else if (value.length < 5) error = 'Title must be at least 5 characters';
// //         break;
// //       case 'description':
// //         if (!value.trim()) error = 'Short description is required';
// //         else if (value.length < 10) error = 'Description must be at least 10 characters';
// //         break;
// //       case 'destination':
// //         if (!value.trim()) error = 'Destination is required';
// //         break;
// //       case 'duration_days':
// //         if (!value) error = 'Duration is required';
// //         else if (parseInt(value) < 1) error = 'Duration must be at least 1 day';
// //         break;
// //       case 'location_lat':
// //         if (value && (parseFloat(value) < -90 || parseFloat(value) > 90)) error = 'Invalid Latitude (-90 to 90)';
// //         break;
// //       case 'location_lng':
// //         if (value && (parseFloat(value) < -180 || parseFloat(value) > 180)) error = 'Invalid Longitude (-180 to 180)';
// //         break;
// //       case 'price_adult':
// //         if (!value) error = 'Adult price is required';
// //         else if (parseFloat(value) <= 0) error = 'Price must be greater than 0';
// //         break;
// //       case 'category':
// //       case 'status':
// //         if (!value) error = 'This field is required';
// //         break;
// //       default: break;
// //     }
// //     return error;
// //   }, []);

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //     const error = validateField(name, value);
// //     setErrors(prev => ({ ...prev, [name]: error }));
// //   };

// //   // ✅ Handler for Map Selection
// //   const handleMapLocationSelect = (lat, lng, address) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       location_lat: lat.toString(),
// //       location_lng: lng.toString(),
// //       location_address: address
// //     }));
// //     if (errors.location_lat) setErrors(prev => ({ ...prev, location_lat: '' }));
// //     if (errors.location_lng) setErrors(prev => ({ ...prev, location_lng: '' }));
// //   };

// //   const handleCheckboxChange = (e) => {
// //     const { name, checked } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: checked }));
// //   };

// //   const handleImageChange = (e) => {
// //     const files = Array.from(e.target.files);
// //     const newImages = files.map(file => ({
// //       file,
// //       url: URL.createObjectURL(file),
// //       caption: '',
// //       is_primary: imagePreviews.length === 0
// //     }));
// //     setImagePreviews(prev => [...prev, ...newImages]);
// //     setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
// //   };

// //   const updateImageCaption = (index, caption) => {
// //     const updatedPreviews = [...imagePreviews];
// //     updatedPreviews[index].caption = caption;
// //     setImagePreviews(updatedPreviews);
// //     const updatedImages = [...formData.images];
// //     updatedImages[index].caption = caption;
// //     setFormData(prev => ({ ...prev, images: updatedImages }));
// //   };

// //   const togglePrimaryImage = (index) => {
// //     const updatedPreviews = imagePreviews.map((img, i) => ({ ...img, is_primary: i === index }));
// //     setImagePreviews(updatedPreviews);
// //     const updatedImages = formData.images.map((img, i) => ({ ...img, is_primary: i === index }));
// //     setFormData(prev => ({ ...prev, images: updatedImages }));
// //   };

// //   const removeImage = (index) => {
// //     const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
// //     setImagePreviews(updatedPreviews);
// //     const updatedImages = formData.images.filter((_, i) => i !== index);
// //     setFormData(prev => ({ ...prev, images: updatedImages }));
// //   };

// //   const nextStep = () => { if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1); };
// //   const prevStep = () => { if (activeStep > 0) setActiveStep(prev => prev - 1); };

// //   const isStepValid = useCallback((stepIndex) => {
// //     switch (stepIndex) {
// //       case 0: 
// //         return !validateField('title', formData.title) && 
// //                !validateField('description', formData.description) && 
// //                !validateField('destination', formData.destination) && 
// //                !validateField('duration_days', formData.duration_days) && 
// //                !validateField('category', formData.category);
// //       case 1: 
// //         return !validateField('price_adult', formData.price_adult) && 
// //                !validateField('status', formData.status);
// //       // Location step is optional but recommended, so we don't block validation
// //       default: return true;
// //     }
// //   }, [formData, validateField]);

// //   const handleNextStep = () => {
// //     if (isStepValid(activeStep)) {
// //       nextStep();
// //     } else {
// //       const newErrors = {};
// //       if (activeStep === 0) {
// //         newErrors.title = validateField('title', formData.title);
// //         newErrors.destination = validateField('destination', formData.destination);
// //         newErrors.duration_days = validateField('duration_days', formData.duration_days);
// //         newErrors.category = validateField('category', formData.category);
// //       } else if (activeStep === 1) {
// //         newErrors.price_adult = validateField('price_adult', formData.price_adult);
// //         newErrors.status = validateField('status', formData.status);
// //       }
// //       setErrors(newErrors);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     setIsSubmitting(true);
// //     try {
// //       const formDataToSend = new FormData();

// //       formDataToSend.append('title', formData.title);
// //       formDataToSend.append('description', formData.description);
// //       formDataToSend.append('destination', formData.destination);
// //       formDataToSend.append('duration_days', parseInt(formData.duration_days) || 1);
// //       formDataToSend.append('duration_nights', formData.duration_nights ? parseInt(formData.duration_nights) : null);
      
// //       const locationObj = {
// //         lat: formData.location_lat ? parseFloat(formData.location_lat) : null,
// //         lng: formData.location_lng ? parseFloat(formData.location_lng) : null,
// //         address: formData.location_address || formData.destination
// //       };
// //       if (locationObj.lat || locationObj.address) {
// //         formDataToSend.append('location', JSON.stringify(locationObj));
// //       }

// //       formDataToSend.append('price_adult', parseFloat(formData.price_adult));
// //       formDataToSend.append('price_child', formData.price_child ? parseFloat(formData.price_child) : 0);
// //       formDataToSend.append('max_capacity', parseInt(formData.max_capacity) || 20);
// //       formDataToSend.append('category', formData.category);
// //       formDataToSend.append('status', formData.status);
// //       formDataToSend.append('is_featured', formData.is_featured);

// //       const parseOrWrap = (val) => {
// //         if (!val) return '[]';
// //         try {
// //           const parsed = JSON.parse(val);
// //           return JSON.stringify(parsed);
// //         } catch (e) {
// //           if (val.includes(',')) return JSON.stringify(val.split(',').map(s => s.trim()));
// //           return JSON.stringify([val]);
// //         }
// //       };

// //       formDataToSend.append('inclusions', parseOrWrap(formData.inclusions));
// //       formDataToSend.append('exclusions', parseOrWrap(formData.exclusions));
// //       formDataToSend.append('itinerary', parseOrWrap(formData.itinerary));

// //       const imagesPayload = imagePreviews.map((img) => ({
// //         id: null,
// //         url: null,
// //         caption: img.caption || '',
// //         is_primary: img.is_primary || false
// //       }));
// //       formDataToSend.append('images', JSON.stringify(imagesPayload));

// //       imagePreviews.forEach((img) => {
// //         if (img.file) {
// //           formDataToSend.append('newImages', img.file);
// //         }
// //       });

// //       await dispatch(createPackage(formDataToSend)).unwrap();

// //       setSnackbar({ open: true, message: 'Package created successfully!', severity: 'success' });
// //       setTimeout(() => navigate('/admin/packages'), 1500);

// //     } catch (err) {
// //       setSnackbar({ open: true, message: err.message || 'Failed to create package', severity: 'error' });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

// //   const getStepContent = (step) => {
// //     switch (step) {
// //       case 0: // Basic Info
// //         return (
// //           <Grid container spacing={2}>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Package Title *" name="title" value={formData.title} onChange={handleInputChange} error={!!errors.title} helperText={errors.title} required variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Short Description *" name="description" value={formData.description} onChange={handleInputChange} error={!!errors.description} helperText={errors.description} required variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Destination *" name="destination" value={formData.destination} onChange={handleInputChange} error={!!errors.destination} helperText={errors.destination} required variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Duration (Days) *" name="duration_days" type="number" value={formData.duration_days} onChange={handleInputChange} error={!!errors.duration_days} helperText={errors.duration_days} required inputProps={{ min: "1", max: "365" }} variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
// //               <FormControl fullWidth error={!!errors.category} sx={{ width: '100%' }}>
// //                 <InputLabel>Category *</InputLabel>
// //                 <Select name="category" value={formData.category} label="Category *" onChange={handleInputChange} required sx={{ width: '100%' }}>
// //                   <MenuItem value="adventure">Adventure</MenuItem>
// //                   <MenuItem value="cultural">Cultural</MenuItem>
// //                   <MenuItem value="beach">Beach</MenuItem>
// //                   <MenuItem value="wildlife">Wildlife</MenuItem>
// //                   <MenuItem value="luxury">Luxury</MenuItem>
// //                   <MenuItem value="budget">Budget</MenuItem>
// //                   <MenuItem value="family">Family</MenuItem>
// //                   <MenuItem value="honeymoon">Honeymoon</MenuItem>
// //                 </Select>
// //                 {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
// //               </FormControl>
// //             </Grid>
// //           </Grid>
// //         );

// //       case 1: // Pricing
// //         return (
// //           <Grid container spacing={2}>
// //             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Adult Price (KES) *" name="price_adult" type="number" value={formData.price_adult} onChange={handleInputChange} error={!!errors.price_adult} helperText={errors.price_adult} required variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Child Price (KES)" name="price_child" type="number" value={formData.price_child} onChange={handleInputChange} variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Duration (Nights)" name="duration_nights" type="number" value={formData.duration_nights} onChange={handleInputChange} helperText={`Defaults to ${formData.duration_days ? parseInt(formData.duration_days) - 1 : 0} if empty`} inputProps={{ min: "0" }} variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Max Capacity" name="max_capacity" type="number" value={formData.max_capacity} onChange={handleInputChange} variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
// //               <FormControl fullWidth error={!!errors.status} sx={{ width: '100%' }}>
// //                 <InputLabel>Status *</InputLabel>
// //                 <Select name="status" value={formData.status} label="Status *" onChange={handleInputChange} required sx={{ width: '100%' }}>
// //                   <MenuItem value="draft">Draft</MenuItem>
// //                   <MenuItem value="published">Published</MenuItem>
// //                   <MenuItem value="archived">Archived</MenuItem>
// //                 </Select>
// //                 {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
// //               </FormControl>
// //             </Grid>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%', mt: 1 }}>
// //               <FormControlLabel control={<Switch checked={formData.is_featured} onChange={handleCheckboxChange} name="is_featured" />} label="Featured Package" />
// //             </Grid>
// //           </Grid>
// //         );

// //       case 2: // Content
// //         return (
// //           <Grid container spacing={2}>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //               <Alert severity="info" sx={{ mb: 2, fontSize: '0.85rem' }}>
// //                 💡 <strong>Tip:</strong> You can paste JSON directly or use comma-separated lists.
// //               </Alert>
// //             </Grid>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Inclusions" name="inclusions" value={formData.inclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" sx={{ width: '100%' }} placeholder='["Accommodation", "Meals"] OR Accommodation, Meals' helperText="List items separated by commas or paste JSON array" />
// //             </Grid>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Exclusions" name="exclusions" value={formData.exclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" sx={{ width: '100%' }} placeholder='["Flights", "Tips"] OR Flights, Tips' helperText="List items separated by commas or paste JSON array" />
// //             </Grid>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Itinerary (JSON)" name="itinerary" value={formData.itinerary} onChange={handleInputChange} multiline rows={6} variant="outlined" sx={{ width: '100%' }} placeholder={`[{"day": 1, "title": "Arrival", "description": "..."}]`} helperText="Paste valid JSON array of day objects" />
// //             </Grid>
// //           </Grid>
// //         );

// //       // ✅ NEW STEP: Location Map
// //       case 3: 
// //         return (
// //           <Grid container spacing={2}>
// //             <Grid item xs={12}>
// //               <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>📍 Pick Location on Map</Typography>
// //               <Paper sx={{ height: 400, width: '100%', mb: 2, overflow: 'hidden', borderRadius: '8px' }}>
// //                 <MapContainer center={[formData.location_lat || -1.2921, formData.location_lng || 36.8219]} zoom={13} style={{ height: '100%', width: '100%' }}>
// //                   <TileLayer
// //                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                   />
// //                   <LocationPicker 
// //                     onLocationSelect={handleMapLocationSelect} 
// //                     initialLat={formData.location_lat} 
// //                     initialLng={formData.location_lng} 
// //                   />
// //                 </MapContainer>
// //               </Paper>
// //               <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
// //                 Click anywhere on the map or drag the marker to set the tour starting point. Coordinates will update automatically.
// //               </Alert>
// //             </Grid>
// //             <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Latitude" name="location_lat" type="number" inputProps={{ step: "any" }} value={formData.location_lat} onChange={handleInputChange} error={!!errors.location_lat} helperText={errors.location_lat} variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Longitude" name="location_lng" type="number" inputProps={{ step: "any" }} value={formData.location_lng} onChange={handleInputChange} error={!!errors.location_lng} helperText={errors.location_lng} variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //             <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
// //               <TextField fullWidth label="Address Label" name="location_address" value={formData.location_address} onChange={handleInputChange} placeholder="e.g., Nairobi National Park Gate" variant="outlined" sx={{ width: '100%' }} />
// //             </Grid>
// //           </Grid>
// //         );

// //       case 4: // Media (Shifted from 3)
// //         return (
// //           <Grid container spacing={2}>
// //             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //               <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Package Images</Typography>
// //               <Button variant="outlined" component="label" fullWidth sx={{ borderColor: COLORS.primary, color: COLORS.primary, py: 1.5, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: COLORS.primaryLight } }}>
// //                 Upload Images
// //                 <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
// //               </Button>
// //             </Grid>
// //             {imagePreviews.length > 0 && (
// //               <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
// //                 <Grid container spacing={2}>
// //                   {imagePreviews.map((preview, index) => (
// //                     <Grid item xs={6} sm={4} key={index} sx={{ display: 'block', width: '100%' }}>
// //                       <Paper sx={{ p: 1, borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
// //                         <img src={preview.url} alt={`Preview ${index}`} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
// //                         <TextField fullWidth size="small" placeholder="Caption" value={preview.caption} onChange={(e) => updateImageCaption(index, e.target.value)} sx={{ mt: 1 }} />
// //                         <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'space-between' }}>
// //                           <Button size="small" variant={preview.is_primary ? "contained" : "outlined"} onClick={() => togglePrimaryImage(index)} sx={{ fontSize: '0.65rem', px: 1, minWidth: 'auto', ...(preview.is_primary && { backgroundColor: COLORS.primary }) }}>
// //                             {preview.is_primary ? '✓' : 'Set'}
// //                           </Button>
// //                           <Button size="small" variant="outlined" color="error" onClick={() => removeImage(index)} sx={{ fontSize: '0.65rem', px: 1, minWidth: 'auto' }}>Remove</Button>
// //                         </Box>
// //                       </Paper>
// //                     </Grid>
// //                   ))}
// //                 </Grid>
// //               </Grid>
// //             )}
// //           </Grid>
// //         );
      
// //       case 5: // Review (Shifted from 4)
// //         return (
// //           <div className="w-100">
// //             <h4 className="mb-4">Review Your Package</h4>
// //             <div className="card mb-3 border">
// //               <div className="card-body">
// //                 <h6 className="card-subtitle mb-3 text-primary fw-bold">Basic Information</h6>
// //                 <div className="row g-2">
// //                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Title:</strong> {formData.title || '—'}</p></div>
// //                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Description:</strong> <em className="text-muted">{formData.description || '—'}</em></p></div>
// //                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Destination:</strong> {formData.destination || '—'}</p></div>
// //                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Duration:</strong> {formData.duration_days || '—'} Days / {formData.duration_nights || '?'} Nights</p></div>
// //                   <div className="col-12 col-md-6">
// //                     <strong>Category:</strong> <span className="badge bg-secondary ms-1">{formData.category}</span>
// //                   </div>
// //                   {formData.location_lat && formData.location_lng && (
// //                     <div className="col-12">
// //                       <p className="mb-1 text-success"><strong>📍 Map:</strong> {formData.location_address || 'Coordinates set'} ({formData.location_lat}, {formData.location_lng})</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="card mb-3 border">
// //               <div className="card-body">
// //                 <h6 className="card-subtitle mb-3 text-primary fw-bold">Pricing & Details</h6>
// //                 <div className="row g-2">
// //                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Adult Price:</strong> KES {formData.price_adult ? parseFloat(formData.price_adult).toLocaleString() : '—'}</p></div>
// //                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Child Price:</strong> KES {formData.price_child ? parseFloat(formData.price_child).toLocaleString() : '—'}</p></div>
// //                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Max Capacity:</strong> {formData.max_capacity}</p></div>
// //                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Inclusions:</strong> <em className="text-muted">{formData.inclusions || 'None specified'}</em></p></div>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="card mb-3 border">
// //               <div className="card-body">
// //                 <h6 className="card-subtitle mb-3 text-primary fw-bold">Media</h6>
// //                 <p className="mb-2"><strong>Images Uploaded:</strong> {imagePreviews.length}</p>
// //                 {imagePreviews.length > 0 ? (
// //                   <div className="d-flex gap-2 flex-wrap">
// //                     {imagePreviews.map((preview, index) => (
// //                       <div key={index} style={{ position: 'relative' }}>
// //                         <img src={preview.url} alt={`Preview ${index}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
// //                         {preview.is_primary && (
// //                           <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#1976d2', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <p className="text-muted fst-italic">No images uploaded.</p>
// //                 )}
// //               </div>
// //             </div>
// //             <p className="text-muted fst-italic small">Please review all information before submitting.</p>
// //           </div>
// //         );
// //       default: return null;
// //     }
// //   };

// //   return (
// //     <Box sx={{ p: { xs: 1, sm: 2 }, width: '100%', maxWidth: '100%' }}>
// //       {/* Header */}
// //       <Box sx={{
// //         display: 'flex',
// //         flexDirection: { xs: 'column', sm: 'row' },
// //         justifyContent: 'space-between',
// //         alignItems: { xs: 'flex-start', sm: 'center' },
// //         mb: 3,
// //         pb: 2,
// //         borderBottom: `1px solid ${COLORS.border}`,
// //         gap: 2
// //       }}>
// //         <Box sx={{ flex: 1 }}>
// //           <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
// //             Create New Package
// //           </Typography>
// //           <Typography variant="body2" sx={{ color: COLORS.textSecondary, mt: 1 }}>
// //             Complete all steps to create a new tour package
// //           </Typography>
// //         </Box>
// //         <Button onClick={() => navigate('/admin/packages')} variant="outlined" fullWidth={{ xs: true, sm: false }} sx={{ borderColor: COLORS.primary, color: COLORS.primary, px: 3, py: 1, fontWeight: 600, textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: COLORS.primaryLight }, minWidth: { xs: '100%', sm: 'auto' } }}>
// //           Cancel
// //         </Button>
// //       </Box>

// //       {error && (
// //         <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', width: '100%' }} onClose={() => dispatch({ type: 'packages/clearError' })}>{error}</Alert>
// //       )}

// //       {/* Stepper & Form Paper */}
// //       <Paper sx={{
// //         p: { xs: 2, sm: 3, md: 4 },
// //         backgroundColor: COLORS.background,
// //         borderRadius: '12px',
// //         boxShadow: COLORS.cardShadow,
// //         border: `1px solid ${COLORS.border}`,
// //         mb: 4,
// //         width: '100%',
// //         boxSizing: 'border-box'
// //       }}>
// //         {/* Mobile-Optimized Stepper */}
// //         <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
// //           {steps.map((step, index) => (
// //             <Step key={step.label}>
// //               <StepLabel
// //                 sx={{
// //                   '& .MuiStepLabel-label': {
// //                     fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.9rem' },
// //                     fontWeight: 500,
// //                     color: COLORS.textSecondary,
// //                     '&.Mui-active': { color: COLORS.primary },
// //                     '&.Mui-completed': { color: COLORS.success },
// //                     whiteSpace: 'nowrap',
// //                     overflow: 'hidden',
// //                     textOverflow: 'ellipsis'
// //                   },
// //                   '& .MuiStepIcon-root': {
// //                     fontSize: { xs: 18, sm: 22 },
// //                     color: COLORS.border,
// //                     '&.Mui-active': { color: COLORS.primary },
// //                     '&.Mui-completed': { color: COLORS.success }
// //                   }
// //                 }}
// //               >
// //                 <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
// //                   <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{step.label}</Typography>
// //                   <Typography variant="caption" sx={{ color: COLORS.textSecondary, display: { xs: 'none', md: 'block' } }}>{step.description}</Typography>
// //                 </Box>
// //                 <Typography variant="caption" sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center', mt: 0.5, fontSize: '0.6rem' }}>
// //                   {step.label}
// //                 </Typography>
// //               </StepLabel>
// //             </Step>
// //           ))}
// //         </Stepper>

// //         <Box sx={{ minHeight: { xs: '300px', sm: '400px' }, width: '100%' }}>
// //           {getStepContent(activeStep)}
// //         </Box>

// //         {/* Navigation Buttons */}
// //         <Box sx={{
// //           display: 'flex',
// //           flexDirection: { xs: 'column-reverse', sm: 'row' },
// //           justifyContent: 'space-between',
// //           gap: 2,
// //           mt: 4,
// //           pt: 3,
// //           borderTop: `1px solid ${COLORS.border}`
// //         }}>
// //           <Button disabled={activeStep === 0} onClick={prevStep} variant="outlined" fullWidth={{ xs: true, sm: false }} sx={{ borderColor: COLORS.border, color: COLORS.text, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: COLORS.primary, color: COLORS.primary } }}>
// //             Back
// //           </Button>

// //           <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
// //             {activeStep === steps.length - 1 ? (
// //               <Button onClick={handleSubmit} disabled={isSubmitting} variant="contained" fullWidth={{ xs: true, sm: false }} sx={{ backgroundColor: COLORS.primary, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, minWidth: { xs: 'auto', sm: '160px' }, '&:hover': { backgroundColor: '#1565c0' } }}>
// //                 {isSubmitting ? 'Creating...' : 'Create Package'}
// //               </Button>
// //             ) : (
// //               <Button onClick={handleNextStep} variant="contained" fullWidth={{ xs: true, sm: false }} sx={{ backgroundColor: COLORS.primary, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, minWidth: { xs: 'auto', sm: '160px' }, '&:hover': { backgroundColor: '#1565c0' } }}>
// //                 Next
// //               </Button>
// //             )}
// //           </Box>
// //         </Box>
// //       </Paper>

// //       <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
// //         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '8px', fontWeight: 500 }}>{snackbar.message}</Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // }


// import React, { useState, useCallback, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { createPackage } from '../../features/packages/packageSlice';
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   Stepper,
//   Step,
//   StepLabel,
//   Grid,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Switch,
//   Alert,
//   Snackbar,
//   Chip,
//   Card,
//   CardContent,
//   FormHelperText,
//   CircularProgress
// } from '@mui/material';
// // ✅ Import Leaflet Components
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for default Leaflet marker icon issue in Webpack/Vite
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const COLORS = {
//   primary: '#1976d2',
//   primaryLight: '#e3f2fd',
//   success: '#2e7d32',
//   error: '#c62828',
//   text: '#000',
//   textSecondary: '#555',
//   background: '#fff',
//   border: '#e0e0e0',
//   cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
// };

// // ✅ UPDATED: Added Location Map Step
// const steps = [
//   { label: 'Info', description: 'Title, destination, duration' },
//   { label: 'Price', description: 'Prices, capacity' },
//   { label: 'Content', description: 'Inclusions, itinerary' },
//   { label: 'Location Map', description: 'Pick location on map' },
//   { label: 'Media', description: 'Upload images' },
//   { label: 'Review', description: 'Final check' }
// ];

// // ✅ Component to handle map clicks inside the form
// function LocationPicker({ onLocationSelect, initialLat, initialLng }) {
//   const [markerPosition, setMarkerPosition] = useState(
//     initialLat && initialLng ? [parseFloat(initialLat), parseFloat(initialLng)] : [-1.2921, 36.8219]
//   );
//   const [isFetchingAddress, setIsFetchingAddress] = useState(false);

//   useMapEvents({
//     click: async (e) => {
//       const { lat, lng } = e.latlng;
//       setMarkerPosition([lat, lng]);
//       onLocationSelect(lat, lng, 'Searching address...');
      
//       // Fetch Address from OpenStreetMap (Nominatim) - FIXED URL
//       setIsFetchingAddress(true);
//       try {
//         const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//         const data = await response.json();
//         const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
//         onLocationSelect(lat, lng, address);
//       } catch (error) {
//         console.error("Error fetching address:", error);
//         onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
//       } finally {
//         setIsFetchingAddress(false);
//       }
//     },
//   });

//   return (
//     <>
//       <Marker 
//         position={markerPosition} 
//         draggable={true} 
//         eventHandlers={{
//           dragend: (e) => {
//             const { lat, lng } = e.target.getLatLng();
//             setMarkerPosition([lat, lng]);
//             onLocationSelect(lat, lng, 'Address updated via drag');
//           }
//         }} 
//       />
//       {isFetchingAddress && (
//         <div style={{ 
//           position: 'absolute', 
//           top: 10, 
//           right: 10, 
//           zIndex: 1000, 
//           background: 'white', 
//           padding: '5px 10px', 
//           borderRadius: '4px', 
//           boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
//         }}>
//           <CircularProgress size={20} /> <span style={{ fontSize: '12px' }}>Finding address...</span>
//         </div>
//       )}
//     </>
//   );
// }

// export default function CreatePackage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state) => state.packages);

//   const [activeStep, setActiveStep] = useState(0);
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     destination: '',
//     duration_days: '',
//     duration_nights: '',
//     category: 'wildlife',
//     price_adult: '',
//     price_child: '',
//     max_capacity: 20,
//     status: 'published',
//     is_featured: false,
//     inclusions: '',
//     exclusions: '',
//     itinerary: '',
//     images: [],
//     // Location Fields
//     location_lat: '',
//     location_lng: '',
//     location_address: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Auto-calculate nights when days change
//   useEffect(() => {
//     if (formData.duration_days && !formData.duration_nights) {
//       const days = parseInt(formData.duration_days);
//       if (days > 0) {
//         setFormData(prev => ({ ...prev, duration_nights: days - 1 }));
//       }
//     }
//   }, [formData.duration_days]);

//   const validateField = useCallback((name, value) => {
//     let error = '';
//     switch (name) {
//       case 'title':
//         if (!value.trim()) error = 'Package title is required';
//         else if (value.length < 5) error = 'Title must be at least 5 characters';
//         break;
//       case 'description':
//         if (!value.trim()) error = 'Short description is required';
//         else if (value.length < 10) error = 'Description must be at least 10 characters';
//         break;
//       case 'destination':
//         if (!value.trim()) error = 'Destination is required';
//         break;
//       case 'duration_days':
//         if (!value) error = 'Duration is required';
//         else if (parseInt(value) < 1) error = 'Duration must be at least 1 day';
//         break;
//       case 'location_lat':
//         if (value && (parseFloat(value) < -90 || parseFloat(value) > 90)) error = 'Invalid Latitude (-90 to 90)';
//         break;
//       case 'location_lng':
//         if (value && (parseFloat(value) < -180 || parseFloat(value) > 180)) error = 'Invalid Longitude (-180 to 180)';
//         break;
//       case 'price_adult':
//         if (!value) error = 'Adult price is required';
//         else if (parseFloat(value) <= 0) error = 'Price must be greater than 0';
//         break;
//       case 'category':
//       case 'status':
//         if (!value) error = 'This field is required';
//         break;
//       default: break;
//     }
//     return error;
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     const error = validateField(name, value);
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   // ✅ Handler for Map Selection
//   const handleMapLocationSelect = (lat, lng, address) => {
//     setFormData(prev => ({
//       ...prev,
//       location_lat: lat.toString(),
//       location_lng: lng.toString(),
//       location_address: address
//     }));
//     if (errors.location_lat) setErrors(prev => ({ ...prev, location_lat: '' }));
//     if (errors.location_lng) setErrors(prev => ({ ...prev, location_lng: '' }));
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData(prev => ({ ...prev, [name]: checked }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map(file => ({
//       file,
//       url: URL.createObjectURL(file),
//       caption: '',
//       is_primary: imagePreviews.length === 0
//     }));
//     setImagePreviews(prev => [...prev, ...newImages]);
//     setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
//   };

//   const updateImageCaption = (index, caption) => {
//     const updatedPreviews = [...imagePreviews];
//     updatedPreviews[index].caption = caption;
//     setImagePreviews(updatedPreviews);
//     const updatedImages = [...formData.images];
//     updatedImages[index].caption = caption;
//     setFormData(prev => ({ ...prev, images: updatedImages }));
//   };

//   const togglePrimaryImage = (index) => {
//     const updatedPreviews = imagePreviews.map((img, i) => ({ ...img, is_primary: i === index }));
//     setImagePreviews(updatedPreviews);
//     const updatedImages = formData.images.map((img, i) => ({ ...img, is_primary: i === index }));
//     setFormData(prev => ({ ...prev, images: updatedImages }));
//   };

//   const removeImage = (index) => {
//     const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
//     setImagePreviews(updatedPreviews);
//     const updatedImages = formData.images.filter((_, i) => i !== index);
//     setFormData(prev => ({ ...prev, images: updatedImages }));
//   };

//   const nextStep = () => { if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1); };
//   const prevStep = () => { if (activeStep > 0) setActiveStep(prev => prev - 1); };

//   const isStepValid = useCallback((stepIndex) => {
//     switch (stepIndex) {
//       case 0: 
//         return !validateField('title', formData.title) && 
//                !validateField('description', formData.description) && 
//                !validateField('destination', formData.destination) && 
//                !validateField('duration_days', formData.duration_days) && 
//                !validateField('category', formData.category);
//       case 1: 
//         return !validateField('price_adult', formData.price_adult) && 
//                !validateField('status', formData.status);
//       default: return true;
//     }
//   }, [formData, validateField]);

//   const handleNextStep = () => {
//     if (isStepValid(activeStep)) {
//       nextStep();
//     } else {
//       const newErrors = {};
//       if (activeStep === 0) {
//         newErrors.title = validateField('title', formData.title);
//         newErrors.destination = validateField('destination', formData.destination);
//         newErrors.duration_days = validateField('duration_days', formData.duration_days);
//         newErrors.category = validateField('category', formData.category);
//       } else if (activeStep === 1) {
//         newErrors.price_adult = validateField('price_adult', formData.price_adult);
//         newErrors.status = validateField('status', formData.status);
//       }
//       setErrors(newErrors);
//     }
//   };

//   // ✅ IMPROVED: Convert comma-separated or JSON input to proper JSON array string
//   const parseOrWrap = (val) => {
//     if (!val || !val.trim()) return '[]';
//     try {
//       // If already valid JSON, re-stringify it cleanly
//       const parsed = JSON.parse(val);
//       return JSON.stringify(Array.isArray(parsed) ? parsed : [parsed]);
//     } catch (e) {
//       // If comma-separated, split and trim each item, filter empty
//       if (val.includes(',')) {
//         return JSON.stringify(
//           val.split(',')
//             .map(s => s.trim())
//             .filter(s => s)
//         );
//       }
//       // Single value - wrap in array
//       return JSON.stringify([val.trim()]);
//     }
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('destination', formData.destination);
//       formDataToSend.append('duration_days', parseInt(formData.duration_days) || 1);
//       formDataToSend.append('duration_nights', formData.duration_nights ? parseInt(formData.duration_nights) : null);
      
//       // ✅ Handle location object
//       const locationObj = {
//         lat: formData.location_lat ? parseFloat(formData.location_lat) : null,
//         lng: formData.location_lng ? parseFloat(formData.location_lng) : null,
//         address: formData.location_address || formData.destination
//       };
//       if (locationObj.lat || locationObj.address) {
//         formDataToSend.append('location', JSON.stringify(locationObj));
//       }

//       formDataToSend.append('price_adult', parseFloat(formData.price_adult));
//       formDataToSend.append('price_child', formData.price_child ? parseFloat(formData.price_child) : 0);
//       formDataToSend.append('max_capacity', parseInt(formData.max_capacity) || 20);
//       formDataToSend.append('category', formData.category);
//       formDataToSend.append('status', formData.status);
//       formDataToSend.append('is_featured', formData.is_featured);

//       // ✅ Convert comma-separated inputs to JSON arrays
//       formDataToSend.append('inclusions', parseOrWrap(formData.inclusions));
//       formDataToSend.append('exclusions', parseOrWrap(formData.exclusions));
//       formDataToSend.append('itinerary', parseOrWrap(formData.itinerary));

//       const imagesPayload = imagePreviews.map((img) => ({
//         id: null,
//         url: null,
//         caption: img.caption || '',
//         is_primary: img.is_primary || false
//       }));
//       formDataToSend.append('images', JSON.stringify(imagesPayload));

//       imagePreviews.forEach((img) => {
//         if (img.file) {
//           formDataToSend.append('newImages', img.file);
//         }
//       });

//       await dispatch(createPackage(formDataToSend)).unwrap();

//       setSnackbar({ open: true, message: 'Package created successfully!', severity: 'success' });
//       setTimeout(() => navigate('/admin/packages'), 1500);

//     } catch (err) {
//       setSnackbar({ open: true, message: err.message || 'Failed to create package', severity: 'error' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: // Basic Info
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Package Title *" name="title" value={formData.title} onChange={handleInputChange} error={!!errors.title} helperText={errors.title} required variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Short Description *" name="description" value={formData.description} onChange={handleInputChange} error={!!errors.description} helperText={errors.description} required variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Destination *" name="destination" value={formData.destination} onChange={handleInputChange} error={!!errors.destination} helperText={errors.destination} required variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Duration (Days) *" name="duration_days" type="number" value={formData.duration_days} onChange={handleInputChange} error={!!errors.duration_days} helperText={errors.duration_days} required inputProps={{ min: "1", max: "365" }} variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <FormControl fullWidth error={!!errors.category} sx={{ width: '100%' }}>
//                 <InputLabel>Category *</InputLabel>
//                 <Select name="category" value={formData.category} label="Category *" onChange={handleInputChange} required sx={{ width: '100%' }}>
//                   <MenuItem value="adventure">Adventure</MenuItem>
//                   <MenuItem value="cultural">Cultural</MenuItem>
//                   <MenuItem value="beach">Beach</MenuItem>
//                   <MenuItem value="wildlife">Wildlife</MenuItem>
//                   <MenuItem value="luxury">Luxury</MenuItem>
//                   <MenuItem value="budget">Budget</MenuItem>
//                   <MenuItem value="family">Family</MenuItem>
//                   <MenuItem value="honeymoon">Honeymoon</MenuItem>
//                 </Select>
//                 {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
//               </FormControl>
//             </Grid>
//           </Grid>
//         );

//       case 1: // Pricing
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Adult Price (KES) *" name="price_adult" type="number" value={formData.price_adult} onChange={handleInputChange} error={!!errors.price_adult} helperText={errors.price_adult} required variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Child Price (KES)" name="price_child" type="number" value={formData.price_child} onChange={handleInputChange} variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Duration (Nights)" name="duration_nights" type="number" value={formData.duration_nights} onChange={handleInputChange} helperText={`Defaults to ${formData.duration_days ? parseInt(formData.duration_days) - 1 : 0} if empty`} inputProps={{ min: "0" }} variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Max Capacity" name="max_capacity" type="number" value={formData.max_capacity} onChange={handleInputChange} variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <FormControl fullWidth error={!!errors.status} sx={{ width: '100%' }}>
//                 <InputLabel>Status *</InputLabel>
//                 <Select name="status" value={formData.status} label="Status *" onChange={handleInputChange} required sx={{ width: '100%' }}>
//                   <MenuItem value="draft">Draft</MenuItem>
//                   <MenuItem value="published">Published</MenuItem>
//                   <MenuItem value="archived">Archived</MenuItem>
//                 </Select>
//                 {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%', mt: 1 }}>
//               <FormControlLabel control={<Switch checked={formData.is_featured} onChange={handleCheckboxChange} name="is_featured" />} label="Featured Package" />
//             </Grid>
//           </Grid>
//         );

//       case 2: // Content - Comma-separated inputs
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <Alert severity="info" sx={{ mb: 2, fontSize: '0.85rem' }}>
//                 💡 <strong>Tip:</strong> Enter items separated by commas (e.g., "Accommodation, Meals, Transport") or paste valid JSON.
//               </Alert>
//             </Grid>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Inclusions" name="inclusions" value={formData.inclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" sx={{ width: '100%' }} placeholder="Accommodation, Meals, Park Fees" helperText="Comma-separated list or JSON array" />
//             </Grid>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Exclusions" name="exclusions" value={formData.exclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" sx={{ width: '100%' }} placeholder="Flights, Tips, Personal Expenses" helperText="Comma-separated list or JSON array" />
//             </Grid>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Itinerary" name="itinerary" value={formData.itinerary} onChange={handleInputChange} multiline rows={6} variant="outlined" sx={{ width: '100%' }} placeholder='{"day": 1, "title": "Arrival"} OR Day 1: Arrival, Day 2: Safari' helperText="Comma-separated day objects OR JSON array" />
//             </Grid>
//           </Grid>
//         );

//       // ✅ NEW STEP: Location Map
//       case 3: 
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>📍 Pick Location on Map</Typography>
//               <Paper sx={{ height: 400, width: '100%', mb: 2, overflow: 'hidden', borderRadius: '8px' }}>
//                 <MapContainer center={[formData.location_lat ? parseFloat(formData.location_lat) : -1.2921, formData.location_lng ? parseFloat(formData.location_lng) : 36.8219]} zoom={13} style={{ height: '100%', width: '100%' }}>
//                   <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   />
//                   <LocationPicker 
//                     onLocationSelect={handleMapLocationSelect} 
//                     initialLat={formData.location_lat} 
//                     initialLng={formData.location_lng} 
//                   />
//                 </MapContainer>
//               </Paper>
//               <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
//                 Click anywhere on the map or drag the marker to set the tour starting point. Coordinates will update automatically.
//               </Alert>
//             </Grid>
//             <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Latitude" name="location_lat" type="number" inputProps={{ step: "any" }} value={formData.location_lat} onChange={handleInputChange} error={!!errors.location_lat} helperText={errors.location_lat} variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Longitude" name="location_lng" type="number" inputProps={{ step: "any" }} value={formData.location_lng} onChange={handleInputChange} error={!!errors.location_lng} helperText={errors.location_lng} variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//             <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Address Label" name="location_address" value={formData.location_address} onChange={handleInputChange} placeholder="e.g., Nairobi National Park Gate" variant="outlined" sx={{ width: '100%' }} />
//             </Grid>
//           </Grid>
//         );

//       case 4: // Media
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Package Images</Typography>
//               <Button variant="outlined" component="label" fullWidth sx={{ borderColor: COLORS.primary, color: COLORS.primary, py: 1.5, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: COLORS.primaryLight } }}>
//                 Upload Images
//                 <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
//               </Button>
//             </Grid>
//             {imagePreviews.length > 0 && (
//               <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//                 <Grid container spacing={2}>
//                   {imagePreviews.map((preview, index) => (
//                     <Grid item xs={6} sm={4} key={index} sx={{ display: 'block', width: '100%' }}>
//                       <Paper sx={{ p: 1, borderRadius: '8px', border: `1px solid ${COLORS.border}`, position: 'relative' }}>
//                         <img 
//                           src={preview.url} 
//                           alt={`Preview ${index}`} 
//                           crossOrigin="anonymous"
//                           referrerPolicy="no-referrer" 
//                           style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} 
//                           onError={(e) => {
//                             console.error('❌ IMAGE FAILED TO LOAD:', preview.url);
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                         <TextField fullWidth size="small" placeholder="Caption" value={preview.caption} onChange={(e) => updateImageCaption(index, e.target.value)} sx={{ mt: 1 }} />
//                         <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'space-between' }}>
//                           <Button size="small" variant={preview.is_primary ? "contained" : "outlined"} onClick={() => togglePrimaryImage(index)} sx={{ fontSize: '0.65rem', px: 1, minWidth: 'auto', ...(preview.is_primary && { backgroundColor: COLORS.primary }) }}>
//                             {preview.is_primary ? '✓' : 'Set'}
//                           </Button>
//                           <Button size="small" variant="outlined" color="error" onClick={() => removeImage(index)} sx={{ fontSize: '0.65rem', px: 1, minWidth: 'auto' }}>Remove</Button>
//                         </Box>
//                       </Paper>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Grid>
//             )}
//           </Grid>
//         );
      
//       case 5: // Review - MUI Consistent Styling
//         return (
//           <Box sx={{ width: '100%' }}>
//             <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Review Your Package</Typography>
            
//             {/* Basic Info Card */}
//             <Card sx={{ mb: 3, border: `1px solid ${COLORS.border}` }}>
//               <CardContent>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: COLORS.primary }}>Basic Information</Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Title:</strong> {formData.title || '—'}</Typography></Grid>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Description:</strong> <em>{formData.description || '—'}</em></Typography></Grid>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Destination:</strong> {formData.destination || '—'}</Typography></Grid>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Duration:</strong> {formData.duration_days || '—'} Days / {formData.duration_nights || '?'} Nights</Typography></Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="body2"><strong>Category:</strong> </Typography>
//                     <Chip label={formData.category} size="small" sx={{ ml: 1 }} />
//                   </Grid>
//                   {formData.location_lat && formData.location_lng && (
//                     <Grid item xs={12}>
//                       <Typography variant="body2" color="success.main">
//                         <strong>📍 Map:</strong> {formData.location_address || 'Coordinates set'} ({formData.location_lat}, {formData.location_lng})
//                       </Typography>
//                     </Grid>
//                   )}
//                 </Grid>
//               </CardContent>
//             </Card>

//             {/* Pricing Card */}
//             <Card sx={{ mb: 3, border: `1px solid ${COLORS.border}` }}>
//               <CardContent>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: COLORS.primary }}>Pricing & Details</Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Adult Price:</strong> KES {formData.price_adult ? parseFloat(formData.price_adult).toLocaleString() : '—'}</Typography></Grid>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Child Price:</strong> KES {formData.price_child ? parseFloat(formData.price_child).toLocaleString() : '—'}</Typography></Grid>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Max Capacity:</strong> {formData.max_capacity}</Typography></Grid>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Inclusions:</strong> <em>{formData.inclusions || 'None specified'}</em></Typography></Grid>
//                 </Grid>
//               </CardContent>
//             </Card>

//             {/* Media Card */}
//             <Card sx={{ mb: 3, border: `1px solid ${COLORS.border}` }}>
//               <CardContent>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: COLORS.primary }}>Media</Typography>
//                 <Typography variant="body2" sx={{ mb: 2 }}><strong>Images Uploaded:</strong> {imagePreviews.length}</Typography>
//                 {imagePreviews.length > 0 ? (
//                   <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                     {imagePreviews.map((preview, index) => (
//                       <Box key={index} sx={{ position: 'relative' }}>
//                         <img
//                           src={preview.url}
//                           alt={`Preview ${index}`}
//                           crossOrigin="anonymous"
//                           referrerPolicy="no-referrer"
//                           style={{
//                             width: '60px',
//                             height: '60px',
//                             objectFit: 'cover',
//                             borderRadius: '4px',
//                             border: '1px solid #ddd',
//                             backgroundColor: '#f9f9f9'
//                           }}
//                         />
//                         {preview.is_primary && (
//                           <Box sx={{
//                             position: 'absolute',
//                             top: '-5px',
//                             right: '-5px',
//                             background: COLORS.primary,
//                             color: 'white',
//                             borderRadius: '50%',
//                             width: '20px',
//                             height: '20px',
//                             fontSize: '12px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}>✓</Box>
//                         )}
//                       </Box>
//                     ))}
//                   </Box>
//                 ) : (
//                   <Typography variant="body2" color="text.secondary" fontStyle="italic">No images uploaded.</Typography>
//                 )}
//               </CardContent>
//             </Card>
//             <Typography variant="body2" color="text.secondary" fontStyle="italic">Please review all information before submitting.</Typography>
//           </Box>
//         );
//       default: return null;
//     }
//   };

//   return (
//     <Box sx={{ p: { xs: 1, sm: 2 }, width: '100%', maxWidth: '100%' }}>
//       {/* Header */}
//       <Box sx={{
//         display: 'flex',
//         flexDirection: { xs: 'column', sm: 'row' },
//         justifyContent: 'space-between',
//         alignItems: { xs: 'flex-start', sm: 'center' },
//         mb: 3,
//         pb: 2,
//         borderBottom: `1px solid ${COLORS.border}`,
//         gap: 2
//       }}>
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
//             Create New Package
//           </Typography>
//           <Typography variant="body2" sx={{ color: COLORS.textSecondary, mt: 1 }}>
//             Complete all steps to create a new tour package
//           </Typography>
//         </Box>
//         <Button onClick={() => navigate('/admin/packages')} variant="outlined" fullWidth={{ xs: true, sm: false }} sx={{ borderColor: COLORS.primary, color: COLORS.primary, px: 3, py: 1, fontWeight: 600, textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: COLORS.primaryLight }, minWidth: { xs: '100%', sm: 'auto' } }}>
//           Cancel
//         </Button>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', width: '100%' }} onClose={() => dispatch({ type: 'packages/clearError' })}>{error}</Alert>
//       )}

//       {/* Stepper & Form Paper */}
//       <Paper sx={{
//         p: { xs: 2, sm: 3, md: 4 },
//         backgroundColor: COLORS.background,
//         borderRadius: '12px',
//         boxShadow: COLORS.cardShadow,
//         border: `1px solid ${COLORS.border}`,
//         mb: 4,
//         width: '100%',
//         boxSizing: 'border-box'
//       }}>
//         {/* Mobile-Optimized Stepper */}
//         <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
//           {steps.map((step, index) => (
//             <Step key={step.label}>
//               <StepLabel
//                 sx={{
//                   '& .MuiStepLabel-label': {
//                     fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.9rem' },
//                     fontWeight: 500,
//                     color: COLORS.textSecondary,
//                     '&.Mui-active': { color: COLORS.primary },
//                     '&.Mui-completed': { color: COLORS.success },
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis'
//                   },
//                   '& .MuiStepIcon-root': {
//                     fontSize: { xs: 18, sm: 22 },
//                     color: COLORS.border,
//                     '&.Mui-active': { color: COLORS.primary },
//                     '&.Mui-completed': { color: COLORS.success }
//                   }
//                 }}
//               >
//                 <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
//                   <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{step.label}</Typography>
//                   <Typography variant="caption" sx={{ color: COLORS.textSecondary, display: { xs: 'none', md: 'block' } }}>{step.description}</Typography>
//                 </Box>
//                 <Typography variant="caption" sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center', mt: 0.5, fontSize: '0.6rem' }}>
//                   {step.label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         <Box sx={{ minHeight: { xs: '300px', sm: '400px' }, width: '100%' }}>
//           {getStepContent(activeStep)}
//         </Box>

//         {/* Navigation Buttons */}
//         <Box sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column-reverse', sm: 'row' },
//           justifyContent: 'space-between',
//           gap: 2,
//           mt: 4,
//           pt: 3,
//           borderTop: `1px solid ${COLORS.border}`
//         }}>
//           <Button disabled={activeStep === 0} onClick={prevStep} variant="outlined" fullWidth={{ xs: true, sm: false }} sx={{ borderColor: COLORS.border, color: COLORS.text, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: COLORS.primary, color: COLORS.primary } }}>
//             Back
//           </Button>

//           <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
//             {activeStep === steps.length - 1 ? (
//               <Button onClick={handleSubmit} disabled={isSubmitting} variant="contained" fullWidth={{ xs: true, sm: false }} sx={{ backgroundColor: COLORS.primary, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, minWidth: { xs: 'auto', sm: '160px' }, '&:hover': { backgroundColor: '#1565c0' } }}>
//                 {isSubmitting ? 'Creating...' : 'Create Package'}
//               </Button>
//             ) : (
//               <Button onClick={handleNextStep} variant="contained" fullWidth={{ xs: true, sm: false }} sx={{ backgroundColor: COLORS.primary, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, minWidth: { xs: 'auto', sm: '160px' }, '&:hover': { backgroundColor: '#1565c0' } }}>
//                 Next
//               </Button>
//             )}
//           </Box>
//         </Box>
//       </Paper>

//       <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '8px', fontWeight: 500 }}>{snackbar.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }



import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPackage } from '../../features/packages/packageSlice';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  Chip,
  Card,
  CardContent,
  FormHelperText,
  CircularProgress
} from '@mui/material';
// ✅ Import Leaflet Components
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon issue in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const COLORS = {
  primary: '#1976d2',
  primaryLight: '#e3f2fd',
  success: '#2e7d32',
  error: '#c62828',
  text: '#000',
  textSecondary: '#555',
  background: '#fff',
  border: '#e0e0e0',
  cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

// ✅ UPDATED: Added Location Map Step
const steps = [
  { label: 'Info', description: 'Title, destination, duration' },
  { label: 'Price', description: 'Prices, capacity' },
  { label: 'Content', description: 'Inclusions, itinerary' },
  { label: 'Location Map', description: 'Pick location on map' },
  { label: 'Media', description: 'Upload images' },
  { label: 'Review', description: 'Final check' }
];

// ✅ Component to handle map clicks inside the form
function LocationPicker({ onLocationSelect, initialLat, initialLng }) {
  const [markerPosition, setMarkerPosition] = useState(
    initialLat && initialLng ? [parseFloat(initialLat), parseFloat(initialLng)] : [-1.2921, 36.8219]
  );
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const map = useMap();

  const handleSearch = useCallback(async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const results = await res.json();
      setSuggestions(results || []);
    } catch (err) {
      console.error('Search error', err);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    const id = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, handleSearch]);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onLocationSelect(lat, lng, 'Searching address...');
      
      // Fetch Address from OpenStreetMap (Nominatim) - FIXED URL
      setIsFetchingAddress(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        onLocationSelect(lat, lng, address);
      } catch (error) {
        console.error("Error fetching address:", error);
        onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      } finally {
        setIsFetchingAddress(false);
      }
    },
  });

  return (
    <>
      {/* search input overlay */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        background: 'white',
        padding: '4px 6px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <Button size="small" variant="contained" onClick={handleSearch}>Go</Button>
      </div>
      {suggestions.length > 0 && (
        <Paper sx={{
          position: 'absolute',
          top: 40,
          left: 10,
          zIndex: 1100,
          width: 250,
          maxHeight: 150,
          overflowY: 'auto'
        }}>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              style={{ padding: '4px', cursor: 'pointer' }}
              onClick={() => {
                const { lat, lon, display_name } = item;
                const newPos = [parseFloat(lat), parseFloat(lon)];
                setMarkerPosition(newPos);
                map.setView(newPos, 13);
                onLocationSelect(lat, lon, display_name);
                setSuggestions([]);
              }}
            >
              {item.display_name}
            </div>
          ))}
        </Paper>
      )}

      <Marker 
        position={markerPosition} 
        draggable={true} 
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            setMarkerPosition([lat, lng]);
            onLocationSelect(lat, lng, 'Address updated via drag');
          }
        }} 
      />
      {isFetchingAddress && (
        <div style={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 1000, 
          background: 'white', 
          padding: '5px 10px', 
          borderRadius: '4px', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
        }}>
          <CircularProgress size={20} /> <span style={{ fontSize: '12px' }}>Finding address...</span>
        </div>
      )}
    </>
  );
}

export default function CreatePackage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.packages);

  const [activeStep, setActiveStep] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration_days: '',
    duration_nights: '',
    category: 'wildlife',
    price_adult: '',
    price_child: '',
    max_capacity: 20,
    status: 'published',
    is_featured: false,
    inclusions: '',
    exclusions: '',
    itinerary: '',
    images: [],
    // Location Fields
    location_lat: '',
    location_lng: '',
    location_address: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate nights when days change
  useEffect(() => {
    if (formData.duration_days && !formData.duration_nights) {
      const days = parseInt(formData.duration_days);
      if (days > 0) {
        setFormData(prev => ({ ...prev, duration_nights: days - 1 }));
      }
    }
  }, [formData.duration_days]);

  const validateField = useCallback((name, value) => {
    let error = '';
    switch (name) {
      case 'title':
        if (!value.trim()) error = 'Package title is required';
        else if (value.length < 5) error = 'Title must be at least 5 characters';
        break;
      case 'description':
        if (!value.trim()) error = 'Short description is required';
        else if (value.length < 10) error = 'Description must be at least 10 characters';
        break;
      case 'destination':
        if (!value.trim()) error = 'Destination is required';
        break;
      case 'duration_days':
        if (!value) error = 'Duration is required';
        else if (parseInt(value) < 1) error = 'Duration must be at least 1 day';
        break;
      case 'location_lat':
        if (value && (parseFloat(value) < -90 || parseFloat(value) > 90)) error = 'Invalid Latitude (-90 to 90)';
        break;
      case 'location_lng':
        if (value && (parseFloat(value) < -180 || parseFloat(value) > 180)) error = 'Invalid Longitude (-180 to 180)';
        break;
      case 'price_adult':
        if (!value) error = 'Adult price is required';
        else if (parseFloat(value) <= 0) error = 'Price must be greater than 0';
        break;
      case 'category':
      case 'status':
        if (!value) error = 'This field is required';
        break;
      default: break;
    }
    return error;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // ✅ Handler for Map Selection
  const handleMapLocationSelect = (lat, lng, address) => {
    setFormData(prev => ({
      ...prev,
      location_lat: lat.toString(),
      location_lng: lng.toString(),
      location_address: address
    }));
    if (errors.location_lat) setErrors(prev => ({ ...prev, location_lat: '' }));
    if (errors.location_lng) setErrors(prev => ({ ...prev, location_lng: '' }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      caption: '',
      is_primary: imagePreviews.length === 0
    }));
    setImagePreviews(prev => [...prev, ...newImages]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const updateImageCaption = (index, caption) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index].caption = caption;
    setImagePreviews(updatedPreviews);
    const updatedImages = [...formData.images];
    updatedImages[index].caption = caption;
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const togglePrimaryImage = (index) => {
    const updatedPreviews = imagePreviews.map((img, i) => ({ ...img, is_primary: i === index }));
    setImagePreviews(updatedPreviews);
    const updatedImages = formData.images.map((img, i) => ({ ...img, is_primary: i === index }));
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const nextStep = () => { if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1); };
  const prevStep = () => { if (activeStep > 0) setActiveStep(prev => prev - 1); };

  const isStepValid = useCallback((stepIndex) => {
    switch (stepIndex) {
      case 0: 
        return !validateField('title', formData.title) && 
               !validateField('description', formData.description) && 
               !validateField('destination', formData.destination) && 
               !validateField('duration_days', formData.duration_days) && 
               !validateField('category', formData.category);
      case 1: 
        return !validateField('price_adult', formData.price_adult) && 
               !validateField('status', formData.status);
      default: return true;
    }
  }, [formData, validateField]);

  const handleNextStep = () => {
    if (isStepValid(activeStep)) {
      nextStep();
    } else {
      const newErrors = {};
      if (activeStep === 0) {
        newErrors.title = validateField('title', formData.title);
        newErrors.destination = validateField('destination', formData.destination);
        newErrors.duration_days = validateField('duration_days', formData.duration_days);
        newErrors.category = validateField('category', formData.category);
      } else if (activeStep === 1) {
        newErrors.price_adult = validateField('price_adult', formData.price_adult);
        newErrors.status = validateField('status', formData.status);
      }
      setErrors(newErrors);
    }
  };

  // ✅ IMPROVED: Convert comma-separated or JSON input to proper JSON array string
  const parseOrWrap = (val) => {
    if (!val || !val.trim()) return '[]';
    try {
      // If already valid JSON, re-stringify it cleanly
      const parsed = JSON.parse(val);
      return JSON.stringify(Array.isArray(parsed) ? parsed : [parsed]);
    } catch (e) {
      // If comma-separated, split and trim each item, filter empty
      if (val.includes(',')) {
        return JSON.stringify(
          val.split(',')
            .map(s => s.trim())
            .filter(s => s)
        );
      }
      // Single value - wrap in array
      return JSON.stringify([val.trim()]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('destination', formData.destination);
      formDataToSend.append('duration_days', parseInt(formData.duration_days) || 1);
      formDataToSend.append('duration_nights', formData.duration_nights ? parseInt(formData.duration_nights) : null);
      
      // ✅ Handle location object
      const locationObj = {
        lat: formData.location_lat ? parseFloat(formData.location_lat) : null,
        lng: formData.location_lng ? parseFloat(formData.location_lng) : null,
        address: formData.location_address || formData.destination
      };
      if (locationObj.lat || locationObj.address) {
        formDataToSend.append('location', JSON.stringify(locationObj));
      }

      formDataToSend.append('price_adult', parseFloat(formData.price_adult));
      formDataToSend.append('price_child', formData.price_child ? parseFloat(formData.price_child) : 0);
      formDataToSend.append('max_capacity', parseInt(formData.max_capacity) || 20);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('is_featured', formData.is_featured);

      // ✅ Convert comma-separated inputs to JSON arrays
      formDataToSend.append('inclusions', parseOrWrap(formData.inclusions));
      formDataToSend.append('exclusions', parseOrWrap(formData.exclusions));
      formDataToSend.append('itinerary', parseOrWrap(formData.itinerary));

      const imagesPayload = imagePreviews.map((img) => ({
        id: null,
        url: null,
        caption: img.caption || '',
        is_primary: img.is_primary || false
      }));
      formDataToSend.append('images', JSON.stringify(imagesPayload));

      imagePreviews.forEach((img) => {
        if (img.file) {
          formDataToSend.append('newImages', img.file);
        }
      });

      await dispatch(createPackage(formDataToSend)).unwrap();

      setSnackbar({ open: true, message: 'Package created successfully!', severity: 'success' });
      setTimeout(() => navigate('/admin/packages'), 1500);

    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to create package', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const getStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Package Title *" name="title" value={formData.title} onChange={handleInputChange} error={!!errors.title} helperText={errors.title} required variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Short Description *" name="description" value={formData.description} onChange={handleInputChange} error={!!errors.description} helperText={errors.description} required variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Destination *" name="destination" value={formData.destination} onChange={handleInputChange} error={!!errors.destination} helperText={errors.destination} required variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Duration (Days) *" name="duration_days" type="number" value={formData.duration_days} onChange={handleInputChange} error={!!errors.duration_days} helperText={errors.duration_days} required inputProps={{ min: "1", max: "365" }} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
              <FormControl fullWidth error={!!errors.category} sx={{ width: '100%' }}>
                <InputLabel>Category *</InputLabel>
                <Select name="category" value={formData.category} label="Category *" onChange={handleInputChange} required sx={{ width: '100%' }}>
                  <MenuItem value="adventure">Adventure</MenuItem>
                  <MenuItem value="cultural">Cultural</MenuItem>
                  <MenuItem value="beach">Beach</MenuItem>
                  <MenuItem value="wildlife">Wildlife</MenuItem>
                  <MenuItem value="luxury">Luxury</MenuItem>
                  <MenuItem value="budget">Budget</MenuItem>
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="honeymoon">Honeymoon</MenuItem>
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1: // Pricing
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Adult Price (KES) *" name="price_adult" type="number" value={formData.price_adult} onChange={handleInputChange} error={!!errors.price_adult} helperText={errors.price_adult} required variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Child Price (KES)" name="price_child" type="number" value={formData.price_child} onChange={handleInputChange} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Duration (Nights)" name="duration_nights" type="number" value={formData.duration_nights} onChange={handleInputChange} helperText={`Defaults to ${formData.duration_days ? parseInt(formData.duration_days) - 1 : 0} if empty`} inputProps={{ min: "0" }} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Max Capacity" name="max_capacity" type="number" value={formData.max_capacity} onChange={handleInputChange} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
              <FormControl fullWidth error={!!errors.status} sx={{ width: '100%' }}>
                <InputLabel>Status *</InputLabel>
                <Select name="status" value={formData.status} label="Status *" onChange={handleInputChange} required sx={{ width: '100%' }}>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%', mt: 1 }}>
              <FormControlLabel control={<Switch checked={formData.is_featured} onChange={handleCheckboxChange} name="is_featured" />} label="Featured Package" />
            </Grid>
          </Grid>
        );

      case 2: // Content - Comma-separated inputs
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <Alert severity="info" sx={{ mb: 2, fontSize: '0.85rem' }}>
                💡 <strong>Tip:</strong> Enter items separated by commas (e.g., "Accommodation, Meals, Transport") or paste valid JSON.
              </Alert>
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Inclusions" name="inclusions" value={formData.inclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" sx={{ width: '100%' }} placeholder="Accommodation, Meals, Park Fees" helperText="Comma-separated list or JSON array" />
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Exclusions" name="exclusions" value={formData.exclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" sx={{ width: '100%' }} placeholder="Flights, Tips, Personal Expenses" helperText="Comma-separated list or JSON array" />
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Itinerary" name="itinerary" value={formData.itinerary} onChange={handleInputChange} multiline rows={6} variant="outlined" sx={{ width: '100%' }} placeholder='{"day": 1, "title": "Arrival"} OR Day 1: Arrival, Day 2: Safari' helperText="Comma-separated day objects OR JSON array" />
            </Grid>
          </Grid>
        );

      // ✅ NEW STEP: Location Map
      case 3: 
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>📍 Pick Location on Map</Typography>
              <Paper sx={{ height: 400, width: '100%', mb: 2, overflow: 'hidden', borderRadius: '8px' }}>
                <MapContainer center={[formData.location_lat ? parseFloat(formData.location_lat) : -1.2921, formData.location_lng ? parseFloat(formData.location_lng) : 36.8219]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker 
                    onLocationSelect={handleMapLocationSelect} 
                    initialLat={formData.location_lat} 
                    initialLng={formData.location_lng} 
                  />
                </MapContainer>
              </Paper>
              <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
                Click anywhere on the map or drag the marker to set the tour starting point. Coordinates will update automatically.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Latitude" name="location_lat" type="number" inputProps={{ step: "any" }} value={formData.location_lat} onChange={handleInputChange} error={!!errors.location_lat} helperText={errors.location_lat} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Longitude" name="location_lng" type="number" inputProps={{ step: "any" }} value={formData.location_lng} onChange={handleInputChange} error={!!errors.location_lng} helperText={errors.location_lng} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Address Label" name="location_address" value={formData.location_address} onChange={handleInputChange} placeholder="e.g., Nairobi National Park Gate" variant="outlined" sx={{ width: '100%' }} />
            </Grid>
          </Grid>
        );

      case 4: // Media
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Package Images</Typography>
              <Button variant="outlined" component="label" fullWidth sx={{ borderColor: COLORS.primary, color: COLORS.primary, py: 1.5, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: COLORS.primaryLight } }}>
                Upload Images
                <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </Button>
            </Grid>
            {imagePreviews.length > 0 && (
              <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
                <Grid container spacing={2}>
                  {imagePreviews.map((preview, index) => (
                    <Grid item xs={6} sm={4} key={index} sx={{ display: 'block', width: '100%' }}>
                      <Paper sx={{ p: 1, borderRadius: '8px', border: `1px solid ${COLORS.border}`, position: 'relative' }}>
                        <img 
                          src={preview.url} 
                          alt={`Preview ${index}`} 
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer" 
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} 
                          onError={(e) => {
                            console.error('❌ IMAGE FAILED TO LOAD:', preview.url);
                            e.target.style.display = 'none';
                          }}
                        />
                        <TextField fullWidth size="small" placeholder="Caption" value={preview.caption} onChange={(e) => updateImageCaption(index, e.target.value)} sx={{ mt: 1 }} />
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                          <Button size="small" variant={preview.is_primary ? "contained" : "outlined"} onClick={() => togglePrimaryImage(index)} sx={{ fontSize: '0.65rem', px: 1, minWidth: 'auto', ...(preview.is_primary && { backgroundColor: COLORS.primary }) }}>
                            {preview.is_primary ? '✓' : 'Set'}
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => removeImage(index)} sx={{ fontSize: '0.65rem', px: 1, minWidth: 'auto' }}>Remove</Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        );
      
      case 5: // Review - MUI Consistent Styling
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Review Your Package</Typography>
            
            {/* Basic Info Card */}
            <Card sx={{ mb: 3, border: `1px solid ${COLORS.border}` }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: COLORS.primary }}>Basic Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Title:</strong> {formData.title || '—'}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Description:</strong> <em>{formData.description || '—'}</em></Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Destination:</strong> {formData.destination || '—'}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Duration:</strong> {formData.duration_days || '—'} Days / {formData.duration_nights || '?'} Nights</Typography></Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Category:</strong> </Typography>
                    <Chip label={formData.category} size="small" sx={{ ml: 1 }} />
                  </Grid>
                  {formData.location_lat && formData.location_lng && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="success.main">
                        <strong>📍 Map:</strong> {formData.location_address || 'Coordinates set'} ({formData.location_lat}, {formData.location_lng})
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card sx={{ mb: 3, border: `1px solid ${COLORS.border}` }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: COLORS.primary }}>Pricing & Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Adult Price:</strong> KES {formData.price_adult ? parseFloat(formData.price_adult).toLocaleString() : '—'}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Child Price:</strong> KES {formData.price_child ? parseFloat(formData.price_child).toLocaleString() : '—'}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Max Capacity:</strong> {formData.max_capacity}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Inclusions:</strong> <em>{formData.inclusions || 'None specified'}</em></Typography></Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Media Card */}
            <Card sx={{ mb: 3, border: `1px solid ${COLORS.border}` }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: COLORS.primary }}>Media</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}><strong>Images Uploaded:</strong> {imagePreviews.length}</Typography>
                {imagePreviews.length > 0 ? (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {imagePreviews.map((preview, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={preview.url}
                          alt={`Preview ${index}`}
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f9f9f9'
                          }}
                        />
                        {preview.is_primary && (
                          <Box sx={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: COLORS.primary,
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>✓</Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">No images uploaded.</Typography>
                )}
              </CardContent>
            </Card>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">Please review all information before submitting.</Typography>
          </Box>
        );
      default: return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        pb: 2,
        borderBottom: `1px solid ${COLORS.border}`,
        gap: 2
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
            Create New Package
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textSecondary, mt: 1 }}>
            Complete all steps to create a new tour package
          </Typography>
        </Box>
        <Button onClick={() => navigate('/admin/packages')} variant="outlined" fullWidth={{ xs: true, sm: false }} sx={{ borderColor: COLORS.primary, color: COLORS.primary, px: 3, py: 1, fontWeight: 600, textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: COLORS.primaryLight }, minWidth: { xs: '100%', sm: 'auto' } }}>
          Cancel
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', width: '100%' }} onClose={() => dispatch({ type: 'packages/clearError' })}>{error}</Alert>
      )}

      {/* Stepper & Form Paper */}
      <Paper sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: COLORS.background,
        borderRadius: '12px',
        boxShadow: COLORS.cardShadow,
        border: `1px solid ${COLORS.border}`,
        mb: 4,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Mobile-Optimized Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.9rem' },
                    fontWeight: 500,
                    color: COLORS.textSecondary,
                    '&.Mui-active': { color: COLORS.primary },
                    '&.Mui-completed': { color: COLORS.success },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: { xs: 18, sm: 22 },
                    color: COLORS.border,
                    '&.Mui-active': { color: COLORS.primary },
                    '&.Mui-completed': { color: COLORS.success }
                  }
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{step.label}</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.textSecondary, display: { xs: 'none', md: 'block' } }}>{step.description}</Typography>
                </Box>
                <Typography variant="caption" sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center', mt: 0.5, fontSize: '0.6rem' }}>
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: { xs: '300px', sm: '400px' }, width: '100%' }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          justifyContent: 'space-between',
          gap: 2,
          mt: 4,
          pt: 3,
          borderTop: `1px solid ${COLORS.border}`
        }}>
          <Button disabled={activeStep === 0} onClick={prevStep} variant="outlined" fullWidth={{ xs: true, sm: false }} sx={{ borderColor: COLORS.border, color: COLORS.text, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: COLORS.primary, color: COLORS.primary } }}>
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} variant="contained" fullWidth={{ xs: true, sm: false }} sx={{ backgroundColor: COLORS.primary, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, minWidth: { xs: 'auto', sm: '160px' }, '&:hover': { backgroundColor: '#1565c0' } }}>
                {isSubmitting ? 'Creating...' : 'Create Package'}
              </Button>
            ) : (
              <Button onClick={handleNextStep} variant="contained" fullWidth={{ xs: true, sm: false }} sx={{ backgroundColor: COLORS.primary, py: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, minWidth: { xs: 'auto', sm: '160px' }, '&:hover': { backgroundColor: '#1565c0' } }}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '8px', fontWeight: 500 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}