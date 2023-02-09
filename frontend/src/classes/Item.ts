export class Item {
	id: number
    name: string
    description: string
    unit: any
    stock: number
    sold: number
    toCraft: number
    currency: string
    price: number
    cost: number
    wholesale: number
    onSales: number
    onBuying: number
    onLosses: number
    isRecipe: boolean
    categories: any[] | any
    enterprise?: number
    updateIngre: boolean
    recipeDetail: any[]
    expired: number
    rent: number

	constructor( ) {
		this.id = 0;
		this.name = '';
        this.description = ''
		this.unit = 0;
        this.stock = 1
        this.sold = 0
        this.toCraft = 0
        this.currency = 'COP'
        this.price = 0
        this.cost = 0
        this.wholesale = 0
        this.onSales = 0
        this.onBuying = 0
        this.isRecipe = false
        this.categories = [{}]
        this.enterprise = 0
        this.updateIngre = false
        this.recipeDetail = [{}]
        this.expired = 0
        this.onLosses = 0
        this.rent = 0
	}
}


export interface mutateStock{
    id: number,
    amount: number
}

export interface craftedStock{
    dec: Array<mutateStock>,
    inc: mutateStock
}