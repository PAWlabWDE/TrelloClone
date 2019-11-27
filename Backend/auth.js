
const jwt = require('jsonwebtoken');
export const generateJWTToken = (userData) =>{
    var a =jwt.sign(userData, secret);
    console.log(a);
    return a;
 }
 export const verifyToken = (jwtToken) =>{
    try{
        var a=jwt.verify(jwtToken, secret);
        console.log(a);
       return a;
    }catch(e){
       console.log('e:',e);
       return null;
    }
 }