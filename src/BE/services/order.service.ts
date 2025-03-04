import db from "../config/db";

const orderCollection = db.collection('order')

const orderService = {
    addOrder: async(order: Order) => {
        try {
            await orderCollection.add(order);
        } catch (error) {
            throw new Error('error: unable to add new order. Detail: ' + error.message);
        }
        return true;
    },
}

export default orderService