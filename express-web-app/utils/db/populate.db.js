const debug = console.log;
const data = require("./dummy.data");
const mongoose = require("mongoose");
const async = require("async");
const { MONGODB: config } = require("../../config.js");

const User = require("../../models/user");
const Role = require("../../models/role").role;
const Permission = require("../../models/role").permission;
const ChartPoints = require("../../models/chart.points");

const MONGODB = process.env.MONGODB_ADDON_DB || "mongodb://127.0.0.1/lab7";
const MONGODB_HOST = process.env.MONGODB_ADDON_HOST || "localhost";

//-----------------------------------------------
// Connect to a DB at the configured DB uri.
//-----------------------------------------------
mongoose.Promise = global.Promise;
debug(`Connecting to DB "${MONGODB}" (${MONGODB_HOST})`);
mongoose.connect(config.uri, config.options);
mongoose.connection
  .on("connected", function () {
    debug(`Connected to DB "${MONGODB}" (${MONGODB_HOST}).`);
    // Populate the DB with the dummy data.
    populate();
  })
  .on("disconnected", function () {
    debug(`Disconnected from DB "${MONGODB}" (${MONGODB_HOST}).`);
  })
  .on("error", function (err) {
    debug(`Error on DB "${MONGODB}" (${MONGODB_HOST}): ${err}`);
    mongoose.connection.close();
  });

//-----------------------------------------------------------
// Populate DB - one-time job; get data from dummy.data.js.
//-----------------------------------------------------------
function reportError(err, data) {
  switch (err.code) {
    case 11000:
      debug(`Error on save "${data}": Duplicate key error index.`);
      break;

    default:
      if (data) {
        debug(`Error on save "${data}": ${err.message}.`);
        return;
      }
      debug(`Error on save: ${err.message}.`);
  }
}

function saveUser(user, callback) {
  if (!user) return;
  new User(user).save(function (err) {
    debug(`Adding a user to DB: ${JSON.stringify(user.name)}`);
    if (err) {
      reportError(err, user.name);
      callback(err);
      return;
    }
    callback(null);
  });
}

function saveUsers(users, callback) {
  if (!users) return;
  let tasks = [];

  users.forEach(function (user, index) {
    tasks.push(function (callback) {
      saveUser(user, callback);
    });
  });

  async.parallel(tasks, function (err, results) {
    if (err) {
      callback(err);
      return;
    }
    debug(`Successfully added ${users.length} users.`);
    callback(null, users.length);
  });
}

function saveRole(role, callback) {
  if (!role) return;
  new Role(role).save(function (err) {
    debug(`Adding a role to DB: ${role.role}`);
    if (err) {
      reportError(err, role.role);
      callback(err);
      return;
    }
    callback(null);
  });
}

function saveRoles(roles, callback) {
  if (!roles) return;
  let tasks = [];

  roles.forEach(function (role, index) {
    tasks.push(function (callback) {
      saveRole(role, callback);
    });
  });

  async.parallel(tasks, function (err, results) {
    if (err) {
      callback(err);
      return;
    }
    debug(`Successfully added ${roles.length} roles.`);
    callback(null, roles.length);
  });
}

function savePermission(permission, callback) {
  if (!permission) return;
  new Permission(permission).save(function (err) {
    debug(`Adding a permission to DB: ${JSON.stringify(permission)}`);
    if (err) {
      reportError(err, `Permission for role '${permission.role}'`);
      callback(err);
      return;
    }
    callback(null);
  });
}

function savePermissions(roles_perms, callback) {
  if (!roles_perms) return;
  let tasks = [];

  roles_perms.forEach(function (permission, index) {
    tasks.push(function (callback) {
      savePermission(permission, callback);
    });
  });

  async.parallel(tasks, function (err, results) {
    if (err) {
      callback(err);
      return;
    }
    debug(`Successfully added ${roles_perms.length} permissions.`);
    callback(null, roles_perms.length);
  });
}

function saveChartPoints(chart, callback) {
  if (!chart) return;
  new ChartPoints(chart).save(function (err) {
    debug(`Adding "chartpoints" collection to DB: ${JSON.stringify(chart)}`);
    if (err) {
      reportError(err, JSON.stringify(chart));
      callback(err);
      return;
    }
    debug(`Sucessfully added "chartpoints" collection.`);
    callback(null, 1);
  });
}

function populate() {
  let { roles, roles_perms, users, chart } = data;

  let tasks = {
    users: function (callback) {
      saveUsers(users, callback);
    },
    roles: function (callback) {
      saveRoles(roles, callback);
    },
    permissions: function (callback) {
      savePermissions(roles_perms, callback);
    },
    chart: function (callback) {
      saveChartPoints(chart, callback);
    },
  };

  async.parallel(tasks, function (err, results) {
    if (err) {
      debug(
        "Error while saving data. Try to drop/clean the DB (collections) before saving data."
      );
    } else {
      debug(`Sucessfully added all data to the DB: ${JSON.stringify(results)}`);
    }
    // Close the connection to the DB.
    mongoose.connection.close();
  });
}
