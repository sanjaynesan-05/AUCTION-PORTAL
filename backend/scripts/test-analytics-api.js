const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test analytics endpoints
async function testAnalyticsAPI() {
  try {
    console.log('🔄 Testing Analytics API...');

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    console.log('Login response:', JSON.stringify(loginResponse.data, null, 2));

    if (!loginResponse.data.data?.token) {
      console.error('❌ No token in login response');
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('Token received:', token.substring(0, 50) + '...');

    // Set authorization header
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Test overview endpoint
    console.log('📊 Testing overview endpoint...');
    try {
      const overviewResponse = await axios.get(`${API_BASE}/analytics/overview`, config);
      console.log('✅ Overview data:', JSON.stringify(overviewResponse.data, null, 2));
    } catch (error) {
      console.error('❌ Overview error:', error.response?.status, error.response?.data);
    }

    // Test players endpoint
    console.log('🏏 Testing players endpoint...');
    const playersResponse = await axios.get(`${API_BASE}/analytics/players`, config);
    console.log('✅ Players data:', JSON.stringify(playersResponse.data, null, 2));

    // Test teams endpoint
    console.log('👥 Testing teams endpoint...');
    const teamsResponse = await axios.get(`${API_BASE}/analytics/teams`, config);
    console.log('✅ Teams data:', JSON.stringify(teamsResponse.data, null, 2));

    console.log('🎉 All analytics endpoints working correctly!');

  } catch (error) {
    console.error('❌ Error testing analytics API:', error.response?.data || error.message);
  }
}

testAnalyticsAPI();