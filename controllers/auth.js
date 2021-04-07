const {promisify} = require('util');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({path:'../.env'});
const con = require('../model/db');



exports.isLoggedIn = async(req,res,next)=>{  //Middleware
	
	console.log(req.cookies);

	if (req.cookies.jwt) {
		try{
			//Verify the token
			console.log(jwt);
			const decoded =  await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);

			console.log(decoded);

			//Check if the user still exists
			con.start.query('SELECT * FROM hospital where H_id=?',[decoded.id],(err,result)=>{
				console.log(result);
				if (!result) {
					return next();
				}

				req.user = result[0];
				return next();
			});
		}catch(error){
			console.log(error);
			return next();
		}
	}
	next();
}