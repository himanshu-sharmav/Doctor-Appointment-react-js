const jwt = require('jsonwebtoken');

// This is a test script to debug JWT token issues
function debugJWT() {
  console.log('🔍 JWT Debug Script');
  console.log('====================');
  
  // Check if we can decode a token
  try {
    // This would be the token from the frontend
    console.log('❌ No token provided to test');
    console.log('💡 To test, you need to:');
    console.log('   1. Open your React app');
    console.log('   2. Login as a doctor');
    console.log('   3. Open browser dev tools (F12)');
    console.log('   4. Go to Application → Local Storage');
    console.log('   5. Copy the accessToken value');
    console.log('   6. Run: node debug_jwt.js <your_token_here>');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// If token is provided as command line argument
if (process.argv[2]) {
  const token = process.argv[2];
  console.log('🔍 Decoding JWT token...');
  
  try {
    // Try to decode without verification first
    const decoded = jwt.decode(token);
    console.log('✅ Decoded token (without verification):', JSON.stringify(decoded, null, 2));
    
    // Check what fields are available
    if (decoded) {
      console.log('\n📋 Token Fields:');
      console.log('   - userId:', decoded.userId || 'NOT FOUND');
      console.log('   - id:', decoded.id || 'NOT FOUND');
      console.log('   - role:', decoded.role || 'NOT FOUND');
      console.log('   - email:', decoded.email || 'NOT FOUND');
      console.log('   - exp:', decoded.exp ? new Date(decoded.exp * 1000) : 'NOT FOUND');
      console.log('   - iat:', decoded.iat ? new Date(decoded.iat * 1000) : 'NOT FOUND');
    }
  } catch (error) {
    console.error('❌ Error decoding token:', error.message);
  }
} else {
  debugJWT();
}
