exports.calculatedDiscountedPrice = (price, discount) => {
    return (price-((discount/100) * price)).toFixed(2);
};