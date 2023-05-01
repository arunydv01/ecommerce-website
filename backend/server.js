require("dotenv").config()

const jwt = require('jsonwebtoken');
const express = require("express")
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const app = express()
const cors = require("cors")
app.use(express.json())
const bcrypt = require("bcryptjs")

const User = require("./models/user")

mongoose.connect(process.env.MONGO_DB_URI, {
});

const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_DB_URI,
    collection: 'sessions',
});

app.use(
    cors({
        origin:"*",
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
)

app.use(
    require('express-session')({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      store: sessionStore,
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    })
);


// JWT authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'].split(" ")[1];
    if (!token) {
        req.user = null;
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const verify = jwt.verify(token,process.env.JWT_SECRET);
    console.log(verify)
    if(!verify){
        console.log("trim")
        return res.status(403).json({ error: 'Invalid token' });
    }
    User.findOne({email:verify.email})
    .then((user) =>{
        req.user = user;
    })
    next();
};


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    User.findOne({email:email})
    .then((user) =>{
        if(!user){
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        bcrypt
        .compare(password, user.password)
        .then((result) =>{
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.user = user;
            res.json({ token, user });
        })
        .catch((err) =>{
          return res.status(422).json({ error: 'Invalid credentials' });  
        })
    })
    .catch((err) =>{
        return res.status(422).json({ error: 'Invalid credentials' });  
    })
    
});

app.post('/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        User.findOne({email:email, username:username})
        .then((user) =>{
            if (user) {
                return res.status(400).json({ error: 'User already exists' });
            }

            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) =>{
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        username: username,
                        orders:{
                            items: [],
                        }
                    })
                    user.save();
                    req.user = user;
                    // Generate JWT token for the new user
                    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                
                    res.json({ token, user });

                })
        })
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.clearCookie('connect.sid'); 
      res.json({ message: 'Logged out successfully' });
    });
});

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

app.post("/create-checkout-session", authenticateToken, async (req, res)=>{
    try{
        quantity = 0;
        req.body.items.map(item => {
            quantity = item.quantity;
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            line_items: req.body.items.map(item => {
                return{
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name: item.name
                        },
                        unit_amount: (item.price)*100,

                    },
                    quantity: item.quantity
                }
            }),
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel'
        })
        const token = req.headers['authorization'].split(" ")[1];
        const verify = jwt.verify(token,process.env.JWT_SECRET);
        User.findOne({email:verify.email})
        .then((user) =>{
            user.addOrder(quantity);
        })
        
        res.json({url: session.url})

    }catch(e){
     res.status(500).json({error:e.message})
    }
})
const port = 5000;
app.listen(5000, () => {
    console.log(`Server is running on http://localhost:${port}`);
});