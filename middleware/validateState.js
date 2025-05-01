//middleware/validateState.js
const statesData = require("../model/StatesData.json");

const validateState = (req, res, next) => {
    const stateCode = req.params.state?.toUpperCase();
    const stateData = statesData.find(state => state.code === stateCode);

    if (!stateData) {
        return res.status(400).json({ message: "Invalid state abbreviation parameter" });
    }

    req.stateData = stateData;
    next();
};

module.exports = { validateState };