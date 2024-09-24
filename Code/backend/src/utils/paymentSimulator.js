// utils/paymentSimulator.js

const paymentSimulator = {
    pay: (paymentInfo, amount) => {
        // Simulate payment processing
        // Here, we'll just randomly decide if the payment is successful
        const isSuccess = Math.random() > 0.1; // 90% chance of success
        return isSuccess;
    }
};

module.exports = paymentSimulator;
