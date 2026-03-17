export interface Player {
  id: number;
  name: string;
  role: string;
  nationality: string;
  age: number;
  image: string;
  setNumber: number;
  setName: string;
}

export const mockPlayers: Player[] = [
  { id: 1, name: 'Virat Kohli', role: 'Batsman', nationality: 'India', age: 35, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/2.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 2, name: 'Jasprit Bumrah', role: 'Bowler', nationality: 'India', age: 30, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/8.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 3, name: 'MS Dhoni', role: 'Wicketkeeper', nationality: 'India', age: 42, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/28.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 4, name: 'Rohit Sharma', role: 'Batsman', nationality: 'India', age: 36, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/6.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 5, name: 'Rashid Khan', role: 'Bowler', nationality: 'Afghanistan', age: 25, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/109.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 6, name: 'Pat Cummins', role: 'All-rounder', nationality: 'Australia', age: 30, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/164.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 7, name: 'Jos Buttler', role: 'Wicketkeeper', nationality: 'England', age: 33, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/62.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 8, name: 'KL Rahul', role: 'Wicketkeeper', nationality: 'India', age: 31, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/32.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 9, name: 'Hardik Pandya', role: 'All-rounder', nationality: 'India', age: 30, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/7.png', setNumber: 1, setName: 'Marquee Players' },
  { id: 10, name: 'Shubman Gill', role: 'Batsman', nationality: 'India', age: 24, image: 'https://documents.iplt20.com/ipl/IPLHeadshot2024/54.png', setNumber: 1, setName: 'Marquee Players' },
];

export default mockPlayers;
