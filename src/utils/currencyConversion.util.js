

export default function currencyConversion(amount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    });
    
    return formatter.format(amount);
    }