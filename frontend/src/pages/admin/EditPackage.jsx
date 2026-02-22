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
  CircularProgress
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
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            images: []
          });
          if (result.PackageImages && Array.isArray(result.PackageImages)) {
            const mappedImages = result.PackageImages.map(img => {
              // ✅ FIXED LINE BELOW
              const backendUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';

              const fullUrl = img.url.startsWith('http')
                ? img.url
                : `${backendUrl}/uploads/${img.url.startsWith('/') ? img.url.slice(1) : img.url}`;

              return {
                id: img.id,
                url: fullUrl,
                caption: img.caption || '',
                is_primary: img.is_primary || false,
                existing: true
              };
            });
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
      existing: false
    }));
    setImagePreviews(prev => [...prev, ...newImages]);
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
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('destination', formData.destination);
      formDataToSend.append('duration_days', parseInt(formData.duration_days) || 1);
      formDataToSend.append('price_adult', parseFloat(formData.price_adult));
      formDataToSend.append('price_child', formData.price_child ? parseFloat(formData.price_child) : 0);
      formDataToSend.append('max_capacity', parseInt(formData.max_capacity) || 20);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('is_featured', formData.is_featured);
      formDataToSend.append('inclusions', formData.inclusions);
      formDataToSend.append('exclusions', formData.exclusions);
      formDataToSend.append('itinerary', formData.itinerary);

      const imagesPayload = imagePreviews.map((img) => ({
        id: img.existing ? img.id : null,
        url: img.existing ? img.url : null,
        caption: img.caption || '',
        is_primary: img.is_primary || false
      }));

      formDataToSend.append('images', JSON.stringify(imagesPayload));

      imagePreviews.forEach((img) => {
        if (!img.existing && img.file) {
          formDataToSend.append('newImages', img.file);
        }
      });

      await dispatch(updatePackage({ id, data: formDataToSend })).unwrap();

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

  if (!isDataLoaded && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
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

      case 1:
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

      case 2:
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
                      <Paper sx={{ p: 1, borderRadius: '8px', border: `1px solid ${COLORS.border}`, position: 'relative' }}>
                        {preview.existing && (
                          <Chip label="Existing" size="small" color="primary" sx={{ position: 'absolute', top: 4, right: 4, zIndex: 1, fontSize: '0.6rem', height: 20 }} />
                        )}
                        <img src={preview.url} alt={`Preview ${index}`} crossOrigin="anonymous"  
                          referrerPolicy="no-referrer" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => {
                          console.error('❌ IMAGE FAILED TO LOAD:', preview.url);
                        console.error('Status:', e.target.statusText);
                        // Optional: Show a broken image icon temporarily
                        e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', preview.url);
                        }} />
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
                  <Grid item xs={12} sm={6}><Typography variant="body2"><strong>Duration:</strong> {formData.duration_days || '—'} days</Typography></Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2"><strong>Category:</strong> </Typography>
                    <Chip label={formData.category} size="small" sx={{ ml: 1 }} />
                  </Grid>
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
                          crossOrigin="anonymous"  // ✅ Crucial for cross-origin images
                          referrerPolicy="no-referrer" // ✅ Prevents referrer blocking
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            backgroundColor: '#f9f9f9'
                          }}

                          onError={(e) => {
                            console.error('❌ IMAGE FAILED TO LOAD:', preview.url);
                            console.error('Status:', e);
                            // Optional: Show a broken image icon temporarily
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('✅ Image loaded successfully:', preview.url);
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