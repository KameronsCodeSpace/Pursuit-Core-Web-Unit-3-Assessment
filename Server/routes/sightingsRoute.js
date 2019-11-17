const express = require('express');
const router = express.Router();

//pg-promise
const db = require('./promiseConfig')

//get all sightings
router.get('/', async (req, res) => {
    console.log('Sightings endpoint reached/ ', Date())
    try {
        let sightings = await db.any (`
            SELECT
                *
            FROM
                sightings
        `)
        res.json({
                status: "success",                      
                message: "retrieved all sightings", 
                payload: sightings
        })
    } catch (error) {
        res.status(500)
        res.json({
            status: "error",
            message: "Sightings not found",
            payload: null
        })
    }
})

//get all sightings of certain species
router.get('/species/:species_name', async (req, res) => {
    console.log('Sightings species endpoint reached/ ', Date())
    try {
        let speciesSightings = await db.any (`
        SELECT 
           species.name, species.is_mammal, sightings.researcher_id
        FROM species
        INNER JOIN sightings ON  sightings.id = species.id
        WHERE species.name = '${req.params.species_name}'
        `)
        res.json({
                status: "success",                      
                message: "retrieved all sightings", 
                payload: speciesSightings
        })
    } catch (error) {
        res.status(500)
        res.json({
            status: "error",
            message: "Sightings not found",
            payload: null
        })
    }
})

//Report new sighting
router.post('/', async (req, res) => {
    let addNewSighting =
    `INSERT INTO sightings(researcher_id, species_id, habitats_id)
        VALUES($1, $2, $3)`
    
    try {
        await db.none(addNewSighting, [req.body.researcher_id, req.body.species_id, req.body.habitats_id])
        res.json({
            status: "success",
            message: "Made a new sighting",
            payload: req.body
        })
    } catch(error) {
        res.status(404)
        console.log(error);
        res.json({
            status: "error",
            message: "Could not create a new sighting",
            payload: null
        })
    }
})

module.exports = router;