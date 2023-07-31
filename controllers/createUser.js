const User = require('../models/user');
const Team = require('../models/team');
const bcrypt = require('bcrypt');
const Player = require('../models/player');
const Chance = require('chance');
const createUserSchema = require('../validators/createUserVal');

const chance = new Chance();

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

    const getRandomAge = () => {
      for (let i = 18; i <= 35; i++) {
        const agess = ((Math.random() * 1)) * i
        const age = Math.floor(agess)
        if (agess > 18 && agess < 35) {
          return age
        }  
      }
    }

// Fisher-Yates (also known as Knuth) shuffle algorithm
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const positions = (goalkeeper, defender, midfielder, attacker) => {
  const players = [];

  // Adding all players to the array
  for (let i = 0; i < 3; i++) {
    players.push(goalkeeper);
  }
  for (let i = 0; i < 6; i++) {
    players.push(defender);
  }
  for (let i = 0; i < 6; i++) {
    players.push(midfielder);
  }
  for (let i = 0; i < 5; i++) {
    players.push(attacker);
  }

  shuffleArray(players); // Shuffle the array randomly

    return players; // Return and remove the last player from the array
  
};
const getRandomPosition = positions("Goalkeeper", "Defender", "Midfielder", "Attacker")
const playerPosition = getRandomPosition;

  
    // Function to generate a random player with age between 18 and 30
    function generateRandomPlayer() {
      const firstName = chance.first({ gender: "male" });
      const lastName = chance.last();
      const country = chance.country({ full: true });
      const age = getRandomAge();
      const position = chance.pickone(playerPosition);
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
    async function generateRandomPlayers() {
      const players = [];

      for (let i = 0; i < 20; i++) {
        const playerData = generateRandomPlayer();
        playerData.position = playerPosition[i % playerPosition.length];
        const player = new Player(playerData);
        await player.save();
        players.push(player._id);
      }
      return players;
    } 
 
    const playerDetails = await generateRandomPlayers();
    const newTeam = new Team({
      name: `${username} FC`,
      country: chance.country({ full: true }),
      players: playerDetails,
    });
    // Save the team to the database
    const savedTeam = await newTeam.save();

    // Associate the team with the user
    user.team = savedTeam._id;
    await user.save();

    res.status(201).json({ message: 'User and initial players created successfully', user, team: savedTeam });
  } catch (error) {
    next(error);
  }
};

module.exports = createUser;
