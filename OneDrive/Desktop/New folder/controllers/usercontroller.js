var db = require('../models');
var User = db.User; // Use "User" from the "db" object
var Contact = db.Contact;
var Role= db.Role;

const {Sequelize , QueryTypes  } = require('sequelize');
var adduser = (req, res) => {
  const jane = User.build({ firstName: "Jane", lastName: "Jane" }); // Correct the property names
  console.log(jane instanceof User); // true
  console.log(jane.firstName); // "Jane"
  
  (async () => {
    try {
      await jane.save();
      console.log('Jane was saved to the database!');
    } catch (error) {
      console.error(error); // Correct the error handling
    }
  })();

  console.log(jane.toJSON());
  res.status(200).json(jane.toJSON());
};
var getusers = async(req,res)=>
{    const data  = await User.findAll({});
     res.status(200).json(
        {
           data:data
        }
     );
}

var getuser = async (req, res) => {
    const userId = req.params.id; // Get the user ID from the URL parameter
    const data = await User.findByPk(userId); 
    res.status(200).json({ data: data });
  };
  var postusers = async (req, res) => {
    try {
      var postData = req.body;
      const user = await Post.create(postData);
      res.status(201).json({ data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
 var deleteuser =  async function deleteuser(req, res) {
    const userId = req.params.id;
    const result = await User.destroy({
      where: {
        id: userId
      }
    });
}
const queryuser = async function (req, res) {
  try {
    const data = await User.findAll({
      attributes: ['id', 'firstName']
    });

    res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }   
}
const finderuser = async function (req, res) {
  try {
    const result = await User.findAndCountAll({
      where: { firstName: 'farhan' },
    });
    
    // Destructure the result to access count and rows
    const { count, rows } = result;

    res.status(200).json({ data: rows, count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
var getuser = async function (req, res) {
  try {
    const result = await User.findAll({
    });
    
    // Destructure the result to access count and rows
    

    res.status(200).json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
var setuser = async function (req, res) {
  try {
    const result = await User.create({
      firstName:'hasnain',
      lastName:'baber'
    });
    
    // Destructure the result to access count and rows
    

    res.status(200).json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

var validateuser = async function (req,res)
{ try 
  {

    const result = await User.create(
      {
        firstName:'farhan',
        lastName:'zafar'
        
      })
      res.status(200).json({result});
  } 
  catch(e)
  {
    res.status(200).json({message:'name already exist'});
  }
 
}


var rawquery = async function (req,res)
{ 
  // try 
  // {


const users = await db.sequelize.query("SELECT * FROM `users`", 
{ type: QueryTypes.SELECT });

      res.status(200).json({users});
  // } 
 
}


var one_to_one = async function (req, res) {
  try {
  //   var data = await User.create({ firstName: 'Haseeb', lastName: 'Aftab' });
  //   if (data && data.id) {
  //     await Contact.create({ userId: data.id, address: 'abc', phone: '03234424' });
  //     res.status(201).json({ message: 'User and Contact created successfully' });
  //   } else {
  //     res.status(400).json({ message: 'User creation failed' });
  //   }

  var data = await User.findAll({
    include:Contact
  })
  res.status(500).json({ data });
 

  } catch (e) {
    res.status(500).json({ e });
  }
}


 

var one_to_many = async function (req, res) {
  try 
  {
    var data = await User.findAll({

attributes:['firstName','lastName'],
      include:[{
        model:Contact,
        attributes:['address','phone']
      }]
    })
    res.status(500).json({ data });
   
  } 
  catch (e) {
    res.status(500).json({ e });
  }
}

 var manytomany = async function (req,res)
 {
  try {
    const userData = {
      firstName: 'Farhan',
      lastName: 'Zafar',
    };

    // Create a user
    const user = await User.create(userData);

    if (user) {
      const roleData = [
        { name: 'Admin' },
        { name: 'Editor' },
      ];

      // Create roles
      const roles = await Role.bulkCreate(roleData);

      // Associate the user with the roles
      await user.setRoles(roles);

      res.status(201).json({ message: 'User and Roles created successfully', user, roles });
    } else {
      res.status(400).json({ message: 'User creation failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
 }

 var roles = async function (req,res)
 {

 try {
  const { roleID, userIDs } = req.body;

  // Find the role by ID
  const role = await Role.findByPk(roleID);

  if (!role) {
    return res.status(404).json({ message: 'Role not found' });
  }

  // Find the users by their IDs
  const users = await User.findAll({
    where: { id: userIDs },
  });

  if (users.length === 0) {
    return res.status(404).json({ message: 'No users found' });
  }

  // Associate the role with the users
  await role.setUsers(users);

  res.status(200).json({ message: 'Role assigned to users successfully' });
} catch (error) {
  res.status(500).json({ message: 'Internal server error', error: error.message });
}


 }
  var usersdetails = async function(req,res) {
    try {
      // Find all users and include associated roles
      const users = await User.findAll({
        include: [Role], // Include the Role model to get associated roles
      });
  
      if (!users) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      res.status(200).json({ message: 'All users with their roles', users });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
      
  }
  
  module.exports = { 
    adduser,
    getusers,
    getuser,
    postusers,
    deleteuser,// Add the delete user handler
    queryuser,
    finderuser,
    getuser,
    setuser,
    validateuser,
    rawquery,
    one_to_one,
    one_to_many,
    manytomany,
    roles,
    usersdetails

  };
  