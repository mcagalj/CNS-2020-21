module.exports = {
  //-----------------------------------------------------------------------
  // We consider a simple hierarchical RBAC. In this direction we organize
  // organize roles as a DAG (Directed Acyclic Graph). A 'parent' role
  // role inherits permissions of all its 'descendant' roles.
  //-----------------------------------------------------------------------
  roles: [
    // Roles
    {
      role: "admin",
      out_roles: ["member"],
    },

    {
      role: "member",
      out_roles: ["visitor"],
    },

    {
      role: "visitor",
      out_roles: null,
    },
  ],

  roles_perms: [
    // Role to permissions relationship.
    {
      role: "admin",
      permissions: ["reset", "delete"],
    },

    {
      role: "member",
      permissions: ["add"],
    },

    {
      role: "visitor",
      permissions: ["read"],
    },
  ],

  //-------------------------------------------------------------------
  // Please note that the plaintext passwords are hashed (with a random
  // salt) before being saved to the DB. Hashing algorithm used:
  //
  // crypto.pbkdf2(pwd, salt, 50000, 20, 'sha256', function(err,key) {
  //    console.log(key.toString('hex'))
  // });
  //
  // WARNING: It is usually not a good practice to write passwords
  // in plaintext form as shown here. Note however that the sole
  // purpose of this file is the initial configuration of the lab7
  // database.
  //-------------------------------------------------------------------
  users: [
    // User to roles relationship
    {
      username: "pperic",
      name: "Petar Perić",
      salt: "salt",
      password: "petar",
      role: "admin",
      bio:
        "Petar received the Ph.D. degree in Communication Systems from EPFL, Switzerland. In September 2006, Petar joined the University of Split, the Faculty of Electrical Engineering, Mechanical Engineering and Naval Architecture (FESB).",
    },

    {
      username: "ddunjic",
      name: "Dunja Dunjić",
      salt: "salt",
      password: "dunja",
      role: "member",
      bio:
        "Dunja is employed as a senior researcher at Electrical Engineering studies at Faculty of Electrical Engineering, Mechanical Engineering and Naval Architecture (FESB), University of Split, where she is actively involved in courses in the fields of cryptography and network security, wireless security, wireless sensor networks and human-computer interaction.",
    },

    {
      username: "mmatic",
      name: "Marko Matic",
      salt: "salt",
      password: "marko",
      role: "member",
      bio:
        "Magistar znanosti iz područja tehničkih znanosti, znanstvenog polja elektrotehnika. Sveučilišni studijski centar za stručne studije, Sveučilište u Splitu, Predstojnik Zavoda za elektroniku i viši predavač.",
    },

    {
      username: "john",
      name: "John Doe",
      salt: "salt",
      password: "john",
      role: "visitor",
      bio: "Not much to tell about JD",
    },
  ],

  // Chart data
  chart: {
    _id: "chart",
    temp: [],
    hum: [],
  },
};
