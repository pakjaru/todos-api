const checkIsIdValid = (id) => {
  return !isNaN(id) && id > 0;
};

module.exports = checkIsIdValid;
