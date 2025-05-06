const mongoose = require('mongoose');
const FoodRequest = require('../models/malshiModel/FoodRequestModel');

const migrateRequestCodes = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/food_redistribution', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Get all requests without requestCode
        const requests = await FoodRequest.find({ requestCode: { $exists: false } });
        console.log(`Found ${requests.length} requests to migrate`);

        // Update each request with a new request code
        for (const request of requests) {
            const currentYear = new Date().getFullYear();
            const timestamp = Date.now().toString().slice(-4);
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const requestCode = `REQ-${currentYear}-${randomNum}`;

            await FoodRequest.findByIdAndUpdate(request._id, {
                requestCode: requestCode
            });
            console.log(`Updated request ${request._id} with code ${requestCode}`);
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

// Run the migration
migrateRequestCodes(); 