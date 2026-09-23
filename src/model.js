export const CATEGORY_SENTENCE = 'Whim is for 20-minute unfinished favors.';

export const CATEGORY_EXAMPLES = [
  'Taste the soup and say if it needs salt',
  'Listen to a speech once and say where it drags',
  'Fold the one basket by the door',
  'Walk the dog to the corner and back',
  'Hold the ladder for ten minutes',
  'Read a short email and say if it sounds rude',
  'Watch a kid’s rehearsal and clap at the end',
  'Button the hard cuff on a shirt',
];

export const FAVOR_MINUTES = 20;
export const DEFAULT_SIGNUP_PRICE = 5;

const NAME_RE = /^[\p{L}][\p{L}\p{M}'’.\- ]{0,23}$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAYPAL_ME_RE = /^https:\/\/(www\.)?paypal\.me\/([A-Za-z0-9][A-Za-z0-9-]{1,49})\/?$/i;

const SAMPLE_SEED = [
  {
    title: 'Taste the soup and say if it needs salt',
    detail: 'One spoon from the pot. Say salt, or say leave it.',
    price: 8,
    neighborhood: 'Ladle Court',
    windowStart: '09:00',
    posterName: 'Nia',
  },
  {
    title: 'Listen to a speech once and say where it drags',
    detail: 'The page is on the table. Point at the slow part.',
    price: 12,
    neighborhood: 'Podium Walk',
    windowStart: '10:00',
    posterName: 'Ellis',
  },
  {
    title: 'Fold the one basket by the door',
    detail: 'Only that basket. Leave it on the chair.',
    price: 7,
    neighborhood: 'Hem Lane',
    windowStart: '11:00',
    posterName: 'Priya',
  },
  {
    title: 'Walk the dog to the corner and back',
    detail: 'The leash is on the hook. Corner and back, then you are done.',
    price: 10,
    neighborhood: 'Corner Elm',
    windowStart: '12:00',
    posterName: 'Hugo',
  },
  {
    title: 'Hold the ladder for ten minutes',
    detail: 'You hold it. You do not climb. Ten minutes while the bulb is changed.',
    price: 14,
    neighborhood: 'Bulb Street',
    windowStart: '13:00',
    posterName: 'Samira',
  },
  {
    title: 'Read a short email and say if it sounds rude',
    detail: 'It is open on the tablet. Rude or fine, in one sentence.',
    price: 9,
    neighborhood: 'Ink Mews',
    windowStart: '14:00',
    posterName: 'Jules',
  },
  {
    title: 'Watch a kid’s rehearsal and clap at the end',
    detail: 'One song in the living room. Clap when it ends.',
    price: 11,
    neighborhood: 'Parlor Green',
    windowStart: '15:00',
    posterName: 'Bea',
  },
  {
    title: 'Button the hard cuff on a shirt',
    detail: 'Left sleeve. The buttonhole is tight.',
    price: 6,
    neighborhood: 'Cuff Row',
    windowStart: '16:00',
    posterName: 'Idris',
  },
  {
    title: 'Fasten the necklace I cannot clasp',
    detail: 'The clasp sits at the back of the neck. I cannot reach it.',
    price: 8,
    neighborhood: 'Clasp Alley',
    windowStart: '17:00',
    posterName: 'Noor',
  },
  {
    title: 'Read the birthday card aloud and stop if it sounds stiff',
    detail: 'Once through. Stop me on the line that sounds stiff.',
    price: 9,
    neighborhood: 'Card Street',
    windowStart: '17:40',
    posterName: 'Cal',
  },
  {
    title: 'Tell me if the porch light is actually out',
    detail: 'From the sidewalk only. Out, or just dim.',
    price: 7,
    neighborhood: 'Stoop Road',
    windowStart: '18:20',
    posterName: 'Hana',
  },
  {
    title: 'Steady the music stand while I turn one page',
    detail: 'Hold the stand. One page turn, then let go.',
    price: 10,
    neighborhood: 'Stand Yard',
    windowStart: '19:00',
    posterName: 'Otto',
  },
];

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function minutesOfDay(date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function parseHHMM(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

export function formatHHMM(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatTimeLabel(hhmm) {
  const mins = parseHHMM(hhmm);
  if (mins == null) return hhmm || '';
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? 'pm' : 'am';
  h %= 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')}${suffix}`;
}

export function formatWindow(start, end) {
  return `${formatTimeLabel(start)}–${formatTimeLabel(end)}`;
}

export function formatMoney(amount) {
  return `$${Number(amount).toFixed(0)}`;
}

export function formatLongDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatStamp(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function windowFromStart(startHHMM) {
  const start = parseHHMM(startHHMM);
  if (start == null) return null;
  const end = start + FAVOR_MINUTES;
  if (end >= 24 * 60) return null;
  return { windowStart: formatHHMM(start), windowEnd: formatHHMM(end) };
}

export function suggestStart(now = new Date()) {
  if (minutesOfDay(now) < 8 * 60) return '09:00';
  let start = Math.ceil((minutesOfDay(now) + 30) / 10) * 10;
  if (start + FAVOR_MINUTES >= 24 * 60) return null;
  return formatHHMM(start);
}

export function canonicalPaypalMe(raw) {
  const match = String(raw || '').trim().match(PAYPAL_ME_RE);
  if (!match) return null;
  return `https://paypal.me/${match[2]}`;
}

export function normalizeSignupPrice(value) {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').trim());
  if (!Number.isInteger(n) || n < 1 || n > 500) return null;
  return n;
}

export function paypalSignupUrl(paypalMe, amount) {
  const canonical = canonicalPaypalMe(paypalMe);
  const dollars = normalizeSignupPrice(amount);
  if (!canonical || dollars == null) return null;
  const username = canonical.slice('https://paypal.me/'.length);
  return `https://paypal.me/${username}/${dollars}USD`;
}

export function defaultSettings() {
  return { paypalMe: null, signupPrice: DEFAULT_SIGNUP_PRICE };
}

export function signupBlockReason(settings) {
  if (!canonicalPaypalMe(settings?.paypalMe)) {
    return 'Add the PayPal.me link in settings.';
  }
  if (normalizeSignupPrice(settings?.signupPrice) == null) {
    return 'Set a signup price in settings.';
  }
  return null;
}

function endMinutes(whim) {
  return parseHHMM(whim.windowEnd);
}

function shiftWindow(now) {
  const start = suggestStart(now);
  if (!start) return null;
  return windowFromStart(start);
}

export function buildSampleWhims(now = new Date()) {
  const today = todayKey(now);
  return SAMPLE_SEED.map((sample, index) => {
    const window = windowFromStart(sample.windowStart);
    return {
      id: `sample-${index + 1}`,
      title: sample.title,
      detail: sample.detail,
      price: sample.price,
      neighborhood: sample.neighborhood,
      windowStart: window.windowStart,
      windowEnd: window.windowEnd,
      date: today,
      posterId: `sample-poster-${index + 1}`,
      posterName: sample.posterName,
      isSample: true,
      status: 'open',
      claimerId: null,
      claimerName: null,
      claimedAt: null,
      doneAt: null,
      paidAt: null,
      createdAt: now.toISOString(),
    };
  });
}

export function refreshOpenSamples(whims, now = new Date()) {
  const today = todayKey(now);
  const nowMin = minutesOfDay(now);
  return whims.map((whim) => {
    if (!whim.isSample || whim.status !== 'open') return whim;
    const end = endMinutes(whim);
    if (whim.date === today && end != null && end > nowMin) return whim;
    const shifted = shiftWindow(now);
    if (!shifted) return { ...whim, date: today };
    return { ...whim, date: today, ...shifted };
  });
}

export function ensureSamples(whims, now = new Date()) {
  const fresh = buildSampleWhims(now);
  const ids = new Set(whims.map((whim) => whim.id));
  const missing = fresh.filter((sample) => !ids.has(sample.id));
  return refreshOpenSamples([...whims, ...missing], now);
}

export function initialState(now = new Date()) {
  return {
    users: [],
    sessionUserId: null,
    whims: ensureSamples([], now),
    settings: defaultSettings(),
    signups: [],
  };
}

function cleanUser(user) {
  if (!user || typeof user.id !== 'string' || typeof user.email !== 'string') return null;
  return {
    id: user.id,
    firstName: String(user.firstName || 'Neighbor').slice(0, 24),
    email: String(user.email).toLowerCase(),
    passwordHash: String(user.passwordHash || ''),
  };
}

function cleanWhim(whim) {
  if (!whim || typeof whim.id !== 'string' || typeof whim.title !== 'string') return null;
  if (!['open', 'claimed', 'done', 'paid'].includes(whim.status)) return null;
  return whim;
}

function cleanSignup(signup) {
  if (!signup || typeof signup.id !== 'string') return null;
  const amount = normalizeSignupPrice(signup.amount);
  if (amount == null || typeof signup.email !== 'string') return null;
  return {
    id: signup.id,
    userId: signup.userId || null,
    firstName: String(signup.firstName || '').slice(0, 24),
    email: String(signup.email).toLowerCase(),
    amount,
    paidAt: String(signup.paidAt || ''),
  };
}

export function hydrate(raw, now = new Date()) {
  if (!raw || typeof raw !== 'object') return initialState(now);
  const users = Array.isArray(raw.users) ? raw.users.map(cleanUser).filter(Boolean) : [];
  const whims = Array.isArray(raw.whims) ? raw.whims.map(cleanWhim).filter(Boolean) : [];
  const signups = Array.isArray(raw.signups) ? raw.signups.map(cleanSignup).filter(Boolean) : [];
  const paypalMe = canonicalPaypalMe(raw.settings?.paypalMe);
  const signupPrice = normalizeSignupPrice(raw.settings?.signupPrice) ?? DEFAULT_SIGNUP_PRICE;
  const sessionUserId = users.some((user) => user.id === raw.sessionUserId) ? raw.sessionUserId : null;
  return {
    users,
    sessionUserId,
    whims: ensureSamples(whims, now),
    settings: { paypalMe, signupPrice },
    signups,
  };
}

export function currentUser(state) {
  return state.users.find((user) => user.id === state.sessionUserId) || null;
}

export function normalizeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function validateNewAccount(input, state) {
  const firstName = normalizeName(input.firstName);
  const email = normalizeEmail(input.email);
  const password = input.password || '';
  if (!NAME_RE.test(firstName)) return 'Use a first name, up to 24 characters.';
  if (!EMAIL_RE.test(email) || email.length > 80) return 'Enter an email address.';
  if (password.length < 6 || password.length > 72) return 'Use a password of at least 6 characters.';
  if (state.users.some((user) => user.email === email)) {
    return 'That email is already signed up on this browser. Log in instead.';
  }
  return null;
}

export function confirmPaidSignup(state, input, now = new Date()) {
  const block = signupBlockReason(state.settings);
  if (block) return { ok: false, error: block };
  const error = validateNewAccount(input, state);
  if (error) return { ok: false, error };
  if (!/^[a-f0-9]{64}$/.test(input.passwordHash || '')) {
    return { ok: false, error: 'Could not store that password on this browser.' };
  }
  const amount = normalizeSignupPrice(input.amount);
  if (amount == null) return { ok: false, error: 'The signup price is not valid.' };
  const firstName = normalizeName(input.firstName);
  const email = normalizeEmail(input.email);
  const user = {
    id: input.id,
    firstName,
    email,
    passwordHash: input.passwordHash,
  };
  const signup = {
    id: `signup-${input.id}`,
    userId: input.id,
    firstName,
    email,
    amount,
    paidAt: now.toISOString(),
  };
  return {
    ok: true,
    user,
    signup,
    state: {
      ...state,
      users: [...state.users, user],
      signups: [signup, ...state.signups],
      sessionUserId: user.id,
    },
  };
}

export function login(state, { email, passwordHash }) {
  const normalized = normalizeEmail(email);
  const user = state.users.find((candidate) => candidate.email === normalized);
  if (!user || user.passwordHash !== passwordHash) {
    return { ok: false, error: 'That email and password don’t match.' };
  }
  return { ok: true, user, state: { ...state, sessionUserId: user.id } };
}

export function signOut(state) {
  return { ...state, sessionUserId: null };
}

export function saveSettings(state, input) {
  const signupPrice = normalizeSignupPrice(input.signupPrice);
  if (signupPrice == null) {
    return { ok: false, error: 'Enter a signup price in whole dollars, from 1 to 500.' };
  }
  const trimmed = String(input.paypalMe || '').trim();
  let paypalMe = null;
  if (trimmed) {
    paypalMe = canonicalPaypalMe(trimmed);
    if (!paypalMe) {
      return { ok: false, error: 'Use a PayPal.me link such as https://paypal.me/theirname.' };
    }
  }
  return { ok: true, state: { ...state, settings: { paypalMe, signupPrice } } };
}

export function signupsTotal(signups) {
  return signups.reduce((sum, signup) => sum + signup.amount, 0);
}

export function validateFavorDraft(draft, now = new Date()) {
  const errors = {};
  const title = String(draft.title || '').trim();
  const detail = String(draft.detail || '').trim();
  const neighborhood = String(draft.neighborhood || '').trim();
  const price = Number(draft.price);
  const window = windowFromStart(draft.windowStart);
  if (title.length < 8) errors.title = 'Name the favor in a short sentence.';
  else if (title.length > 80) errors.title = 'Keep the favor under 80 characters.';
  if (detail.length > 280) errors.detail = 'Keep the note under 280 characters.';
  if (neighborhood.length < 2) errors.neighborhood = 'Name the neighborhood.';
  else if (neighborhood.length > 40) errors.neighborhood = 'Keep the neighborhood short.';
  if (!Number.isInteger(price) || price < 1 || price > 500) {
    errors.price = 'Set a fixed price from $1 to $500.';
  }
  if (!window) {
    errors.window = 'Choose a start time so the 20 minutes finish today.';
  } else if (parseHHMM(window.windowEnd) <= minutesOfDay(now)) {
    errors.window = 'That 20-minute window has already closed.';
  }
  return errors;
}

export function postFavor(state, user, draft, now = new Date(), id) {
  if (!user) return { ok: false, error: 'Sign in to post a favor.' };
  const errors = validateFavorDraft(draft, now);
  if (Object.keys(errors).length) return { ok: false, errors };
  const window = windowFromStart(draft.windowStart);
  const favor = {
    id,
    title: draft.title.trim(),
    detail: String(draft.detail || '').trim(),
    price: Number(draft.price),
    neighborhood: draft.neighborhood.trim(),
    windowStart: window.windowStart,
    windowEnd: window.windowEnd,
    date: todayKey(now),
    posterId: user.id,
    posterName: user.firstName,
    isSample: false,
    status: 'open',
    claimerId: null,
    claimerName: null,
    claimedAt: null,
    doneAt: null,
    paidAt: null,
    createdAt: now.toISOString(),
  };
  return { ok: true, favor, state: { ...state, whims: [favor, ...state.whims] } };
}

export function activeClaim(state, userId) {
  return state.whims.find((whim) => whim.claimerId === userId && whim.status === 'claimed') || null;
}

export function openBoardWhims(state, now = new Date()) {
  const today = todayKey(now);
  const nowMin = minutesOfDay(now);
  return state.whims
    .filter((whim) => {
      if (whim.status !== 'open' || whim.date !== today) return false;
      const end = endMinutes(whim);
      return end != null && end > nowMin;
    })
    .slice()
    .sort((a, b) => parseHHMM(a.windowStart) - parseHHMM(b.windowStart));
}

export function claimFavor(state, whimId, user, now = new Date()) {
  if (!user) return { ok: false, error: 'Sign up to claim a favor.' };
  const whim = state.whims.find((item) => item.id === whimId);
  if (!whim) return { ok: false, error: 'That favor is no longer on the board.' };
  if (whim.posterId === user.id) return { ok: false, error: 'This one is yours. Someone else can claim it.' };
  if (whim.status !== 'open') return { ok: false, error: 'Someone already claimed this favor.' };
  if (whim.date !== todayKey(now)) return { ok: false, error: 'That favor is not on today’s board.' };
  const end = endMinutes(whim);
  if (end == null || end <= minutesOfDay(now)) return { ok: false, error: 'That window has closed.' };
  if (activeClaim(state, user.id)) {
    return {
      ok: false,
      error: 'You already have a favor in progress. Mark it done before claiming another.',
    };
  }
  const whims = state.whims.map((item) =>
    item.id === whimId
      ? {
          ...item,
          status: 'claimed',
          claimerId: user.id,
          claimerName: user.firstName,
          claimedAt: now.toISOString(),
        }
      : item,
  );
  return { ok: true, state: { ...state, whims } };
}

function stampFavor(state, whimId, user, from, to, stampKey, now, wrongStep) {
  const whim = state.whims.find((item) => item.id === whimId);
  if (!user || !whim || whim.claimerId !== user.id) {
    return { ok: false, error: 'That favor is not locked to you.' };
  }
  if (whim.status !== from) return { ok: false, error: wrongStep };
  const whims = state.whims.map((item) =>
    item.id === whimId ? { ...item, status: to, [stampKey]: now.toISOString() } : item,
  );
  return { ok: true, state: { ...state, whims } };
}

export function markDone(state, whimId, user, now = new Date()) {
  return stampFavor(state, whimId, user, 'claimed', 'done', 'doneAt', now, 'This favor is not in progress.');
}

export function markPaid(state, whimId, user, now = new Date()) {
  return stampFavor(
    state,
    whimId,
    user,
    'done',
    'paid',
    'paidAt',
    now,
    'Mark it done before you mark it paid.',
  );
}

export function favorsPostedBy(state, userId) {
  return state.whims
    .filter((whim) => whim.posterId === userId)
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function favorsClaimedBy(state, userId) {
  const rank = { claimed: 0, done: 1, paid: 2 };
  return state.whims
    .filter((whim) => whim.claimerId === userId)
    .slice()
    .sort((a, b) => {
      const diff = (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
      if (diff !== 0) return diff;
      return String(b.claimedAt).localeCompare(String(a.claimedAt));
    });
}
