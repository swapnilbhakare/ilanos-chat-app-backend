import crypto from "crypto";
import twilio from "twilio";
import { hashOtp } from "./hash.service.js";

const accountSid = process.env.SMS_SID;
const authToken = process.env.SMS_AUTH_TOKEN;

const client = new twilio.Twilio(accountSid, authToken);

const generateOtp = async () => {
  const otp = crypto.randomInt(1000, 9999);
  return otp;
};

const sendBySms = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      from: process.env.SMS_FROM_NUMBER,
      body: `Your IlanoS OTP is ${otp}!`,
      to: phone,
    });
    console.log(`OTP sent successfully to ${phone}`);
    return message;
  } catch (error) {
    console.error(`Error sending OTP to ${phone}:`, error);
    throw error;
  }
};

const validateOtp = async (hashedOtp, data) => {
  try {
    const computedHash = await hashOtp(data);
    return computedHash === hashedOtp;
  } catch (error) {
    console.error("Error validating OTP:", error);
    return false; // Return false to indicate validation failure
  }
};

export { generateOtp, sendBySms, validateOtp };
