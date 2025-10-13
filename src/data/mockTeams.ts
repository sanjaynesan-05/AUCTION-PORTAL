export interface Team {
  id: number;
  name: string;
  shortName: string;
  purse: number;
  logo: string;
  players: number[];
  color: string;
  primaryColor: string;
  secondaryColor: string;
}

export const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png',
    players: [],
    color: '#FFCC00',
    primaryColor: '#FFCC00',
    secondaryColor: '#003366'
  },
  {
    id: 2,
    name: 'Mumbai Indians',
    shortName: 'MI',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png',
    players: [],
    color: '#004BA0',
    primaryColor: '#004BA0',
    secondaryColor: '#FFD700'
  },
  {
    id: 3,
    name: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png',
    players: [],
    color: '#EC1C24',
    primaryColor: '#EC1C24',
    secondaryColor: '#FFD700'
  },
  {
    id: 4,
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png',
    players: [],
    color: '#3A225D',
    primaryColor: '#3A225D',
    secondaryColor: '#FFD700'
  },
  {
    id: 5,
    name: 'Delhi Capitals',
    shortName: 'DC',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png',
    players: [],
    color: '#004C93',
    primaryColor: '#004C93',
    secondaryColor: '#DC143C'
  },
  {
    id: 6,
    name: 'Rajasthan Royals',
    shortName: 'RR',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png',
    players: [],
    color: '#254AA5',
    primaryColor: '#254AA5',
    secondaryColor: '#FFB6C1'
  },
  {
    id: 7,
    name: 'Punjab Kings',
    shortName: 'PBKS',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png',
    players: [],
    color: '#ED1B24',
    primaryColor: '#ED1B24',
    secondaryColor: '#FFD700'
  },
  {
    id: 8,
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png',
    players: [],
    color: '#FF822A',
    primaryColor: '#FF822A',
    secondaryColor: '#000000'
  },
  {
    id: 9,
    name: 'Gujarat Titans',
    shortName: 'GT',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png',
    players: [],
    color: '#1B2631',
    primaryColor: '#1B2631',
    secondaryColor: '#FFD700'
  },
  {
    id: 10,
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    purse: 12000,
    logo: 'https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png',
    players: [],
    color: '#00A0E3',
    primaryColor: '#00A0E3',
    secondaryColor: '#FFD700'
  }
];

export default mockTeams;
