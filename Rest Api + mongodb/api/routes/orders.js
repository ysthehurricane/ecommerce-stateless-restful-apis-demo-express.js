const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../../model/orderSchema");
const Product = require("../../model/productSchema");


router.get('/',(req,res,next)=>{

    Order.find()
    .select('_id product quantity')
    .populate("product", "name price")
    .exec()
    .then(doc => {
        res.status(200).json({
            count: doc.length,
            orders : doc.map(doc=>{
                return {
                    _id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/orders/'+doc._id 
                    }

                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err,
        })
    })
    
});

router.post('/',(req,res,next)=>{

    Product.findById(req.body.productid)
    .then(doc => {

        if(!doc){
            return res.status(404).json({
                message : "product not found"
            });
        }

        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            quantity : req.body.quantity,
            product : req.body.productid
        });
    
        return order.save()
    })

    .then(doc => {
            res.status(201).json({
                message : "order is stored",
                createdOrder : {
                    _id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request : {
                            type : 'GET',
                            url : 'http://localhost:3000/orders/'+doc._id 
                            } 
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error : err
            });
        });
    
});

router.get('/:orderid',(req,res,next)=>{

    Order.findById(req.params.orderid)
    .select('_id product quantity')
    .populate("product", "name price")
    .exec()
    .then(doc => {

        if(doc)
        {
            res.status(200).json({
                order : doc,
                request:{
                    type : 'GET',
                    url : 'http://localhost:3000/order/' + doc._id
                }
            });
        }
        else{
            res.status(500).json({
                message : "not valid entry found of provided order id",
            })
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err,
        })
    });
});

router.delete('/:orderid',(req,res,next)=>{
    const id = req.params.orderid;

    Order
    .remove({_id : id})
    .select()
    .exec()
    .then(result =>{

        if(!result)
        {
                return res.status(404).json({
                    message : "order not found",
                });
        }

        res.status(200).json({
            message:"order is cancelled !!",
            request:{
                type : 'POST',
                url : 'http://localhost:3000/orders/'
            }
       });
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        });
    });
});

module.exports = router;