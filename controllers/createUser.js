const User = require('../models/user');
const Team = require('../models/team');
const bcrypt = require('bcrypt');
const Player = require('../models/player');
const { faker } = require('@faker-js/faker');
const createUserSchema = require('../validators/createUserVal');

const createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required fields' });
    }

    const { error } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Function to generate a random player with age between 18 and 40
    function generateRandomPlayer() {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const country = faker.location.country();
      const minAge = 18;
      const maxAge = 40;
      const ageOffset = getRandomInt(0, maxAge - minAge);
      const age = minAge + ageOffset;
      const position = faker.helpers.randomize(['goalkeeper', 'defender', 'midfielder', 'attacker']);
      const marketValue = 1000000;
    
      return {
        firstName,
        lastName,
        country,
        age,
        position,
        marketValue,
      };
    }
    
    // Function to generate 20 random players
    function generateRandomPlayers() {
      const players = [];
    
      // Generate 3 goalkeepers
      for (let i = 0; i < 3; i++) {
        players.push(generateRandomPlayer());
      }
    
      // Generate 6 defenders
      for (let i = 0; i < 6; i++) {
        players.push(generateRandomPlayer());
      }
    
      // Generate 6 midfielders
      for (let i = 0; i < 6; i++) {
        players.push(generateRandomPlayer());
      }
    
      // Generate 5 attackers
      for (let i = 0; i < 5; i++) {
        players.push(generateRandomPlayer());
      }
    
      return players;
    }
    
    const initialPlayers = generateRandomPlayers();
    const newPlayers = initialPlayers.map(player => ({ ...player, owner: user._id }));
    await Player.insertMany(newPlayers);

    const newTeam = new Team({
      name: `${username} FC`,
      country: faker.address.country(),
      players: newPlayers.map(player => player._id),
    });

    // Save the team to the database
    const savedTeam = await newTeam.save();

    // Associate the team with the user
    user.team = savedTeam._id;
    await user.save();

    res.status(201).json({ message: 'User and initial players created successfully', user, players: newPlayers, team: savedTeam });
  } catch (error) {
    next(error);
  }
};

module.exports = createUser;
