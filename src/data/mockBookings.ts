import { MOCK_ADVISORS } from './advisors';

export interface Booking {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorCredential: string;
  advisorInitials: string;
  advisorColor: string;
  type: 'discovery' | 'session';
  sessionNumber?: number;
  totalSessions?: number;
  planName?: string;
  date: string;
  time: string;
  duration: string;
  meetLink: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'starting_soon';
  feedbackSubmitted: boolean;
  price: string;
}

export interface Engagement {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorCredential: string;
  advisorInitials: string;
  advisorColor: string;
  planName: string;
  price: number;
  sessionsCompleted: number;
  totalSessions: number;
  kycDone: boolean;
  pendingDocs: number;
  status: 'active' | 'proposed' | 'completed';
  nextSession?: string;
  proposalMessage?: string;
  expiresIn?: number;
}

export interface KYCDocument {
  id: string;
  name: string;
  type: 'engagement' | 'kyc';
  status: 'signed' | 'pending' | 'not_sent';
  signedDate?: string;
  docuSignRef?: string;
  description?: string;
}

export interface Conversation {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorInitials: string;
  advisorColor: string;
  advisorCredential: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'advisor' | 'system';
  text: string;
  time: string;
  type: 'text' | 'document' | 'system';
  fileName?: string;
  fileSize?: string;
}

const pk = MOCK_ADVISORS[0];
const rm = MOCK_ADVISORS[1];
const sn = MOCK_ADVISORS[2];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    advisorId: pk.id,
    advisorName: pk.name,
    advisorCredential: 'CFP',
    advisorInitials: pk.avatarInitials,
    advisorColor: pk.avatarColor,
    type: 'discovery',
    date: 'Tuesday, 10 March 2026',
    time: '11:00 AM IST',
    duration: '60 minutes',
    meetLink: '#',
    status: 'confirmed',
    feedbackSubmitted: false,
    price: 'FREE',
  },
  {
    id: 'b2',
    advisorId: rm.id,
    advisorName: rm.name,
    advisorCredential: 'CFA',
    advisorInitials: rm.avatarInitials,
    advisorColor: rm.avatarColor,
    type: 'discovery',
    date: 'Monday, 3 March 2026',
    time: '3:00 PM IST',
    duration: '60 minutes',
    meetLink: '#',
    status: 'completed',
    feedbackSubmitted: false,
    price: 'FREE',
  },
  {
    id: 'b3',
    advisorId: pk.id,
    advisorName: pk.name,
    advisorCredential: 'CFP',
    advisorInitials: pk.avatarInitials,
    advisorColor: pk.avatarColor,
    type: 'session',
    sessionNumber: 1,
    totalSessions: 4,
    planName: 'Standard Plan',
    date: 'Thursday, 20 March 2026',
    time: '11:00 AM IST',
    duration: '60 minutes',
    meetLink: '#',
    status: 'confirmed',
    feedbackSubmitted: false,
    price: 'Included',
  },
];

export const MOCK_ENGAGEMENTS: Engagement[] = [
  {
    id: 'e1',
    advisorId: pk.id,
    advisorName: pk.name,
    advisorCredential: 'CFP \u00b7 SEBI RIA',
    advisorInitials: pk.avatarInitials,
    advisorColor: pk.avatarColor,
    planName: 'Standard Plan',
    price: 18000,
    sessionsCompleted: 3,
    totalSessions: 8,
    kycDone: true,
    pendingDocs: 1,
    status: 'active',
    nextSession: 'Tuesday, 18 March \u00b7 11:00 AM',
  },
  {
    id: 'e2',
    advisorId: sn.id,
    advisorName: sn.name,
    advisorCredential: 'CA \u00b7 CFP',
    advisorInitials: sn.avatarInitials,
    advisorColor: sn.avatarColor,
    planName: 'Standard Plan',
    price: 18000,
    sessionsCompleted: 0,
    totalSessions: 4,
    kycDone: false,
    pendingDocs: 3,
    status: 'proposed',
    proposalMessage: 'Based on our discovery call, I think this plan gives you the best foundation for your tax planning needs. We\u2019ll start with a comprehensive review of your current tax situation.',
    expiresIn: 5,
  },
];

