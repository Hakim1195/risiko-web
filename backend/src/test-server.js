// Simple test to verify server is running
const express = require('express');
const app = require('./app.js');

// Test basic server functionality
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Testing basic routes...');
  
  // Test health check
  const http = require('http');
  const request = require('http').request;
  
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/health',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`Health check status: ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log('Health check response:', chunk.toString());
    });
  });
  
  req.on('error', (e) => {
    console.error('Error with health check:', e.message);
  });
  
  req.end();
});