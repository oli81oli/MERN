const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const taskController = require('../controllers/taskController')
const { check } = require('express-validator')

router.post('/',
    auth,
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('project', 'El project es obligatorio').not().isEmpty()
    ],
    taskController.createTask
)

router.get('/',
    auth,
    taskController.getTasks
)

router.put('/:id',
    auth,
    taskController.editTask
)

router.delete('/:id',
    auth,
    taskController.deleteTask
)
module.exports = router 