var passwordValidator = require('password-validator');

var passwordChecker = new passwordValidator();

exports.isValidEmail =  (email)=> {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};
exports.isValidPassowrd =(password)=>{
    if(password.length < 8 ||password ===''){
        return false;
    }
    return true;
};

// Add properties to it
exports.isValidPassowrd = (password)=>{
passwordChecker
    .is().min(8)                                    // Minimum length 8
    .is().max(20)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    
    return passwordChecker.validate(password);
}