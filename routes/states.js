//routes/states.js

const express = require("express");
const path = require("path");
const router = express.Router();

const { validateState } = require("../middleware/validateState");
const statesController = require("../controllers/statesController");

// ===================
// GET Routes
// ===================

router.get("/", (req, res) => {
    const { contig } = req.query;
    if (contig) return statesController.getStatesByContiguity(req, res);
    return statesController.getAllStates(req, res);
});

router.get("/:state", validateState, statesController.getStateData);
router.get("/:state/capital", validateState, statesController.getStateCapital);
router.get("/:state/nickname", validateState, statesController.getStateNickname);
router.get("/:state/population", validateState, statesController.getStatePopulation);
router.get("/:state/admission", validateState, statesController.getStateAdmissionDate);
router.get('/:state/funfact', validateState, statesController.getStateFunFacts);

  
// ===================
// POST Route
// ===================

router.post("/:state/funfact", validateState, statesController.addFunFacts);

// ===================
// PATCH Route
// ===================

router.patch("/:state/funfact", validateState, statesController.updateFunFact);

// ===================
// DELETE Route
// ===================

router.delete("/:state/funfact", validateState, statesController.deleteFunFact);

// ===================
// 404 Failsafe
// ===================

router.all("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public", "404.html"));
});

module.exports = router;