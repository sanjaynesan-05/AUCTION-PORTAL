const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      unique: true,
    },
    shortName: {
      type: String,
      required: [true, 'Short name is required'],
      trim: true,
      unique: true,
      maxlength: [5, 'Short name cannot exceed 5 characters'],
    },
    purse: {
      type: Number,
      required: [true, 'Purse is required'],
      default: 12000, // Default purse in lakhs
      min: [0, 'Purse cannot be negative'],
    },
    logo: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      required: [true, 'Team color is required'],
      default: '#000000',
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating total spent
teamSchema.virtual('totalSpent').get(function () {
  return 12000 - this.purse;
});

// Virtual for calculating remaining purse
teamSchema.virtual('remainingPurse').get(function () {
  return this.purse;
});

// Method to add player to team
teamSchema.methods.addPlayer = function (playerId, price) {
  if (this.purse >= price) {
    this.players.push(playerId);
    this.purse -= price;
    return true;
  }
  return false;
};

// Method to remove player from team
teamSchema.methods.removePlayer = function (playerId, price) {
  const index = this.players.indexOf(playerId);
  if (index > -1) {
    this.players.splice(index, 1);
    this.purse += price;
    return true;
  }
  return false;
};

// Ensure virtuals are included when converting to JSON
teamSchema.set('toJSON', { virtuals: true });
teamSchema.set('toObject', { virtuals: true });

// Indexes (name and shortName already have unique indexes from schema)
const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
