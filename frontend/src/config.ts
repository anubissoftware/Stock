
export const backendURL = window.location.hostname == 'localhost' ? 
    "http://localhost:8012/" : "http://stockapi.anubisapps.com"
export const backendMedia = window.location.hostname == 'localhost' ?  
    "http://localhost:8012/public" : "http://stockapi.anubisapps.com/public"
export const quotationURL = window.location.hostname == 'localhost' ?  
    "http://localhost:8000/quotation/pdf/" : "http://stockdoc.anubisapps.com/quotation/pdf/"
