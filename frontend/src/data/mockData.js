/* ── Mock Data Store ─────────────────────────────────────────
   Simulates API responses. Replace with real API calls later.
───────────────────────────────────────────────────────────── */

export const CATEGORIES = [
  'About the University',
  'KYC Requirements',
  'Course Refund',
  'File Platform',
  'Expert Consultation',
  'Admissions',
  'Financial Aid',
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Arjun Mehta',    role: 'expert',  spark: 1240, avatarInitials: 'AM' },
  { id: 'u2', name: 'Priya Das',      role: 'member',  spark: 620,  avatarInitials: 'PD' },
  { id: 'u3', name: 'Rafi Hussain',   role: 'member',  spark: 390,  avatarInitials: 'RH' },
  { id: 'u4', name: 'Sneha Kapoor',   role: 'admin',   spark: 880,  avatarInitials: 'SK' },
  { id: 'u5', name: 'Dev Banerjee',   role: 'member',  spark: 55,   avatarInitials: 'DB' },
  { id: 'u6', name: 'Fatima Shaikh',  role: 'expert',  spark: 1580, avatarInitials: 'FS' },
  { id: 'u7', name: 'Nikhil Roy',     role: 'member',  spark: 210,  avatarInitials: 'NR' },
];

export const MOCK_QUESTIONS = [
  {
    id: 'q1',
    title: 'What documents are needed for KYC verification?',
    body: 'I recently enrolled and the portal is asking me to complete KYC. What exactly do I need to submit? Is an Aadhar card sufficient or do I also need a PAN card?',
    category: 'KYC Requirements',
    tags: ['kyc', 'documents', 'verification'],
    authorId: 'u2',
    timestamp: '2025-05-22T09:15:00Z',
    upvotes: 34,
    views: 287,
    status: 'answered',
    pinned: true,
    answers: ['a1', 'a2'],
    upvotedBy: [],
  },
  {
    id: 'q2',
    title: 'How long does the course refund process take?',
    body: 'I applied for a refund 10 days ago and haven\'t heard back. Is there an SLA for refund processing? Who do I follow up with?',
    category: 'Course Refund',
    tags: ['refund', 'payment', 'process'],
    authorId: 'u3',
    timestamp: '2025-05-23T14:30:00Z',
    upvotes: 18,
    views: 145,
    status: 'unanswered',
    pinned: false,
    answers: [],
    upvotedBy: [],
  },
  {
    id: 'q3',
    title: 'Can I upload a scanned copy or does it need to be a digital original?',
    body: 'For the file platform, the instructions say "original documents only" but I only have scanned PDFs. Would those be accepted?',
    category: 'File Platform',
    tags: ['upload', 'documents', 'file'],
    authorId: 'u5',
    timestamp: '2025-05-24T08:00:00Z',
    upvotes: 7,
    views: 63,
    status: 'answered',
    pinned: false,
    answers: ['a3'],
    upvotedBy: [],
  },
  {
    id: 'q4',
    title: 'How do I book a session with an expert consultant?',
    body: 'I see there\'s an expert consultation option but I can\'t figure out how to book a session. Is it done through the portal or via email?',
    category: 'Expert Consultation',
    tags: ['expert', 'booking', 'consultation'],
    authorId: 'u7',
    timestamp: '2025-05-24T11:20:00Z',
    upvotes: 12,
    views: 98,
    status: 'unanswered',
    pinned: false,
    answers: [],
    upvotedBy: [],
  },
  {
    id: 'q5',
    title: 'What is the university\'s policy on course transfers?',
    body: 'I enrolled in one program but want to switch to another. What\'s the procedure and are there any penalties?',
    category: 'About the University',
    tags: ['transfer', 'policy', 'course'],
    authorId: 'u2',
    timestamp: '2025-05-21T16:45:00Z',
    upvotes: 22,
    views: 189,
    status: 'answered',
    pinned: true,
    answers: ['a4'],
    upvotedBy: [],
  },
];

