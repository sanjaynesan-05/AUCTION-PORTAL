export interface Player {
  id: number;
  name: string;
  role: string;
  basePrice: number;
  sold: boolean;
  teamId?: number;
  price?: number;
  nationality: string;
  age: number;
  battingStyle?: string;
  bowlingStyle?: string;
}

export const mockPlayers: Player[] = [
  { id: 1, name: 'Virat Kohli', role: 'Batsman', basePrice: 200, sold: false, nationality: 'India', age: 35, battingStyle: 'Right-handed' },
  { id: 2, name: 'Jasprit Bumrah', role: 'Bowler', basePrice: 150, sold: false, nationality: 'India', age: 30, bowlingStyle: 'Right-arm fast' },
  { id: 3, name: 'MS Dhoni', role: 'Wicketkeeper', basePrice: 180, sold: false, nationality: 'India', age: 42, battingStyle: 'Right-handed' },
  { id: 4, name: 'Rohit Sharma', role: 'Batsman', basePrice: 190, sold: false, nationality: 'India', age: 36, battingStyle: 'Right-handed' },
  { id: 5, name: 'Rashid Khan', role: 'Bowler', basePrice: 140, sold: false, nationality: 'Afghanistan', age: 25, bowlingStyle: 'Right-arm leg-spin' },
  { id: 6, name: 'AB de Villiers', role: 'Batsman', basePrice: 170, sold: false, nationality: 'South Africa', age: 40, battingStyle: 'Right-handed' },
  { id: 7, name: 'Pat Cummins', role: 'All-rounder', basePrice: 160, sold: false, nationality: 'Australia', age: 30, bowlingStyle: 'Right-arm fast' },
  { id: 8, name: 'Jos Buttler', role: 'Wicketkeeper', basePrice: 155, sold: false, nationality: 'England', age: 33, battingStyle: 'Right-handed' },
  { id: 9, name: 'KL Rahul', role: 'Wicketkeeper', basePrice: 145, sold: false, nationality: 'India', age: 31, battingStyle: 'Right-handed' },
  { id: 10, name: 'Glenn Maxwell', role: 'All-rounder', basePrice: 130, sold: false, nationality: 'Australia', age: 35, battingStyle: 'Right-handed' },
  { id: 11, name: 'Ravindra Jadeja', role: 'All-rounder', basePrice: 135, sold: false, nationality: 'India', age: 35, bowlingStyle: 'Left-arm orthodox' },
  { id: 12, name: 'Ben Stokes', role: 'All-rounder', basePrice: 165, sold: false, nationality: 'England', age: 32, battingStyle: 'Left-handed' },
  { id: 13, name: 'Kagiso Rabada', role: 'Bowler', basePrice: 125, sold: false, nationality: 'South Africa', age: 28, bowlingStyle: 'Right-arm fast' },
  { id: 14, name: 'David Warner', role: 'Batsman', basePrice: 140, sold: false, nationality: 'Australia', age: 37, battingStyle: 'Left-handed' },
  { id: 15, name: 'Suryakumar Yadav', role: 'Batsman', basePrice: 120, sold: false, nationality: 'India', age: 33, battingStyle: 'Right-handed' },
  { id: 16, name: 'Mohammed Shami', role: 'Bowler', basePrice: 110, sold: false, nationality: 'India', age: 33, bowlingStyle: 'Right-arm fast' },
  { id: 17, name: 'Quinton de Kock', role: 'Wicketkeeper', basePrice: 130, sold: false, nationality: 'South Africa', age: 31, battingStyle: 'Left-handed' },
  { id: 18, name: 'Hardik Pandya', role: 'All-rounder', basePrice: 175, sold: false, nationality: 'India', age: 30, battingStyle: 'Right-handed' },
  { id: 19, name: 'Trent Boult', role: 'Bowler', basePrice: 115, sold: false, nationality: 'New Zealand', age: 34, bowlingStyle: 'Left-arm fast' },
  { id: 20, name: 'Shubman Gill', role: 'Batsman', basePrice: 125, sold: false, nationality: 'India', age: 24, battingStyle: 'Right-handed' },
];

export default mockPlayers;
