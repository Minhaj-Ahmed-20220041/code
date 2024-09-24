require('dotenv').config();

exports.resetVerificationEmail = (username, receiver, code) => {
    return {
        from: process.env.SENDER_DO_NOT_REPLY,
        to: receiver,
        subject: 'Password Reset Verification Code', 
        html: resetVerificationEmailTemplate(username, code)
      };
}

function resetVerificationEmailTemplate(username, code){
    const logoUrl = process.env.LOGO_URL;

    return '<div style="text-align:center;min-width:640px;width:100%;height:100%;font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;margin:0;padding:0" bgcolor="#fafafa"> <table border="0" cellpadding="0" cellspacing="0" id="m_7179989976616042233body" style="text-align:center;min-width:640px;width:100%;margin:0;padding:0" bgcolor="#fafafa"> <tbody> <tr> <td style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;height:4px;font-size:4px;line-height:4px" bgcolor="#6b4fbb"></td> </tr> <tr> <td style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#5c5c5c;padding:25px 0">'
    +'<img alt="GadgetZOne" src="'+logoUrl+'"width="120" height="60" class="CToWUd" data-bit="iit">'
    +'</td> </tr> <tr> <td style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif"> <table border="0" cellpadding="0" cellspacing="0" class="m_7179989976616042233wrapper" style="width:640px;border-collapse:separate;border-spacing:0;margin:0 auto"> <tbody> <tr> <td class="m_7179989976616042233wrapper-cell" style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;border-radius:3px;overflow:hidden;padding:18px 25px;border:1px solid #ededed" align="left" bgcolor="#fff"> <table border="0" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:separate;border-spacing:0"> <tbody> <tr> <td> <div style="color:#1f1f1f;line-height:1.25em;max-width:400px;margin:0 auto" align="center"> '
    +'<h3> Hello, '+username+'! </h3> '
    +'<p style="font-size:0.9em"> You have requested to reset your GadgetZone account password. Please enter the verification code to reset your password. </p> <div style="width:207px;height:53px;background-color:#f0f0f0;line-height:53px;font-weight:700;font-size:1.5em;color:#303030;margin:26px 0"> '
    +code+'</div> '
    +'<p style="font-size:0.75em"> Your verification code expires after 60 minutes. </p> </div> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#5c5c5c;padding:25px 0"> '
    +'<img alt="GadgetZone" src="'+logoUrl+'" style="display:block;width:90px;margin:0 auto 1em" class="CToWUd" data-bit="iit">'
    +' <div> You are receiving this email because of your account on GadgetZone. </div> </td> </tr> <tr> <td style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#5c5c5c;padding:25px 0"> </td> </tr> </tbody> </table> <div class="yj6qo"></div> <div class="adL"> </div> </div>';
}