import React from 'react';
import { Box, Typography } from '@mui/material';

const Unauthorized = () => (
  <Box p={4}>
    <Typography variant="h4" color="error">
      403 - Unauthorized
    </Typography>
    <Typography>You do not have permission to access this page.</Typography>
  </Box>
);

export default Unauthorized;
