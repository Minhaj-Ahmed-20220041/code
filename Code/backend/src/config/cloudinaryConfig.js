require('dotenv').config();

const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testConnection() {
    try {
        const pingResponse = cloudinary.api.ping();
        console.log('Cloudinary service is running');
    } catch (error) {
        console.error('Error Connecting Cloudinary:', error.message);
    }
}

testConnection();

module.exports = cloudinary;