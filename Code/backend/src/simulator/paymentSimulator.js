exports.pay = (paymentInfo, amount) => {
    console.log("processing payment......");
    console.log(`Charging $${amount} on card ending with '********${paymentInfo.cardNumber.slice(-4)}'`);
    if (paymentInfo.cardNumber.length < 16)
        return false;
    else
        return true;
};