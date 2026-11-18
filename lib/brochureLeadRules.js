// The brochure form's checks with no dependencies, for the browser.
//
// The same rules and messages as lib/brochureLeadSchema.js - which is what the
// API route enforces and stays the real gate - written out by hand because that
// file is built on Zod, and importing it into the modal put the whole of Zod
// (about 100 KB of JavaScript) on every Products page for the sake of five
// text fields. lib/brochureLeadRules.test.js runs both against the same inputs
// so the two cannot drift apart.

// Zod 4's own email pattern.
const EMAIL = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

// Returns { data } when the form is valid, or { errors } - the first problem
// per field, keyed by field name.
function checkBrochureLead(form) {
  const text = (v) => (typeof v === "string" ? v.trim() : null);
  const name = text(form?.name);
  const email = text(form?.email);
  const phone = text(form?.phone);
  const company = text(form?.company);
  const rawCity = form?.city;
  const city = typeof rawCity === "string" ? rawCity.trim() : rawCity;

  const errors = {};
  if (!name) errors.name = "Full name is required";
  else if (name.length < 2) errors.name = "Please enter your full name";

  if (!email) errors.email = "Email is required";
  else if (!EMAIL.test(email)) errors.email = "Please enter a valid email address";

  if (!phone) errors.phone = "Phone is required";
  else if (phone.length < 7) errors.phone = "Please enter a valid phone number";
  else if (!/^[0-9+\-()\s]+$/.test(phone)) errors.phone = "Phone can only contain digits, spaces and + - ( )";

  if (!company) errors.company = "Company or organization is required";
  else if (company.length < 2) errors.company = "Please enter your company or organization";

  if (city !== undefined && city !== null && typeof city !== "string") errors.city = "Invalid input";
  else if (typeof city === "string" && city.length > 120) errors.city = "City must be 120 characters or fewer";

  if (Object.keys(errors).length) return { errors };
  return { data: { name, email, phone, company, ...(city === undefined ? {} : { city }) } };
}

module.exports = { checkBrochureLead };
