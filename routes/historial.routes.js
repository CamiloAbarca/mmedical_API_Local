const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historial.controller');

router.get('/', historialController.getAllHistorial);
router.get('/:id', historialController.getHistorialById);
router.get('/equipo/:idEquipo', historialController.getHistorialByEquipo);
router.post('/', historialController.createHistorial);
router.put('/:id', historialController.updateHistorial);
router.delete('/:id', historialController.deleteHistorial);

module.exports = router;
