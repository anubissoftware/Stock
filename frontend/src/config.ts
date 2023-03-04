
export const backendURL = window.location.hostname == 'localhost' ?
    "http://localhost:8012/" : "https://stockapi.anubisapps.com"
export const backendMedia = window.location.hostname == 'localhost' ?
    "http://localhost:8012/public" : "https://stockapi.anubisapps.com/public"

export const quotationURL = window.location.hostname == 'localhost' ?
    "http://localhost:8000/quotation/pdf/" : "http://stockdoc.anubisapps.com/quotation/pdf/"
export const dispatchURL = window.location.hostname == 'localhost' ?
    "http://localhost:8000/dispatch/pdf/" : "http://stockdoc.anubisapps.com/dispatch/pdf/"
