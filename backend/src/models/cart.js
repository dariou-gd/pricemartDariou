/* Campos:
    customerId
    products
        productId
        quantity
        subtotal
    total
    status
*/
import mongoose, { Schema, model } from "mongoose"
import { type } from "node:os"
 
const cartSchema = new Schema ({
    customerId : {
        type: mongoose.Types.ObjectId,
        ref: "Customers"
    },
    products: [
        {
            productId : {
                type: mongoose.Types.ObjectId,
                ref: "Products"
            },
            quantity : {
                type : Number
            },
            subtotal:{
                type: Number
            }
        }
    ],
    total : {
        type: Number
    },
    status : {
        type : String
    }
},
{
    timestamps : true,
    strict : false
}
)
 
export default model ("cart", cartSchema)