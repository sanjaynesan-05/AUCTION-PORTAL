const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Player name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Player role is required'],
      enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Base price cannot be negative'],
    },
    sold: {
      type: Boolean,
      default: false,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    price: {
      type: Number,
      default: null,
      min: [0, 'Price cannot be negative'],
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [16, 'Age must be at least 16'],
      max: [50, 'Age must be less than 50'],
    },
    battingStyle: {
      type: String,
      default: '',
    },
    bowlingStyle: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    stats: {
      matches: {
        type: Number,
        default: 0,
        min: 0,
      },
      runs: {
        type: Number,
        default: 0,
        min: 0,
      },
      wickets: {
        type: Number,
        default: 0,
        min: 0,
      },
      average: {
        type: Number,
        default: 0,
        min: 0,
      },
      strikeRate: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
playerSchema.index({ sold: 1 });
playerSchema.index({ role: 1 });
playerSchema.index({ teamId: 1 });
playerSchema.index({ name: 1 });

// Virtual for generating default avatar
playerSchema.virtual('avatarUrl').get(function () {
  if (this.image) {
    return this.image;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=6366f1&color=fff&size=128`;
});

// Ensure virtuals are included when converting to JSON
playerSchema.set('toJSON', { virtuals: true });
playerSchema.set('toObject', { virtuals: true });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
