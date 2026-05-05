const checkMissingFields = (fields) => {
  const missingFields = [];

  Object.entries(fields).forEach(([key, value]) => {
    const isArray = Array.isArray(value);
    if (!value || (isArray ? value.length === 0 : !value.toString().trim())) {
      missingFields.push(key);
    }
  });

  return missingFields;
};

module.exports = checkMissingFields;
