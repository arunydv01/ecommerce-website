const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    username: {
        type:String,
        required:true
    },
    orders:{
        items:[
            {
                quantity:{
                    type:Number,
                    required: true,
                    default: 0
                },
                time:{
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }
});

userSchema.methods.addOrder = function (quantity){
    console.log("orders")
    const orderItems = [...this.orders.items];
    orderItems.push({
        quantity: quantity,
        time: Date.now()
    });
    const updatedOrders = {
        items: orderItems,
    };
    console.log(updatedOrders)
    this.orders = updatedOrders;
    this.save();
}


module.exports = mongoose.model("User", userSchema)