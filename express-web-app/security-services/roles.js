const debug = require('debug')('role');

let descendants = [];

function Roles(options) {
	this.roles = options.roles;
	this.roles_perms = options.perms;	
	this.roles_len = this.roles.length;	
	this.perm_len = this.roles_perms.length;
}

function getRoleObject(role) {
	for (let i=0, l=this.roles_len; i<l; ++i) {
		if (role === this.roles[i].role) {
			return this.roles[i];
		}
	}
}

function getDescendantsFor(role) {
	var _this = this;
	for (let i=0, l=this.roles_len; i<l; ++i) {
		if (role === this.roles[i].role) {
			if (this.roles[i].out_roles === null || this.roles[i].out_roles === 'undefined' ) {
				return;
			} else {
				this.roles[i].out_roles.forEach( function(element, index, array){
					if(element !== role && descendants.indexOf(element) < 0) {
						debug("Add descendant of role '" + role +"': '" + element + "'");
						descendants.push(element);
						getDescendantsFor.call(_this, element); // Recursion
					} 
				});
			}
		}
	}
}

function getOwnPermsFor(role) {
	for (let i=0, l=this.perm_len; i<l; ++i) {
		if (role === this.roles_perms[i].role) {
			debug("Own perms of '" + role + "': " + this.roles_perms[i].permissions);
			return this.roles_perms[i].permissions;
		}
	}
	debug("Perms of '" + role + "': ");
	return [];
}

function deduplicate(perms) {
	let permsCopy = [];
	let verifiedPerms = [];

	for (let i=0, l=perms.length; i<l; i++) {
			if ( verifiedPerms.indexOf( perms[i] ) === -1 ) {
				verifiedPerms.push( perms[i] );
				permsCopy.push( perms[i] );
			}
	}		
	return permsCopy;
}

Roles.prototype.getRoles = function(role) {
	descendants = [];
	if (getRoleObject.call(this, role) !== undefined) {
		descendants[0] = role;
		getDescendantsFor.call(this, role);	
	}
	return descendants;
};

Roles.prototype.getPermsFor = function getPermsFor(role) {
	let that = this;
	descendants = [];
	getDescendantsFor.call(this, role);
	debug("Roles of '" + role + "': " + descendants);
	var perms = getOwnPermsFor.call(this, role); 		  // Get own perms
	descendants.forEach(function(element, index, array){ // Get inherited perms
		perms = perms.concat(getOwnPermsFor.call(that, element));
	});
	// Delete duplicates from 'perms' and return clean 'perms'
	return deduplicate(perms);
};

Roles.prototype.hasPerm = function(perms, perm) {
	if (perms.indexOf(perm) > -1) {
		return true;
	} else {
		return false;
	}
};

module.exports = Roles;