const router=require("express").Router()


router.post('/payment',(req,res)=>{
    const stripe=require("stripe")(process.env.STRIPE_KEY)
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "USD"
    },(stripeError,stripeRes)=>{
        if(stripeError){
            return res.status(500).json(stripeError)
        }else{
            return res.status(200).json(stripeRes)
        }
    })
})

module.exports=router;