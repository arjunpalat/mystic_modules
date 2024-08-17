const validateTax= (category) => {
  if (category.taxApplicability === undefined) {
    return "Tax applicability is required";
  }
  if (category.taxApplicability && !category.tax) {
    return "Tax is required";
  }
  if (category.taxApplicability && !category.taxType) {
    return "Tax type is required";
  }
  return null;
};


module.exports = {
  validateTax,
};
