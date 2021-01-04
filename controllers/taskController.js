const Task = require('../models/Task')
const Project = require('../models/Project')

const { validationResult } = require('express-validator')


exports.createTask = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { project } = req.body

    try {

        const aProject = await Project.findById(project)
        if (!aProject) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })  //Not found
        }

        if (aProject.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        const task = new Task(req.body)
        await task.save()
        res.json({ task })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error') // Error del servidor
    }
}


exports.getTasks = async (req, res) => {

    const { project } = req.query

    try {
        const aProject = await Project.findById(project)
        if (!aProject) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })  //Not found
        }

        if (aProject.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No Autorizado' }) //Authentication
        }

        const tasks = await Task.find({ project })//.sort({ createdAt: -1 })
        res.json({ tasks })
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error') // Error server
    }


}

exports.editTask = async (req, res) => {

    try {
        const { name, project, state } = req.body

        let task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({ msg: ' Tarea no encontrada' })  //Not found
        }

        const aProject = await Project.findById(project)
        if (!aProject) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })  //Not found
        }

        if (aProject.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        const newTask = {}
        newTask.name = name
        newTask.state = state

        task = await Task.findByIdAndUpdate({ _id: req.params.id }, { $set: newTask }, { new: true })

        res.json({ task })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error en el servidor')
    }
}

exports.deleteTask = async (req, res) => {


    try {
        let task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({ msg: ' Tarea no encontrada' })  //Not found
        }

        const aProject = await Project.findById(task.project)
        if (!aProject) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })  //Not found
        }

        if (aProject.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        await Task.findOneAndRemove({ _id: req.params.id })
        res.json({ msg: 'Tarea Eliminada' })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error en el servidor')
    }
}