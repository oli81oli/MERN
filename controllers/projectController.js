const Project = require('../models/Project')
const Task = require('../models/Task')

const { validationResult } = require('express-validator')


exports.createProject = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const project = new Project(req.body)
        project.owner = req.user.id
        await project.save()
        res.json({ project })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}


exports.getProjects = async (req, res) => {

    try {
        const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 })
        res.json({ projects })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.editProject = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name } = req.body
    const newProject = {}

    if (name) {
        newProject.name = name
    }
    try {

        let project = await Project.findById(req.params.id)

        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true })

        res.json({ project })
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error en el servidor')
    }
}


exports.deleteProject = async (req, res) => {

    try {
        let project = await Project.findById(req.params.id)

        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'No Autorizado' })
        }

        await Project.findOneAndRemove({ _id: req.params.id })
        await Task.deleteMany({ project: req.params.id })       //////////////////////

        res.json({ msg: 'Proyecto Eliminado' }) 
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error en el servidor')
    }
}







// exports.editProject = (req, res) => {

//     const errors = validationResult(req)

//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//     }


//     Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
//         .then(response => res.json(response))
//         // res.json({ projects })
//         .catch(error => {

//             console.log(error)
//             res.status(500).send('Hubo un error en el servidor')
//         })

// }