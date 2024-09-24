const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (!existingAdmin) {
            console.log('No admin user found. Creating default admin...');
            const passHashed = await bcrypt.hash('admin', 10);
            const newAdmin = new User({
                firstName: 'admin',
                email: 'admin@gadgetzone.com',
                username: 'admin',
                password: passHashed,
                role: 'admin',
            });
            await newAdmin.save();
            console.log('Default admin user created successfully!');
        }
    } catch (error) {
        console.error("Error initalizing admin account: "+ error);
    }
}