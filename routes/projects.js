const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')


router.post('/',
    auth,
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.createProject
)

router.get('/',
    auth,
    projectController.getProjects
)

router.put('/:id',
    auth,
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.editProject
)

router.delete('/:id',
    auth,
    projectController.deleteProject
)


module.exports = router