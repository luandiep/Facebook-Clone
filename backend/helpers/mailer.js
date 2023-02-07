const nodemailer=require("nodemailer")
const {google}=require("googleapis")
const {OAuth2}=google.auth
const oauth_link='https://developers.google.com/oauthplayground'
const {EMAIL,MAILLING_ID,MAILLING_REFRESH,MAILING_SECRET}=process.env
const auth=new OAuth2(MAILLING_ID,MAILING_SECRET,MAILLING_REFRESH,oauth_link)

exports.sendVerificationEmail=(email,name,url)=>{
    auth.setCredentials({
        refresh_token:MAILLING_REFRESH
    });
    const accessToken=auth.getAccessToken();
    const stmp=nodemailer.createTransport({
        service:"gmail",
        auth:{
            type:"OAuth2",
            user:EMAIL,
            clientId:MAILLING_ID,
            clientSecret:MAILING_SECRET,
            refreshToken:MAILLING_REFRESH,
            accessToken
        }
    });
    const mailOptions={
        from:EMAIL,
        to:email,
        subject:"Facebook email verification",
        html:`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><div><span>${name} ${url}</span></span><span>Action requise: Active your facebook account</span></div></body></html>`
    }
    stmp.sendMail(mailOptions,(err,res)=>{
        if(err)return err;
        return res
    })
}
