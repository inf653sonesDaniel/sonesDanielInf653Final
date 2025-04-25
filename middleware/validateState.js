const statesData = require("../model/StatesData.json");

const validateState = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
    const stateData = statesData.find((state) => state.code === stateCode);

    if (!stateData) {
        return res
            .status(404)
            .json({ message: "Invalid state abbreviation parameter" });
    }

    // If state exists: attach state's data to the request object
    req.stateData = stateData;
    next();
};

const validateFunFactIndex = (index, funfacts, stateName) => {
    if (!Number.isInteger(index) || index < 1) {
      return "Fun fact index must be an integer greater than 0";
    }
  
    if (!funfacts || index > funfacts.length) {
      return `No Fun Fact found at index ${index} for ${stateName}`;
    }
  
    return null;
  };
  
  module.exports = { validateState, validateFunFactIndex };