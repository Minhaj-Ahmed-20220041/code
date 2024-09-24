const crypto =  require('crypto');

exports.generateResetVerificationCode = (length) => {
    if (typeof length !== 'number' || length <= 0) {
        throw new Error('Error in generating password reset verification code.');
    }
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.generateUniqueToken = function generateUniqueToken() {
    try{
        const buffer = crypto.randomBytes(32);
        const token = buffer.toString('hex');
        return token;
    }catch(error){
        throw new Error('Error in generating password reset token.');
    }
  }