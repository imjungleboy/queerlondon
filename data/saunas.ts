export interface Sauna {
  id: string;
  name: string;
  description: string;
  address: string;
  area: string;
  imageUrl: string;
  instagram?: string;
  website?: string;
  tags: string[];
  openingHours?: string;
  lat: number;
  lng: number;
}

export const saunas: Sauna[] = [
  {
    id: 'sweatbox-soho',
    name: 'Sweatbox Sauna',
    description:
      'London\'s most central gay sauna, tucked above Soho. Clean, well-maintained facilities with a steam room, dry sauna, jacuzzi and private cabins. Welcoming to all ages and body types.',
    address: '1 Ramillies Street, Soho, W1F 7LN',
    area: 'Soho',
    imageUrl: 'https://media.timeout.com/images/105546790/image.jpg',
    instagram: 'sweatboxsoho',
    website: 'https://www.sweatboxsoho.com',
    tags: ['Steam Room', 'Dry Sauna', 'Jacuzzi', 'Cabins', 'Central London', 'Gay'],
    openingHours: 'Mon–Thu 12pm–11pm, Fri 12pm–12am, Sat 12pm–12am, Sun 12pm–10pm',
    lat: 51.5130,
    lng: -0.1312,
  },
  {
    id: 'pleasuredrome',
    name: 'Pleasuredrome',
    description:
      'One of London\'s largest gay saunas, located under the railway arches near Waterloo. Expansive facilities include multiple saunas, steam rooms, a large wet area, darkrooms and a chill-out lounge.',
    address: '8 Railway Arch, Mepham Street, Waterloo, SE1 8PT',
    area: 'South London',
    imageUrl: 'https://media.timeout.com/images/106214560/image.jpg',
    instagram: 'pleasuredrome',
    website: 'https://www.pleasuredrome.com',
    tags: ['Multi-room', 'Steam Room', 'Darkroom', 'Large', 'Gay', 'Fetish'],
    openingHours: 'Open 24 hours',
    lat: 51.5028,
    lng: -0.1135,
  },
  {
    id: 'chariots-streatham',
    name: 'Chariots Streatham',
    description:
      'Part of the long-running Chariots group, this South London outpost offers a relaxed environment with sauna, steam, pool, gym and private rooms. Popular with the local LGBTQ+ community.',
    address: '292–294 Streatham High Road, Streatham, SW16 1HF',
    area: 'South London',
    imageUrl: 'https://media.timeout.com/images/103741161/image.jpg',
    instagram: 'chariotssauna',
    website: 'https://www.chariots.co.uk',
    tags: ['Sauna', 'Steam', 'Pool', 'Gym', 'Gay', 'Relaxed'],
    openingHours: 'Mon–Thu 12pm–11pm, Fri–Sat 12pm–midnight, Sun 12pm–10pm',
    lat: 51.4254,
    lng: -0.1248,
  },
  {
    id: 'chariots-shoreditch',
    name: 'Chariots Shoreditch',
    description:
      'The East London outpost of the Chariots group, conveniently located in Shoreditch. Spacious facilities including sauna, steam room, jacuzzi and private cabins — popular with the East London queer crowd.',
    address: '1 Fairchild Street, Shoreditch, EC2A 3NS',
    area: 'East London',
    imageUrl: 'https://media.timeout.com/images/105546790/image.jpg',
    instagram: 'chariotssauna',
    website: 'https://www.chariots.co.uk',
    tags: ['Sauna', 'Steam', 'Jacuzzi', 'Cabins', 'Gay', 'East London'],
    openingHours: 'Mon–Thu 12pm–11pm, Fri–Sat 12pm–midnight, Sun 12pm–10pm',
    lat: 51.5225,
    lng: -0.0808,
  },
  {
    id: 'locker-room-sauna',
    name: 'The Locker Room',
    description:
      'A popular gay sauna in South London with a loyal regular clientele. Well-maintained facilities, a welcoming environment and good facilities make this a favourite away from the Soho crowds.',
    address: '8 Melior Street, London Bridge, SE1 3QP',
    area: 'South London',
    imageUrl: 'https://media.timeout.com/images/103741161/image.jpg',
    instagram: 'lockerroomsauna',
    website: 'https://www.thelockerroom.co.uk',
    tags: ['Sauna', 'Steam', 'Cruise', 'Gay', 'London Bridge'],
    openingHours: 'Mon–Thu 12pm–11pm, Fri–Sat 12pm–midnight, Sun 12pm–10pm',
    lat: 51.5005,
    lng: -0.0865,
  },
  {
    id: 'vault-139',
    name: 'Vault 139',
    description:
      'A fetish-friendly sauna and club space in the heart of Vauxhall. Popular with the kink and leather community, with regular themed nights and a relaxed dress-code policy that encourages self-expression.',
    address: '139 Goding Street, Vauxhall, SE11 5AW',
    area: 'Vauxhall',
    imageUrl: 'https://media.timeout.com/images/106214560/image.jpg',
    instagram: 'vault139london',
    tags: ['Sauna', 'Fetish', 'Leather', 'Kink', 'Cruising', 'Gay'],
    openingHours: 'Thu–Fri 8pm–4am, Sat 6pm–5am, Sun 4pm–1am',
    lat: 51.4849,
    lng: -0.1198,
  },
];
