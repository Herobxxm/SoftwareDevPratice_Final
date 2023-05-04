const User = require('../models/User')
const MassageShop = require('../models/MassageShop')

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try{
        const {name, email, password, tel,role} = req.body;
        //Create user
        const user = await User.create({
            name,
            email,
            tel,
            password,
            role,
        });
        //Create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true, token});
        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try{
        const {email, password} = req.body;

        //Validate email & password
        if(!email || !password) {
            return res.status(400).json({success:false, error:'Please provide an email and password'});
        }

        //Check for user
        const user = await User.findOne({email}).select('password');
        if(!user) {
            return res.status(401).json({success:false, error:'Invalid credentials'});
        }

        //check if password matches
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(401).json({success:false, error:'Invalid credentials'});
        }

        //create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true, token});
        sendTokenResponse(user, 200, res);
    } catch (err) {                                 
        return res.status(401).json({success:false, msg:'Cannot convert email or password to string'});
    }
};


//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success:true,
        // add for frontend
        _id: user._id,
        name: user.name,
        email: user.email,
        //end for frontend
        token
    });
}

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {

    const user = await User.findById(req.user.id);
    
    const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        tel: user.tel,
        role: user.role
    }
    
    if(user.role === 'massage_owner'){
        const massageShops = await MassageShop.find({owner: user.id});
        // get only id, name, address, district, province, region, tel, verify  from massageShops
        const shops = massageShops.map(shop => {
            return {
                _id: shop._id,
                name: shop.name,
                address: shop.address,
                district: shop.district,
                province: shop.province,
                region: shop.region,
                tel: shop.tel,
                verify: shop.verify
            }
        });

        //sort by verify
        shops.sort((a,b) => (a.verify > b.verify) ? -1 : ((b.verify > a.verify) ? 1 : 0));

        data.massageshopsOwned = shops;
    }

    res.status(200).json({
        success:true,
        data:data
    });
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success:true,
        data:{}
    });
};

