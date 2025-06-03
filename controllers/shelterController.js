const Shelter = require("../models/shelterSchema");
const User = require("../models/userSchema");

exports.createShelter = async (req, res) => {
    try {
        const { name, location, capacity, current_occupancy = 0, contact_number, managed_by } = req.body;

        if (!name || !location || !capacity) {
            return res.status(400).json({ message: 'Name, location, and capacity are required' });
        }

        if (!location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
            return res.status(400).json({ message: 'Location coordinates must be an array of [longitude, latitude]' });
        }

        if (!location.address) {
            return res.status(400).json({ message: 'Location address is required' });
        }

        const user = await User.findById(managed_by);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.userType !== 'Shelter_provider' && user.userType !== 'Admin') {
            return res.status(403).json({ message: 'Only shelter providers and admins can create shelters' });
        }

        const newShelter = await Shelter.create({
            name: name.trim(),
            location: {
                type: 'Point',
                coordinates: location.coordinates,
                address: location.address.trim()
            },
            capacity: parseInt(capacity),
            current_occupancy: parseInt(current_occupancy) || 0,
            contact_number: contact_number ? contact_number.trim() : undefined,
            managed_by: managed_by
        });

        return res.status(201).json({ data: newShelter, message: 'Shelter created successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getShelters = async (req, res) => {
    try {
        const shelters = await Shelter.find();
        
        if (shelters.length === 0) {
            return res.status(404).json({ message: "No shelters found" });
        }

        return res.status(200).json({ data: shelters, message: "Shelters retrieved successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteShelter = async (req, res) => {
    try {
        const { shelter_id, managed_by } = req.body;

        const user = await User.findById(managed_by);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const shelter = await Shelter.findOne({ shelter_id: shelter_id });
        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }

        if (shelter.managed_by.toString() !== managed_by && user.userType !== 'Admin') {
            return res.status(403).json({ message: "You are not authorized to delete this shelter" });
        }

        if (shelter.current_occupancy > 0) {
            return res.status(400).json({ message: "Cannot delete shelter with current occupants" });
        }

        await Shelter.findOneAndDelete({ shelter_id: shelter_id });

        return res.status(200).json({ message: "Shelter deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};