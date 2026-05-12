import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // use port 465 for secure, or port 587 for secure:false
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendDeliveryOtpEmail(email:string, otp:string){
    await transporter.sendMail({
        from: `"Order Delivery" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Your delivery OTP",
        html:`
        <div style="font-family:Arial, sans-serif">
        <h2>Delivery Verification</h2>
        <p>Your Order delivery is: </p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This OTP is valid for 10 minutes only.</p>
        </div> 
        `
    })
}