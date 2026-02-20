import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPackageById, updatePackage } from '../../features/packages/packageSlice';
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
  CircularProgress,
  Backdrop
} from '@mui/material';

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

const steps = [
  { label: 'Info', description: 'Title, desc, destination' },
  { label: 'Price', description: 'Prices, capacity' },
  { label: 'Content', description: 'Inclusions, itinerary' },
  { label: 'Media', description: 'Upload images' },
  { label: 'Review', description: 'Final check' }
];

export default function EditPackage() {
  const { id } = useParams(); // Get UUID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selectors
  const { currentPackage, loading, error, updateLoading } = useSelector((state) => state.packages);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration_days: '',
    category: 'wildlife',
    price_adult: '',
    price_child: '',
    max_capacity: 20,
    status: 'published',
    is_featured: false,
    inclusions: '',
    exclusions: '',
    itinerary: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1. Fetch Data on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await dispatch(fetchPackageById(id)).unwrap();
        
        // Map API response to form state
        if (result) {
          setFormData({
            title: result.title || '',
            description: result.description || '',
            destination: result.destination || '',
            duration_days: result.duration_days || '',
            category: result.category || 'wildlife',
            price_adult: result.price_adult || '',
            price_child: result.price_child || '',
            max_capacity: result.max_capacity || 20,
            status: result.status || 'published',
            is_featured: result.is_featured || false,
            inclusions: result.inclusions || '',
            exclusions: result.exclusions || '',
            itinerary: result.itinerary || '',
            images: [] // We will handle images separately
          });

          // Map existing images from DB to previews
          if (result.PackageImages && Array.isArray(result.PackageImages)) {
            const mappedImages = result.PackageImages.map(img => ({
              id: img.id, // Keep DB ID for updates/deletes
              url: img.url,
              caption: img.caption || '',
              is_primary: img.is_primary || false,
              existing: true // Flag to identify DB images vs new uploads
            }));
            setImagePreviews(mappedImages);
          }
          setIsDataLoaded(true);
        }
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to load package details', severity: 'error' });
        console.error(err);
      }
    };

    loadData();
  }, [id, dispatch]);

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
      case 'price_adult':
        if (!value) error = 'Adult price is required';
        else if (parseFloat(value) <= 0) error = 'Price must be greater than 0';
        break;
      case 'category':
        if (!value) error = 'Category is required';
        break;
      case 'status':
        if (!value) error = 'Status is required';
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
      is_primary: imagePreviews.length === 0,
      existing: false // New upload
    }));
    setImagePreviews(prev => [...prev, ...newImages]);
    // Note: We don't add to formData.images here, we handle it in submit
  };

  const updateImageCaption = (index, caption) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index].caption = caption;
    setImagePreviews(updatedPreviews);
  };

  const togglePrimaryImage = (index) => {
    const updatedPreviews = imagePreviews.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    setImagePreviews(updatedPreviews);
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    
    // If removing an existing DB image, you might want to track it for deletion
    // For now, we just remove from preview. The backend logic should handle 
    // syncing the final list.
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
        newErrors.description = validateField('description', formData.description);
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare Image Payload
      // We send the full list of images. 
      // Backend should: 
      // 1. Keep images with IDs that are in this list.
      // 2. Update captions/primary flags.
      // 3. Upload new images (those without IDs).
      // 4. Delete images that were in DB but are NOT in this list.
      const imagesPayload = imagePreviews.map(img => ({
        id: img.existing ? img.id : undefined, // Send ID only for existing
        url: img.existing ? img.url : undefined, // URL might be needed for existing if changed, usually not
        caption: img.caption,
        is_primary: img.is_primary,
        file: img.file // Only present for new uploads
      }));

      const packageData = {
        ...formData,
        price_adult: parseFloat(formData.price_adult),
        price_child: formData.price_child ? parseFloat(formData.price_child) : 0,
        duration_days: parseInt(formData.duration_days) || 1,
        max_capacity: parseInt(formData.max_capacity) || 20,
        images: imagesPayload
      };

      const resultAction = await dispatch(updatePackage({ id, data: packageData })).unwrap();

      setSnackbar({ 
        open: true, 
        message: 'Package updated successfully!', 
        severity: 'success' 
      });
      setTimeout(() => navigate('/admin/packages'), 1500);

    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to update package', 
        severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Show Loading Spinner while fetching data
  if (!isDataLoaded && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0: // Basic Info
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Package Title *" name="title" value={formData.title} onChange={handleInputChange} error={!!errors.title} helperText={errors.title} required variant="outlined" />
//             </Grid>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Short Description *" name="description" value={formData.description} onChange={handleInputChange} error={!!errors.description} helperText={errors.description} required variant="outlined" multiline rows={3} />
//             </Grid>
//             <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Destination *" name="destination" value={formData.destination} onChange={handleInputChange} error={!!errors.destination} helperText={errors.destination} required variant="outlined" />
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <TextField fullWidth label="Duration (Days) *" name="duration_days" type="number" value={formData.duration_days} onChange={handleInputChange} error={!!errors.duration_days} helperText={errors.duration_days} required inputProps={{ min: "1", max: "365" }} variant="outlined" />
//             </Grid>
//             <Grid item xs={12} sm={6} sx={{ display: 'block', width: '100%' }}>
//               <FormControl fullWidth error={!!errors.category}>
//                 <InputLabel>Category *</InputLabel>
//                 <Select name="category" value={formData.category} label="Category *" onChange={handleInputChange} required>
//                   <MenuItem value="adventure">Adventure</MenuItem>
//                   <MenuItem value="cultural">Cultural</MenuItem>
//                   <MenuItem value="beach">Beach</MenuItem>
//                   <MenuItem value="wildlife">Wildlife</MenuItem>
//                   <MenuItem value="luxury">Luxury</MenuItem>
//                   <MenuItem value="budget">Budget</MenuItem>
//                 </Select>
//                 {errors.category && <Typography variant="caption" sx={{ color: '#f44336', mt: '8px' }}>{errors.category}</Typography>}
//               </FormControl>
//             </Grid>
//           </Grid>
//         );

//       case 1: // Pricing
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Adult Price (KES) *" name="price_adult" type="number" value={formData.price_adult} onChange={handleInputChange} error={!!errors.price_adult} helperText={errors.price_adult} required variant="outlined" /></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Child Price (KES)" name="price_child" type="number" value={formData.price_child} onChange={handleInputChange} variant="outlined" /></Grid>
//             <Grid item xs={12} sm={6}><TextField fullWidth label="Max Capacity" name="max_capacity" type="number" value={formData.max_capacity} onChange={handleInputChange} variant="outlined" /></Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={!!errors.status}>
//                 <InputLabel>Status *</InputLabel>
//                 <Select name="status" value={formData.status} label="Status *" onChange={handleInputChange} required>
//                   <MenuItem value="draft">Draft</MenuItem>
//                   <MenuItem value="published">Published</MenuItem>
//                   <MenuItem value="archived">Archived</MenuItem>
//                 </Select>
//                 {errors.status && <Typography variant="caption" sx={{ color: '#f44336', mt: '8px' }}>{errors.status}</Typography>}
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}><FormControlLabel control={<Switch checked={formData.is_featured} onChange={handleCheckboxChange} name="is_featured" />} label="Featured Package" /></Grid>
//           </Grid>
//         );

//       case 2: // Content
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12}><TextField fullWidth label="Inclusions" name="inclusions" value={formData.inclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" /></Grid>
//             <Grid item xs={12}><TextField fullWidth label="Exclusions" name="exclusions" value={formData.exclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" /></Grid>
//             <Grid item xs={12}><TextField fullWidth label="Itinerary" name="itinerary" value={formData.itinerary} onChange={handleInputChange} multiline rows={4} variant="outlined" /></Grid>
//           </Grid>
//         );

//       case 3: // Media
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Package Images</Typography>
//               <Button variant="outlined" component="label" fullWidth sx={{ borderColor: COLORS.primary, color: COLORS.primary, py: 1.5, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: COLORS.primaryLight } }}>
//                 Upload More Images
//                 <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
//               </Button>
//             </Grid>
//             {imagePreviews.length > 0 && (
//               <Grid item xs={12}>
//                 <Grid container spacing={2}>
//                   {imagePreviews.map((preview, index) => (
//                     <Grid item xs={6} sm={4} key={index} sx={{ display: 'block', width: '100%' }}>
//                       <Paper sx={{ p: 1, borderRadius: '8px', border: `1px solid ${COLORS.border}`, position: 'relative' }}>
//                         {preview.existing && (
//                           <Chip label="Existing" size="small" color="primary" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, fontSize: '0.6rem' }} />
//                         )}
//                         <img src={preview.url} alt={`Preview ${index}`} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
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

//       case 4: // Review
//         return (
//           <Box sx={{ width: '100%' }}>
//             <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Review Changes</Typography>
//             <Card sx={{ mb: 2, border: `1px solid ${COLORS.border}` }}>
//               <CardContent>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: COLORS.primary }}>Basic Information</Typography>
//                 <Grid container spacing={1}>
//                   <Grid item xs={12}><Typography variant="body2"><strong>Title:</strong> {formData.title}</Typography></Grid>
//                   <Grid item xs={12}><Typography variant="body2"><strong>Description:</strong> {formData.description}</Typography></Grid>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Destination:</strong> {formData.destination}</Typography></Grid>
//                   <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Duration:</strong> {formData.duration_days} days</Typography></Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//             <Card sx={{ mb: 2, border: `1px solid ${COLORS.border}` }}>
//               <CardContent>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: COLORS.primary }}>Media</Typography>
//                 <Typography variant="body2"><strong>Total Images:</strong> {imagePreviews.length}</Typography>
//                 {imagePreviews.length > 0 && (
//                   <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
//                     {imagePreviews.slice(0, 5).map((p, i) => (
//                       <img key={i} src={p.url} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
//                     ))}
//                   </Box>
//                 )}
//               </CardContent>
//             </Card>
//           </Box>
//         );

//       default: return null;
//     }
//   };
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
                </Select>
                {errors.category && <Typography variant="caption" sx={{ color: '#f44336', mt: '8px' }}>{errors.category}</Typography>}
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
                {errors.status && <Typography variant="caption" sx={{ color: '#f44336', mt: '8px' }}>{errors.status}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%', mt: 1 }}>
              <FormControlLabel control={<Switch checked={formData.is_featured} onChange={handleCheckboxChange} name="is_featured" />} label="Featured Package" />
            </Grid>
          </Grid>
        );

      case 2: // Content
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Inclusions" name="inclusions" value={formData.inclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Exclusions" name="exclusions" value={formData.exclusions} onChange={handleInputChange} multiline rows={3} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'block', width: '100%' }}>
              <TextField fullWidth label="Itinerary" name="itinerary" value={formData.itinerary} onChange={handleInputChange} multiline rows={4} variant="outlined" sx={{ width: '100%' }} />
            </Grid>
          </Grid>
        );

      case 3: // Media
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
                      <Paper sx={{ p: 1, borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                        <img src={preview.url} alt={`Preview ${index}`} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
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
      case 4: // Review
        return (
          <div className="w-100">
            <h4 className="mb-4">Review Your Package</h4>

            {/* Basic Info Card */}
            <div className="card mb-3 border">
              <div className="card-body">
                <h6 className="card-subtitle mb-3 text-primary fw-bold">Basic Information</h6>
                <div className="row g-2">
                  <div className="col-12 col-md-6"><p className="mb-1"><strong>Title:</strong> {formData.title || '—'}</p></div>
                   <div className="col-12 col-md-6"><p className="mb-1"><strong>Description:</strong> <em className="text-muted">{formData.description || '—'}</em></p></div>
                  <div className="col-12 col-md-6"><p className="mb-1"><strong>Destination:</strong> {formData.destination || '—'}</p></div>
                  <div className="col-12 col-md-6"><p className="mb-1"><strong>Duration:</strong> {formData.duration_days || '—'} days</p></div>
                  <div className="col-12 col-md-6">
                    <strong>Category:</strong> <span className="badge bg-secondary ms-1">{formData.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="card mb-3 border">
              <div className="card-body">
                <h6 className="card-subtitle mb-3 text-primary fw-bold">Pricing & Details</h6>
                <div className="row g-2">
                  <div className="col-12 col-md-6"><p className="mb-1"><strong>Adult Price:</strong> KES {formData.price_adult ? parseFloat(formData.price_adult).toLocaleString() : '—'}</p></div>
                  <div className="col-12 col-md-6"><p className="mb-1"><strong>Child Price:</strong> KES {formData.price_child ? parseFloat(formData.price_child).toLocaleString() : '—'}</p></div>
                  <div className="col-12 col-md-6"><p className="mb-1"><strong>Max Capacity:</strong> {formData.max_capacity}</p></div>
                  <div className="col-12 col-md-6"><p className="mb-1"><strong>Inclusions:</strong> <em className="text-muted">{formData.inclusions || 'None specified'}</em></p></div>
                </div>
              </div>
            </div>

            {/* Media Card - FIXED IMAGE HANDLING */}
            <div className="card mb-3 border">
              <div className="card-body">
                <h6 className="card-subtitle mb-3 text-primary fw-bold">Media</h6>
                <p className="mb-2"><strong>Images Uploaded:</strong> {imagePreviews.length}</p>

                {imagePreviews.length > 0 ? (
                  <div className="d-flex gap-2 flex-wrap">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={preview.url}
                          alt={`Preview ${index}`}
                          onError={(e) => {
                            // FALLBACK: If blob URL fails, show a placeholder icon
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                          }}
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
                          <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: '#1976d2',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted fst-italic">No images uploaded.</p>
                )}
              </div>
            </div>

            <p className="text-muted fst-italic small">Please review all information before submitting.</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: `1px solid ${COLORS.border}` }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>Edit Package</Typography>
          <Typography variant="body2" sx={{ color: COLORS.textSecondary, mt: 1 }}>Update details for "{formData.title || '...'}"</Typography>
        </Box>
        <Button onClick={() => navigate('/admin/packages')} variant="outlined" sx={{ borderColor: COLORS.primary, color: COLORS.primary, borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '12px', boxShadow: COLORS.cardShadow, border: `1px solid ${COLORS.border}` }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: { xs: '0.7rem', sm: '0.85rem' } } }}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: '300px', mb: 4 }}>{getStepContent(activeStep)}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${COLORS.border}`, pt: 3 }}>
          <Button disabled={activeStep === 0} onClick={prevStep} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>Back</Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting || updateLoading} variant="contained" sx={{ backgroundColor: COLORS.primary, borderRadius: '8px', textTransform: 'none', minWidth: '140px' }}>
                {isSubmitting || updateLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            ) : (
              <Button onClick={handleNextStep} variant="contained" sx={{ backgroundColor: COLORS.primary, borderRadius: '8px', textTransform: 'none', minWidth: '140px' }}>Next</Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '8px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}