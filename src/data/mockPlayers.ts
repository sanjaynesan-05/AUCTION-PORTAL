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
  image: string;
  stats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
  };
}

export const mockPlayers: Player[] = [
  { 
    id: 1, 
    name: 'Virat Kohli', 
    role: 'Batsman', 
    basePrice: 200, 
    sold: false, 
    nationality: 'India', 
    age: 35, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/1.png',
    stats: { matches: 223, runs: 7263, average: 37.25, strikeRate: 131.97 }
  },
  { 
    id: 2, 
    name: 'Jasprit Bumrah', 
    role: 'Bowler', 
    basePrice: 150, 
    sold: false, 
    nationality: 'India', 
    age: 30, 
    bowlingStyle: 'Right-arm fast',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/8.png',
    stats: { matches: 120, wickets: 165, average: 24.43, strikeRate: 19.17 }
  },
  { 
    id: 3, 
    name: 'MS Dhoni', 
    role: 'Wicketkeeper', 
    basePrice: 180, 
    sold: false, 
    nationality: 'India', 
    age: 42, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/28.png',
    stats: { matches: 250, runs: 5243, average: 39.13, strikeRate: 135.92 }
  },
  { 
    id: 4, 
    name: 'Rohit Sharma', 
    role: 'Batsman', 
    basePrice: 190, 
    sold: false, 
    nationality: 'India', 
    age: 36, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/6.png',
    stats: { matches: 243, runs: 6628, average: 31.17, strikeRate: 130.39 }
  },
  { 
    id: 5, 
    name: 'Rashid Khan', 
    role: 'Bowler', 
    basePrice: 140, 
    sold: false, 
    nationality: 'Afghanistan', 
    age: 25, 
    bowlingStyle: 'Right-arm leg-spin',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/109.png',
    stats: { matches: 76, wickets: 93, average: 24.34, strikeRate: 18.94 }
  },
  { 
    id: 6, 
    name: 'AB de Villiers', 
    role: 'Batsman', 
    basePrice: 170, 
    sold: false, 
    nationality: 'South Africa', 
    age: 40, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/4.png',
    stats: { matches: 184, runs: 5162, average: 39.70, strikeRate: 151.68 }
  },
  { 
    id: 7, 
    name: 'Pat Cummins', 
    role: 'All-rounder', 
    basePrice: 160, 
    sold: false, 
    nationality: 'Australia', 
    age: 30, 
    bowlingStyle: 'Right-arm fast',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/164.png',
    stats: { matches: 34, wickets: 32, average: 35.31, strikeRate: 27.84 }
  },
  { 
    id: 8, 
    name: 'Jos Buttler', 
    role: 'Wicketkeeper', 
    basePrice: 155, 
    sold: false, 
    nationality: 'England', 
    age: 33, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/62.png',
    stats: { matches: 103, runs: 3582, average: 40.25, strikeRate: 149.05 }
  },
  { 
    id: 9, 
    name: 'KL Rahul', 
    role: 'Wicketkeeper', 
    basePrice: 145, 
    sold: false, 
    nationality: 'India', 
    age: 31, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/32.png',
    stats: { matches: 132, runs: 4683, average: 47.83, strikeRate: 134.61 }
  },
  { 
    id: 10, 
    name: 'Glenn Maxwell', 
    role: 'All-rounder', 
    basePrice: 130, 
    sold: false, 
    nationality: 'Australia', 
    age: 35, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/53.png',
    stats: { matches: 129, runs: 2771, average: 26.20, strikeRate: 154.67 }
  },
  { 
    id: 11, 
    name: 'Ravindra Jadeja', 
    role: 'All-rounder', 
    basePrice: 135, 
    sold: false, 
    nationality: 'India', 
    age: 35, 
    bowlingStyle: 'Left-arm orthodox',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/25.png',
    stats: { matches: 220, runs: 2756, wickets: 157, average: 29.85, strikeRate: 127.02 }
  },
  { 
    id: 12, 
    name: 'Ben Stokes', 
    role: 'All-rounder', 
    basePrice: 165, 
    sold: false, 
    nationality: 'England', 
    age: 32, 
    battingStyle: 'Left-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/63.png',
    stats: { matches: 43, runs: 920, wickets: 28, average: 34.97, strikeRate: 134.31 }
  },
  { 
    id: 13, 
    name: 'Kagiso Rabada', 
    role: 'Bowler', 
    basePrice: 125, 
    sold: false, 
    nationality: 'South Africa', 
    age: 28, 
    bowlingStyle: 'Right-arm fast',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/101.png',
    stats: { matches: 64, wickets: 91, average: 20.37, strikeRate: 16.31 }
  },
  { 
    id: 14, 
    name: 'David Warner', 
    role: 'Batsman', 
    basePrice: 140, 
    sold: false, 
    nationality: 'Australia', 
    age: 37, 
    battingStyle: 'Left-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/85.png',
    stats: { matches: 176, runs: 6397, average: 41.59, strikeRate: 139.96 }
  },
  { 
    id: 15, 
    name: 'Suryakumar Yadav', 
    role: 'Batsman', 
    basePrice: 120, 
    sold: false, 
    nationality: 'India', 
    age: 33, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/15.png',
    stats: { matches: 115, runs: 3389, average: 31.77, strikeRate: 135.34 }
  },
  { 
    id: 16, 
    name: 'Mohammed Shami', 
    role: 'Bowler', 
    basePrice: 110, 
    sold: false, 
    nationality: 'India', 
    age: 33, 
    bowlingStyle: 'Right-arm fast',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/29.png',
    stats: { matches: 108, wickets: 195, average: 24.18, strikeRate: 17.05 }
  },
  { 
    id: 17, 
    name: 'Quinton de Kock', 
    role: 'Wicketkeeper', 
    basePrice: 130, 
    sold: false, 
    nationality: 'South Africa', 
    age: 31, 
    battingStyle: 'Left-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/87.png',
    stats: { matches: 77, runs: 2256, average: 31.33, strikeRate: 129.05 }
  },
  { 
    id: 18, 
    name: 'Hardik Pandya', 
    role: 'All-rounder', 
    basePrice: 175, 
    sold: false, 
    nationality: 'India', 
    age: 30, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/7.png',
    stats: { matches: 104, runs: 1476, wickets: 42, average: 28.20, strikeRate: 143.20 }
  },
  { 
    id: 19, 
    name: 'Trent Boult', 
    role: 'Bowler', 
    basePrice: 115, 
    sold: false, 
    nationality: 'New Zealand', 
    age: 34, 
    bowlingStyle: 'Left-arm fast',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/66.png',
    stats: { matches: 104, wickets: 121, average: 27.11, strikeRate: 20.37 }
  },
  { 
    id: 20, 
    name: 'Shubman Gill', 
    role: 'Batsman', 
    basePrice: 125, 
    sold: false, 
    nationality: 'India', 
    age: 24, 
    battingStyle: 'Right-handed',
    image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/54.png',
    stats: { matches: 68, runs: 2133, average: 34.40, strikeRate: 124.24 }
  },
];

export default mockPlayers;