export const MOCK_ANSWERS = [
  {
    id: 'a1',
    questionId: 'q1',
    authorId: 'u1',
    body: 'For KYC verification, you need: (1) Government-issued photo ID — Aadhar card, PAN card, Passport, or Driver\'s License; (2) Proof of address (utility bill within 3 months); (3) A recent passport-size photograph. Aadhar card alone is sufficient for both ID and address proof if the address is current.',
    upvotes: 28,
    accepted: true,
    isExpert: true,
    expertType: 'University Registrar',
    timestamp: '2025-05-22T10:00:00Z',
    references: ['https://university.edu/kyc-policy'],
    upvotedBy: [],
    comments: [
      { id: 'c1', authorId: 'u2', body: 'Thank you! This is very clear.', timestamp: '2025-05-22T10:30:00Z' },
    ],
  },
  {
    id: 'a2',
    questionId: 'q1',
    authorId: 'u3',
    body: 'I went through this last month. Aadhar card works perfectly. Make sure the scanned copy is at least 200 DPI and the file is under 2MB. They rejected my first submission because the file was too large.',
    upvotes: 11,
    accepted: false,
    isExpert: false,
    expertType: null,
    timestamp: '2025-05-22T12:15:00Z',
    references: [],
    upvotedBy: [],
    comments: [],
  },
  {
    id: 'a3',
    questionId: 'q3',
    authorId: 'u1',
    body: 'Scanned PDFs are accepted as long as they are clearly legible. The term "original" here means it should be a scan of the physical document, not a digitally created file. Make sure the scan resolution is high enough that all text is readable.',
    upvotes: 5,
    accepted: true,
    isExpert: true,
    expertType: 'Technical Support',
    timestamp: '2025-05-24T09:30:00Z',
    references: [],
    upvotedBy: [],
    comments: [],
  },
  {
    id: 'a4',
    questionId: 'q5',
    authorId: 'u6',
    body: 'Course transfers are allowed within the first 30 days of enrollment at no penalty. After 30 days, a transfer fee of ₹2,000 applies. You need to fill the Course Transfer Request form (available in the Student Portal under Settings > Academic) and it requires approval from your current program coordinator.',
    upvotes: 19,
    accepted: true,
    isExpert: true,
    expertType: 'Academic Advisor',
    timestamp: '2025-05-21T18:00:00Z',
    references: [],
    upvotedBy: [],
    comments: [],
  },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'answer',  text: 'Arjun Mehta answered your question about KYC documents', time: '2h ago', read: false },
  { id: 'n2', type: 'upvote', text: 'Your answer received 5 new upvotes', time: '4h ago', read: false },
  { id: 'n3', type: 'badge',  text: 'You earned the "Contributor" badge!', time: '1d ago', read: true },
  { id: 'n4', type: 'mention', text: 'Priya Das mentioned you in a comment', time: '2d ago', read: true },
];

export const MOCK_FLAGS = [
  {
    id: 'f1',
    questionId: 'q2',
    reportedBy: 'u5',
    reason: 'Spam',
    date: '2025-05-23',
    status: 'pending',
  },
  {
    id: 'f2',
    questionId: 'q4',
    reportedBy: 'u3',
    reason: 'Misinformation',
    date: '2025-05-24',
    status: 'pending',
  },
];

export const FAQ_LANDING_ITEMS = [
  {
    id: 'f1',
    title: 'About the University',
    body: 'We are a premier online education institution offering accredited programs across technology, business, and healthcare. Founded in 2010, we have served over 50,000 students worldwide.',
    required: false,
    cta: null,
  },
  {
    id: 'f2',
    title: 'KYC Requirements',
    body: 'All students must complete KYC (Know Your Customer) verification within 7 days of enrollment. You will need a government-issued photo ID and proof of address. Failure to complete KYC may result in course access being suspended.',
    required: true,
    cta: { label: 'Start KYC Verification', href: '/onboarding' },
  },
  {
    id: 'f3',
    title: 'Course Refund Policy',
    body: 'Refunds are available within 14 days of enrollment if less than 20% of course content has been accessed. To initiate a refund, contact support@university.edu with your enrollment ID and reason.',
    required: false,
    cta: null,
  },
  {
    id: 'f4',
    title: 'File Platform',
    body: 'Our file platform allows you to securely upload and manage your documents. Supported formats: PDF, JPG, PNG. Maximum file size: 5MB per document.',
    required: false,
    cta: null,
  },
  {
    id: 'f5',
    title: 'Expert Consultation',
    body: 'Connect with verified experts in your field of study. Book a 30-minute consultation session through the portal. Sessions are available Monday–Friday, 9am–6pm IST.',
    required: false,
    cta: { label: 'View Experts', href: '/login' },
  },
];

/* ── Helper: get user by id ── */
export const getUserById = (id) => MOCK_USERS.find(u => u.id === id) || null;
export const getQuestionById = (id) => MOCK_QUESTIONS.find(q => q.id === id) || null;
export const getAnswersByQuestionId = (qid) => MOCK_ANSWERS.filter(a => a.questionId === qid);

/* ── Spark badge tier ── */
export const getSparkBadge = (points) => {
  if (points >= 1000) return { label: 'Champion',    color: '#1A2744', bg: 'rgba(26,39,68,0.1)',    star: true };
  if (points >= 500)  return { label: 'Expert',      color: '#b37c10', bg: 'rgba(232,160,32,0.15)', star: false };
  if (points >= 100)  return { label: 'Contributor', color: '#2563EB', bg: 'rgba(37,99,235,0.12)',  star: false };
  return               { label: 'Newcomer',           color: '#9AA3B2', bg: 'rgba(154,163,178,0.18)', star: false };
};

/* ── Relative timestamp ── */
export const relativeTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60000);
  const hr   = Math.floor(min / 60);
  const day  = Math.floor(hr / 24);
  if (min < 1)  return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr  < 24) return `${hr}h ago`;
  return `${day}d ago`;
};
