import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORY_EXAMPLES,
  CATEGORY_SENTENCE,
  buildSampleWhims,
  claimFavor,
  confirmPaidSignup,
  defaultSettings,
  initialState,
  markDone,
  markPaid,
  paypalSignupUrl,
  saveSettings,
  signupBlockReason,
  signupsTotal,
} from '../src/model.js';

const now = new Date(2026, 8, 23, 8, 0, 0);
const hash = 'a'.repeat(64);

test('board category is the 20-minute favor sentence', () => {
  assert.equal(CATEGORY_SENTENCE, 'Whim is for 20-minute unfinished favors.');
  assert.equal(CATEGORY_EXAMPLES.length, 8);
  assert.ok(CATEGORY_EXAMPLES.includes('Taste the soup and say if it needs salt'));
  assert.ok(CATEGORY_EXAMPLES.includes('Button the hard cuff on a shirt'));
});

test('samples are a dozen short favors with 20-minute windows', () => {
  const samples = buildSampleWhims(now);
  assert.equal(samples.length, 12);
  assert.ok(samples.every((whim) => whim.isSample && whim.status === 'open'));
  const titles = samples.map((whim) => whim.title).join(' ');
  assert.equal(/ride|deliver|clean|moving|movers/i.test(titles), false);
  for (const whim of samples) {
    const [sh, sm] = whim.windowStart.split(':').map(Number);
    const [eh, em] = whim.windowEnd.split(':').map(Number);
    assert.equal(eh * 60 + em - (sh * 60 + sm), 20);
  }
  for (const example of CATEGORY_EXAMPLES) {
    assert.ok(samples.some((whim) => whim.title === example));
  }
});

test('signup price defaults to 5 and PayPal.me builds an official amount URL', () => {
  const settings = defaultSettings();
  assert.equal(settings.signupPrice, 5);
  assert.equal(signupBlockReason(settings), 'Add the PayPal.me link in settings.');
  assert.equal(paypalSignupUrl('https://paypal.me/theirname', 5), 'https://paypal.me/theirname/5USD');
  assert.equal(paypalSignupUrl('https://www.paypal.com/signin', 5), null);
  assert.equal(paypalSignupUrl('https://paypal.me.evil.com/theirname', 5), null);
  assert.equal(paypalSignupUrl('javascript:alert(1)', 5), null);
});

test('account is created only by confirming a paid signup', () => {
  let state = initialState(now);
  const saved = saveSettings(state, { paypalMe: 'https://paypal.me/theirname', signupPrice: '5' });
  assert.equal(saved.ok, true);
  state = saved.state;
  assert.equal(state.users.length, 0);
  const created = confirmPaidSignup(state, {
    id: 'user-1',
    firstName: 'Nia',
    email: 'nia@example.com',
    password: 'pocket-123',
    passwordHash: hash,
    amount: 5,
  }, now);
  assert.equal(created.ok, true);
  assert.equal(created.state.users.length, 1);
  assert.equal(created.state.users[0].passwordHash, hash);
  assert.equal(JSON.stringify(created.state).includes('pocket-123'), false);
  assert.equal(created.state.signups[0].email, 'nia@example.com');
  assert.equal(created.state.signups[0].amount, 5);
  assert.equal(signupsTotal(created.state.signups), 5);
});

test('signup stays blocked without a PayPal.me link', () => {
  const state = initialState(now);
  const created = confirmPaidSignup(state, {
    id: 'user-1',
    firstName: 'Nia',
    email: 'nia@example.com',
    password: 'pocket-123',
    passwordHash: hash,
    amount: 5,
  }, now);
  assert.equal(created.ok, false);
  assert.match(created.error, /settings/i);
});

test('claim locks one favor and mark paid is only a later record', () => {
  let state = initialState(now);
  const user = { id: 'user-1', firstName: 'Nia', email: 'nia@example.com', passwordHash: hash };
  state = { ...state, users: [user], sessionUserId: user.id };
  const first = claimFavor(state, 'sample-1', user, now);
  assert.equal(first.ok, true);
  assert.equal(first.state.whims.find((whim) => whim.id === 'sample-1').claimerName, 'Nia');
  const second = claimFavor(first.state, 'sample-2', user, now);
  assert.equal(second.ok, false);
  const earlyPay = markPaid(first.state, 'sample-1', user, now);
  assert.equal(earlyPay.ok, false);
  const done = markDone(first.state, 'sample-1', user, now);
  const paid = markPaid(done.state, 'sample-1', user, now);
  assert.equal(paid.ok, true);
  assert.equal(paid.state.whims.find((whim) => whim.id === 'sample-1').status, 'paid');
  const another = claimFavor(paid.state, 'sample-2', user, now);
  assert.equal(another.ok, true);
});
