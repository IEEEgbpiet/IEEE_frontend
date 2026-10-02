// DATA FEEDING TEAM:
// Naye member add karne ke liye niche wale format me object add karein.
// - 'name' mandatory hai.
// - 'role' optional hai.

export interface PastMember {
  name: string;
  role?: string;
}

export const pastMembers2026: PastMember[] = [
  { name: 'Jiyanshi Batra', role: 'Branch Chair' },
  { name: 'Paras Dhiman', role: 'Branch Vice Chair' },
  { name: 'Vanshika Painuly', role: 'Secretary' },
  { name: 'Akriti Chauhan', role: 'Treasurer' },
  { name: 'Muskan Singh', role: 'Creative Media Head' },
  { name: 'Shivam Dangwal', role: 'Web Master' },
];

export const pastMembers2025: PastMember[] = [
  // Branch Chair
  { name: 'Tejas Chhabra', role: 'Branch Chair' },
  { name: 'Nitin Goswami', role: 'Branch Chair' },
  

  // Branch Vice Chair
  { name: 'Parth Uniyal', role: 'Branch Vice Chair' },
 
  { name: 'Rakshit Pant', role: 'Branch Vice Chair' },

  // Secretary
  { name: 'Vanshika Painuly', role: 'Secretary' },
  { name: 'Ananya Chauhan', role: 'Secretary' },
 

  // Treasurer
  { name: 'Antriksha Saklani', role: 'Treasurer' },
  { name: 'Sehna Saraswat', role: 'Treasurer' },
 

  // Web Master
  { name: 'Khushi Lingwal', role: 'Web Master' },
  { name: 'Divyanshi Naithani', role: 'Web Master' },
  

  // Creative Media Head
  { name: 'Paras Dhiman', role: 'Creative Media Head' },
  { name: 'Muskan Singh', role: 'Creative Media Head' },
];