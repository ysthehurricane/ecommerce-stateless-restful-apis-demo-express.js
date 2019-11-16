const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const multer = require("multer");

const storage = multer.diskStorage({
    destination : function(req , file , cb){
        cb(null , './uploads/');
    },
    filename : function(req , file , cb){
        cb(null, file.originalname);
    }
});

const filefilter  = (req , file , cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' )
    {
        cb(null,true);
    }
    else
    {
        cb(new Error("image not upload"),false);
    }
}

const upload = multer({storage : storage ,
     limits : {
    fileSize : 1024 * 1024 *5
    },
    fileFilter : filefilter
});

const Product = require("../../model/productSchema");
const checkAuth = require("../middleware/check-auth");

router.get('/' , checkAuth ,(req,res,next)=>{

        Product.find()
        .select("name price productImage _id")
        .exec()
        .then(doc => {
            
            const response = {
                count : doc.length,
                products : doc.map(doc =>{
                    return {

                        name : doc.name,
                        price : doc.price,
                        _id : doc._id,
                        productImage : doc.productImage,
                        request: {
                            type : 'GET',
                            url : 'http://localhost:3000/products/' + doc._id
                        } 
                    }

                })
            }
            
            res.status(200).json(response);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error : err,
            })
        });
});

router.post('/' ,checkAuth, upload.single('productImage') , (req,res,next)=>{
   
    console.log(req.file);
    
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    });

    product
    .save()
    .then( result => {
        console.log(result);
        res.status(201).json({
            message : "Product is created successfully !",
            productDetails : {
                name : result.name,
                price : result.price,
                _id : result._id,
                request:{
                    type : 'GET',
                    url : 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err,
        })
    });
  
});

router.get('/:productid',checkAuth , (req,res,next)=>{
    const id = req.params.productid;

    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {

        if(doc)
        {
            res.status(200).json({
                product : doc,
                request:{
                    type : 'GET',
                    url : 'http://localhost:3000/products/' + doc._id
                }
            });
        }
        else{
            res.status(500).json({
                message : "not valid entry found of provided product id",
            })
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err,
        })
    });
    
    // if(id === '123'){
    //     res.status(200).json({
    //         message:"You discovered the special id",
    //         id:id,
    //     });
    // }else{
    //     res.status(200).json({
    //         message:"You Passed an id",
    //     });
    // }
});

router.patch('/:productid',checkAuth , (req,res,next)=>{

    const id = req.params.productid;
    const updateOps  = {};

    for(let ops of req.body) {
      updateOps[ops.productName] = ops.value; 
    }
    
    Product.update({_id : id},{
        $set : updateOps
    })
    .select('name price _id')
    .exec()
    .then(result =>{
        res.status(200).json({
            message:"product is updated successfully !",
            product : doc,
            request:{
                type : 'GET',
                url : 'http://localhost:3000/products/' + doc._id
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        });
    });

   
});

router.delete('/:productid' ,checkAuth , (req,res,next)=>{
    const id = req.params.productid;

    Product
    .remove({_id : id})
    .select()
    .exec()
    .then(result =>{
        res.status(200).json({
            message:"product is deleted !!",
            request:{
                type : 'POST',
                url : 'http://localhost:3000/products/'
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