export const MOCK_KYC_DOCS: KYCDocument[] = [
  { id: 'd1', name: 'Engagement Agreement', type: 'engagement', status: 'signed', signedDate: '15 Jan 2026', docuSignRef: 'DS-489201', description: 'Scope of advisory services, fee structure, and payment terms' },
  { id: 'd2', name: 'Fee Disclosure Document', type: 'engagement', status: 'signed', signedDate: '16 Jan 2026', docuSignRef: 'DS-489205', description: 'SEBI-mandated fee transparency document' },
  { id: 'd3', name: 'Risk Assessment Form', type: 'engagement', status: 'pending', description: 'Understanding your risk profile and investment preferences' },
  { id: 'd4', name: 'PAN Card', type: 'kyc', status: 'signed', description: 'DigiLocker verified' },
  { id: 'd5', name: 'Aadhaar', type: 'kyc', status: 'signed', description: 'DigiLocker verified' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    advisorId: pk.id,
    advisorName: pk.name,
    advisorInitials: pk.avatarInitials,
    advisorColor: pk.avatarColor,
    advisorCredential: pk.credentials,
    lastMessage: 'Thanks for sharing your portfolio details. I\u2019ll review everything before our session.',
    lastMessageTime: '2m ago',
    unreadCount: 3,
    online: true,
  },
  {
    id: 'c2',
    advisorId: rm.id,
    advisorName: rm.name,
    advisorInitials: rm.avatarInitials,
    advisorColor: rm.avatarColor,
    advisorCredential: rm.credentials,
    lastMessage: 'Let me know if you have questions about the proposal.',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    online: false,
  },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', conversationId: 'c1', sender: 'system', text: 'Discovery call confirmed \u00b7 10 March 11:00 AM', time: '8 Mar', type: 'system' },
  { id: 'm2', conversationId: 'c1', sender: 'advisor', text: 'Hi! Looking forward to our call on Tuesday. Could you share your current investment details beforehand so we can make the most of our time?', time: '8 Mar', type: 'text' },
  { id: 'm3', conversationId: 'c1', sender: 'user', text: 'Sure! I have a few SIPs running and some FDs. Let me compile the details.', time: '8 Mar', type: 'text' },
  { id: 'm4', conversationId: 'c1', sender: 'user', text: '', time: '9 Mar', type: 'document', fileName: 'Investment_Summary.pdf', fileSize: '245 KB' },
  { id: 'm5', conversationId: 'c1', sender: 'advisor', text: 'Thanks for sharing your portfolio details. I\u2019ll review everything before our session.', time: '2m ago', type: 'text' },
];

export const MOCK_REVIEWS = [
  { id: 'r1', name: 'Arjun K.', city: 'Bangalore', initials: 'AK', rating: 5, time: '2 weeks ago', text: 'Really appreciated how Priya broke down my tax situation without the jargon. She made everything so clear and actionable.', reply: 'Thank you Arjun! Looking forward to our next session.' },
  { id: 'r2', name: 'Meera S.', city: 'Mumbai', initials: 'MS', rating: 5, time: '1 month ago', text: 'Finally someone who listens first and advises later. My SIPs are now properly allocated for the first time.', reply: null },
  { id: 'r3', name: 'Siddharth P.', city: 'Pune', initials: 'SP', rating: 4, time: '2 months ago', text: 'Great session overall. Would have liked a bit more time to discuss insurance options but very knowledgeable.', reply: null },
  { id: 'r4', name: 'Deepa N.', city: 'Chennai', initials: 'DN', rating: 5, time: '3 months ago', text: 'Priya helped me save almost 2L in taxes this year. Best investment I\u2019ve made.', reply: 'So glad to hear that Deepa! Let\u2019s keep optimising.' },
];
