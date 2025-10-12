export interface Team {
  id: number;
  name: string;
  shortName: string;
  purse: number;
  logo: string;
  players: number[];
  color: string;
}

export const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    purse: 1000,
    logo: '/team_logos/csk.png',
    players: [],
    color: '#FFCC00'
  },
  {
    id: 2,
    name: 'Mumbai Indians',
    shortName: 'MI',
    purse: 1000,
    logo: '/team_logos/mi.png',
    players: [],
    color: '#004BA0'
  },
  {
    id: 3,
    name: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    purse: 1000,
    logo: '/team_logos/rcb.png',
    players: [],
    color: '#EC1C24'
  },
  {
    id: 4,
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    purse: 1000,
    logo: '/team_logos/kkr.png',
    players: [],
    color: '#3A225D'
  },
  {
    id: 5,
    name: 'Delhi Capitals',
    shortName: 'DC',
    purse: 1000,
    logo: '/team_logos/dc.png',
    players: [],
    color: '#004C93'
  },
  {
    id: 6,
    name: 'Rajasthan Royals',
    shortName: 'RR',
    purse: 1000,
    logo: '/team_logos/rr.png',
    players: [],
    color: '#254AA5'
  },
  {
    id: 7,
    name: 'Punjab Kings',
    shortName: 'PBKS',
    purse: 1000,
    logo: '/team_logos/pbks.png',
    players: [],
    color: '#ED1B24'
  },
  {
    id: 8,
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    purse: 1000,
    logo: '/team_logos/srh.png',
    players: [],
    color: '#FF822A'
  },
];

export default mockTeams;
