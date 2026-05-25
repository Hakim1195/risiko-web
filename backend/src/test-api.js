// Simple test to verify API endpoints are working
const express = require('express');
const app = require('./app.js');

// Test the health endpoint
const request = require('supertest');

describe('API Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200)
      .expect('Content-Type', /json/);
    
    expect(response.body).toHaveProperty('status', 'OK');
  });
});

// Test game creation endpoint
describe('Game API Endpoints', () => {
  it('should create a new game', async () => {
    const gameData = {
      gameId: 'test-game-123',
      players: ['player1', 'player2']
    };
    
    const response = await request(app)
      .post('/api/games/create')
      .send(gameData)
      .expect(201)
      .expect('Content-Type', /json/);
    
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Game created successfully');
  });
});

console.log('API test file created successfully');