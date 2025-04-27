import React, { useState } from 'react';
import { Rating, Typography, Box, TextField, Button } from '@mui/material';

export default function ProductReview() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    console.log({ rating, review });
    // Submit to backend
  };

  return (
    <Box sx={{ maxWidth: 500, p: 3 }}>
      <Typography variant="h6">Rate this product</Typography>
      <Rating
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
        precision={0.5}
      />
      <TextField
        label="Your review"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <Button 
        variant="contained" 
        onClick={handleSubmit}
        disabled={!rating}
      >
        Submit Review
      </Button>
    </Box>
  );
}