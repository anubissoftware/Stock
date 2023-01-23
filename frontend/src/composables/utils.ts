export const includesAny = (str: string, vals: Array<string>) => {
    let con = false
    vals.map((val) => {
        if (str.includes(val)) con = true
        return val
    })
    return con
}

export const currencyFormat = (amount: number, fromZero = true): string => {
    const formater = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'COP',
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 0
    })
    
    return amount == 0 && fromZero ? 'N/A' : formater.format(amount)
}
