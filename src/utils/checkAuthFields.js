const checkAuthFields = ({ username, email, password }) => {
  const invalidFields = {};

  if (email && !email.includes("@")) invalidFields.email = "invalid";
  if (/\s/.test(username)) invalidFields.username = "must not include spaces";
  if (password.length < 8)
    invalidFields.password = "must have at least 8 characters";

  return invalidFields;
};

module.exports = checkAuthFields;
