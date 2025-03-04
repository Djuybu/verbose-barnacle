interface Order {
    id: string,
    items: ItemOrder[],
    price: number
}

interface ItemOrder {
    fruitId: string,
    quantity: number
}