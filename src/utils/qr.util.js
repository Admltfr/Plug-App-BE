import crypto from "crypto";

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}
function expiry(minutes = 60) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export default { generateToken, expiry };
