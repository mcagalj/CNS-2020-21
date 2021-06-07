const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    role: { type: String, required: true, unique: true }, 
    out_roles: Array
});

const PermSchema = mongoose.Schema({
    role: { type: String, required: true, unique: true }, 
    permissions: Array
});

module.exports = {
    role: mongoose.model('Role', RoleSchema),
	permission: mongoose.model('Permission', PermSchema)
}