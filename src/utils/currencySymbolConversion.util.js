
export default function currencyStringToSymbol(currencyString){
    if(currencyString === "") return "?";
    if(currencyString === undefined) return "?"
    currencyString = currencyString.toUpperCase()
    switch (currencyString){
        case "USD": return "\u0024"
        case "CAD": return "CA\u0024"
        case "EUR": return "\u20AC"
        case "GBP": return "\u00A3"
        case "AUD": return "AU\u0024"
        case "JPY": return "\u00A5"
        default: return ""
    }
}