/* Function to validate tax details for categories */
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

const validateAmount = (item) => {
  if (item.baseAmount < item.discount){
    return "Discount cannot be greater than base amount";
  }
  return null;
}

module.exports = {
  validateTax,
  validateAmount,
};
