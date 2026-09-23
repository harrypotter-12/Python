import { useEffect, useRef, useState } from 'react';
import { hashPassword } from './hash.js';
import {
  CATEGORY_EXAMPLES,
  CATEGORY_SENTENCE,
  activeClaim,
  claimFavor,
  confirmPaidSignup,
  currentUser,
  favorsClaimedBy,
  favorsPostedBy,
  formatLongDate,
  formatMoney,
  formatStamp,
  formatWindow,
  login,
  markDone,
  markPaid,
  openBoardWhims,
  paypalSignupUrl,
  postFavor,
  saveSettings,
  signOut,
  signupBlockReason,
  signupsTotal,
  suggestStart,
  validateFavorDraft,
  validateNewAccount,
  windowFromStart,
} from './model.js';
import { loadState, saveState } from './storage.js';

const VIEWS = ['board', 'signup', 'login', 'post', 'work', 'posted', 'settings', 'signups'];

function readView() {
  const name = window.location.hash.replace(/^#\//, '');
  return VIEWS.includes(name) ? name : 'board';
}

const TITLES = {
  board: 'Whim — same-day claim board',
  signup: 'Sign up — Whim',
  login: 'Log in — Whim',
  post: 'Post a favor — Whim',
  work: 'My work — Whim',
  posted: 'Posted by me — Whim',
  settings: 'Settings — Whim',
  signups: 'Signups — Whim',
};

export default function App() {
  const [state, setState] = useState(null);
  const [view, setView] = useState(readView);
  const [notice, setNotice] = useState('');
  const [persistFailed, setPersistFailed] = useState(false);
  const skipNoticeClear = useRef(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setPersistFailed(!saveState(loaded));
  }, []);

  useEffect(() => {
    const sync = () => {
      setView(readView());
      if (skipNoticeClear.current) skipNoticeClear.current = false;
      else setNotice('');
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    document.title = TITLES[view] || TITLES.board;
    window.scrollTo(0, 0);
  }, [view]);

  function go(next, nextNotice = '') {
    setNotice(nextNotice);
    if (window.location.hash === `#/${next}`) {
      setView(next);
      return;
    }
    skipNoticeClear.current = true;
    window.location.hash = `#/${next}`;
  }

  function commit(next) {
    setPersistFailed(!saveState(next));
    setState(next);
  }

  if (!state) {
    return <p className="booting">Opening the board…</p>;
  }

  const user = currentUser(state);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header user={user} view={view} onSignOut={() => { commit(signOut(state)); go('board', 'Signed out.'); }} />
      {persistFailed && (
        <p className="banner" role="status">This browser is not keeping Whim after a refresh.</p>
      )}
      {notice && <p className="notice" role="status">{notice}</p>}
      <main id="main">
        {view === 'board' && (
          <Board state={state} user={user} onClaim={(whimId) => {
            const result = claimFavor(state, whimId, user);
            if (!result.ok) return result.error;
            commit(result.state);
            go('work', 'Locked to you.');
            return '';
          }} />
        )}
        {view === 'signup' && (
          <Signup
            state={state}
            signedIn={Boolean(user)}
            onCreate={async (draft, amount) => {
              const passwordHash = await hashPassword(draft.password);
              const result = confirmPaidSignup(state, {
                ...draft,
                passwordHash,
                amount,
                id: crypto.randomUUID(),
              });
              if (!result.ok) return result.error;
              commit(result.state);
              go('board', `${result.user.firstName}, your account is created.`);
              return '';
            }}
          />
        )}
        {view === 'login' && (
          <Login
            signedIn={Boolean(user)}
            onLogin={async (draft) => {
              const passwordHash = await hashPassword(draft.password);
              const result = login(state, { email: draft.email, passwordHash });
              if (!result.ok) return result.error;
              commit(result.state);
              go('board', `Welcome back, ${result.user.firstName}.`);
              return '';
            }}
          />
        )}
        {view === 'post' && (
          <PostFavor
            user={user}
            onPost={(draft) => {
              const result = postFavor(state, user, draft, new Date(), crypto.randomUUID());
              if (!result.ok) return result;
              commit(result.state);
              go('posted', 'Posted on today’s board.');
              return { ok: true };
            }}
          />
        )}
        {view === 'work' && (
          <MyWork
            user={user}
            favors={user ? favorsClaimedBy(state, user.id) : []}
            onDone={(id) => {
              const result = markDone(state, id, user);
              if (!result.ok) return result.error;
              commit(result.state);
              return '';
            }}
            onPaid={(id) => {
              const result = markPaid(state, id, user);
              if (!result.ok) return result.error;
              commit(result.state);
              return '';
            }}
          />
        )}
        {view === 'posted' && (
          <Posted user={user} favors={user ? favorsPostedBy(state, user.id) : []} />
        )}
        {view === 'settings' && (
          <Settings
            settings={state.settings}
            onSave={(draft) => {
              const result = saveSettings(state, draft);
              if (!result.ok) return result.error;
              commit(result.state);
              return '';
            }}
          />
        )}
        {view === 'signups' && <Signups signups={state.signups} />}
      </main>
      <footer className="site-footer">
        <p>
          Creating an account is what pays Whim. The payer finishes on PayPal.
          A favor’s price is the agreed amount between two people. Mark paid only records that the poster paid.
          Whim does not charge a card.
        </p>
      </footer>
    </>
  );
}

function Header({ user, view, onSignOut }) {
  return (
    <header className="site-header">
      <a className="brand" href="#/board">
        <Logo />
        <span className="brand-name">whim</span>
      </a>
      <p className="brand-tag">Same-day claim board</p>
      <nav className="nav" aria-label="Sections">
        <a href="#/board" aria-current={view === 'board' ? 'page' : undefined}>Board</a>
        {user ? (
          <>
            <a href="#/post" aria-current={view === 'post' ? 'page' : undefined}>Post</a>
            <a href="#/work" aria-current={view === 'work' ? 'page' : undefined}>My work</a>
            <a href="#/posted" aria-current={view === 'posted' ? 'page' : undefined}>Posted by me</a>
          </>
        ) : (
          <a className="signup-link" href="#/signup" aria-current={view === 'signup' ? 'page' : undefined}>Sign up</a>
        )}
        <a href="#/settings" aria-current={view === 'settings' ? 'page' : undefined}>Settings</a>
        <a href="#/signups" aria-current={view === 'signups' ? 'page' : undefined}>Signups</a>
        {user ? (
          <>
            <span className="who">{user.firstName}</span>
            <button type="button" className="nav-link" onClick={onSignOut}>Sign out</button>
          </>
        ) : (
          <a href="#/login" aria-current={view === 'login' ? 'page' : undefined}>Log in</a>
        )}
      </nav>
    </header>
  );
}

function Logo() {
  return (
    <svg className="logo" viewBox="0 0 36 28" aria-hidden="true">
      <path fill="#f3d48a" d="M4 3h20a2 2 0 0 1 2 2v5.2a3.2 3.2 0 0 0 0 6.1V23a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <circle cx="26.2" cy="13.7" r="2" fill="#1b3a32" />
    </svg>
  );
}

function Board({ state, user, onClaim }) {
  const whims = openBoardWhims(state);
  const busy = user ? activeClaim(state, user.id) : null;
  const [error, setError] = useState('');

  return (
    <section className="board" data-testid="board">
      <p className="category-line" data-testid="category-sentence">{CATEGORY_SENTENCE}</p>
      <p className="category-examples">{CATEGORY_EXAMPLES.join('. ')}.</p>
      <div className="board-head">
        <h1>Today’s board</h1>
        <p className="date-line">{formatLongDate(new Date())} · each window is 20 minutes</p>
      </div>
      {!user && (
        <p className="banner">
          You can read the board. <a href="#/signup">Sign up</a> to post or claim a favor.
        </p>
      )}
      {busy && (
        <p className="banner">You already have a favor in progress. Mark it done before claiming another.</p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      {whims.length === 0 ? (
        <Empty
          title="Nothing open today"
          body="If one small favor is sitting unfinished, post it before midnight."
        />
      ) : (
        <div className="board-grid">
          {whims.map((whim) => (
            <Ticket key={whim.id} whim={whim}>
              {!user && <a className="btn block" href="#/signup">Sign up to claim</a>}
              {user && whim.posterId === user.id && <button type="button" className="btn block" disabled>Your favor</button>}
              {user && whim.posterId !== user.id && (
                <button
                  type="button"
                  className="btn block"
                  data-testid="claim"
                  disabled={Boolean(busy)}
                  onClick={() => setError(onClaim(whim.id) || '')}
                >
                  Claim
                </button>
              )}
            </Ticket>
          ))}
        </div>
      )}
    </section>
  );
}

function Ticket({ whim, children }) {
  return (
    <article className="ticket">
      <div className="stub">
        <span className="agreed-label">Agreed</span>
        <span className="price">{formatMoney(whim.price)}</span>
        <span className="agreed-label">today</span>
      </div>
      <div className="ticket-body">
        <div className="ticket-top">
          <p className="neighborhood">{whim.neighborhood}</p>
          {whim.isSample && <span className="sample-flag">Sample</span>}
        </div>
        <h2>{whim.title}</h2>
        {whim.detail && <p className="detail">{whim.detail}</p>}
        <p className="meta">
          {formatWindow(whim.windowStart, whim.windowEnd)} · Posted by {whim.posterName}
        </p>
        {children}
      </div>
    </article>
  );
}

function Signup({ state, signedIn, onCreate }) {
  const price = state.settings.signupPrice;
  const block = signupBlockReason(state.settings);
  const payUrl = paypalSignupUrl(state.settings.paypalMe, price);
  const [error, setError] = useState('');
  const [armed, setArmed] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({ firstName: '', email: '', password: '' });

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setArmed(false);
    setPendingAmount(null);
  }

  function arm(event) {
    const problem = validateNewAccount({ ...draft, password: draft.password }, state);
    if (problem || !payUrl) {
      event.preventDefault();
      setError(problem || block);
      setArmed(false);
      return;
    }
    setError('');
    setArmed(true);
    setPendingAmount(price);
  }

  async function confirm(event) {
    event.preventDefault();
    if (!armed || pendingAmount == null || block) return;
    setBusy(true);
    try {
      setError(await onCreate(draft, pendingAmount) || '');
    } finally {
      setBusy(false);
    }
  }

  if (signedIn) {
    return (
      <section className="sheet">
        <h1>You’re already signed in</h1>
        <p><a href="#/board">Back to the board</a></p>
      </section>
    );
  }

  return (
    <section className="sheet signup-sheet">
      <div>
        <h1>Sign up</h1>
        <p className="lede">A first name is enough to be known by on the board.</p>
      </div>
      <form className="stack-form" onSubmit={confirm} data-testid="signup-form">
        <p className="price-callout" data-testid="signup-price">
          Creating an account costs <strong>{formatMoney(price)}</strong>. You pay it on PayPal.
        </p>
        <Field label="First name" id="first-name">
          <input
            id="first-name"
            name="firstName"
            autoComplete="given-name"
            value={draft.firstName}
            onChange={(event) => update('firstName', event.target.value)}
            required
          />
        </Field>
        <Field label="Email" id="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={draft.email}
            onChange={(event) => update('email', event.target.value)}
            required
          />
        </Field>
        <Field label="Password" id="password" hint="For signing in to Whim on this browser. Not a PayPal or bank password.">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={draft.password}
            onChange={(event) => update('password', event.target.value)}
            required
          />
        </Field>
        {error && <p className="form-error" role="alert">{error}</p>}
        {payUrl ? (
          <a
            className="btn paypal"
            data-testid="paypal-pay"
            href={payUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={arm}
          >
            Pay with PayPal
          </a>
        ) : (
          <button type="button" className="btn paypal" data-testid="paypal-pay" disabled>
            Pay with PayPal
          </button>
        )}
        <p className="fine" id="pay-note">
          {block
            ? `${block} Creating an account costs ${formatMoney(price)}, and you pay it on PayPal.`
            : `Opens PayPal for ${formatMoney(price)}. The payer finishes on PayPal. Whim does not charge a card itself.`}
        </p>
        <button
          type="submit"
          className="btn secondary"
          data-testid="confirm-paid"
          disabled={!armed || !payUrl || busy}
        >
          I paid on PayPal — create my account
        </button>
        <p className="fine">
          The account is created only after you confirm you paid. Whim never asks for a bank password,
          a bank account number, a routing number, a card number, or a PayPal password.
        </p>
        <p className="fine">Already paid for an account? <a href="#/login">Log in</a></p>
      </form>
    </section>
  );
}

function Login({ signedIn, onLogin }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    setBusy(true);
    try {
      setError(await onLogin({
        email: String(form.get('email') || ''),
        password: String(form.get('password') || ''),
      }) || '');
    } finally {
      setBusy(false);
    }
  }

  if (signedIn) {
    return <section className="sheet"><h1>You’re already signed in</h1><p><a href="#/board">Back to the board</a></p></section>;
  }

  return (
    <section className="sheet">
      <h1>Log in</h1>
      <p className="lede">Logging in does not charge you again.</p>
      <form className="stack-form" onSubmit={submit}>
        <Field label="Email" id="login-email">
          <input id="login-email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password" id="login-password">
          <input id="login-password" name="password" type="password" autoComplete="current-password" required />
        </Field>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>Log in</button>
        <p className="fine">Need an account? <a href="#/signup">Sign up</a></p>
      </form>
    </section>
  );
}

function PostFavor({ user, onPost }) {
  const startDefault = suggestStart() || '';
  const [draft, setDraft] = useState({
    title: '',
    detail: '',
    price: '',
    neighborhood: '',
    windowStart: startDefault,
  });
  const [errors, setErrors] = useState({});
  const window = windowFromStart(draft.windowStart);

  if (!user) {
    return (
      <section className="sheet">
        <h1>Post a favor</h1>
        <Empty title="Sign in to post" body="A favor needs a name on it. Create an account or log in." />
        <p><a className="btn" href="#/signup">Sign up</a></p>
      </section>
    );
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateFavorDraft(draft);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const result = onPost(draft);
    if (!result.ok) setErrors(result.errors || { form: result.error });
  }

  return (
    <section className="sheet">
      <h1>Post a favor</h1>
      <p className="lede">One small favor, about 20 minutes, for a fixed price. Something a company would not take.</p>
      <form className="stack-form" onSubmit={submit}>
        <Field label="The favor" id="title" hint="A tiny unfinished task. Taste the soup and say if it needs salt." error={errors.title}>
          <input
            id="title"
            value={draft.title}
            placeholder="Taste the soup and say if it needs salt"
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          />
        </Field>
        <Field label="A little more" id="detail" error={errors.detail}>
          <textarea
            id="detail"
            rows={3}
            value={draft.detail}
            onChange={(event) => setDraft({ ...draft, detail: event.target.value })}
          />
        </Field>
        <Field label="Fixed price" id="price" hint="The agreed amount for this favor. Whim does not collect it." error={errors.price}>
          <input
            id="price"
            inputMode="numeric"
            value={draft.price}
            onChange={(event) => setDraft({ ...draft, price: event.target.value })}
          />
        </Field>
        <Field label="Neighborhood" id="neighborhood" error={errors.neighborhood}>
          <input
            id="neighborhood"
            placeholder="Quill Street"
            value={draft.neighborhood}
            onChange={(event) => setDraft({ ...draft, neighborhood: event.target.value })}
          />
        </Field>
        <Field
          label="Starts today"
          id="window-start"
          hint={window ? `Lasts 20 minutes, until ${formatWindow(window.windowStart, window.windowEnd).split('–')[1]}.` : 'The 20 minutes have to finish today.'}
          error={errors.window}
        >
          <input
            id="window-start"
            type="time"
            value={draft.windowStart}
            onChange={(event) => setDraft({ ...draft, windowStart: event.target.value })}
          />
        </Field>
        {errors.form && <p className="form-error" role="alert">{errors.form}</p>}
        <button className="btn" type="submit">Post this favor</button>
      </form>
    </section>
  );
}

function MyWork({ user, favors, onDone, onPaid }) {
  if (!user) {
    return (
      <section className="sheet">
        <h1>My work</h1>
        <Empty title="Sign in to see your favors" body="Favors you claim show up here." />
        <p><a className="btn" href="#/signup">Sign up</a></p>
      </section>
    );
  }

  return (
    <section className="sheet" data-testid="my-work">
      <h1>My work</h1>
      <p className="lede">Favors locked to you. Mark done, then mark paid. That record does not pay Whim.</p>
      {favors.length === 0 ? (
        <Empty title="Nothing claimed yet" body="Take one open favor from the board. You can hold one at a time until you mark it done." />
      ) : (
        <div className="stack">
          {favors.map((whim) => (
            <WorkCard key={whim.id} whim={whim} onDone={onDone} onPaid={onPaid} />
          ))}
        </div>
      )}
    </section>
  );
}

function WorkCard({ whim, onDone, onPaid }) {
  const [error, setError] = useState('');
  return (
    <Ticket whim={whim}>
      <p className="locked">Locked to you</p>
      {whim.status === 'claimed' && (
        <button type="button" className="btn" data-testid="mark-done" onClick={() => setError(onDone(whim.id) || '')}>
          Mark done
        </button>
      )}
      {whim.status === 'done' && (
        <>
          <p className="meta">Marked done</p>
          <button type="button" className="btn" data-testid="mark-paid" onClick={() => setError(onPaid(whim.id) || '')}>
            Mark paid
          </button>
        </>
      )}
      {whim.status === 'paid' && (
        <p className="receipt">
          Paid recorded. The poster paid the agreed {formatMoney(whim.price)}. Whim did not charge a card.
        </p>
      )}
      {whim.status !== 'paid' && (
        <p className="fine">
          The price is the agreed amount. Mark paid records that the poster paid. It does not charge a card, and it does not pay Whim.
        </p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </Ticket>
  );
}

function Posted({ user, favors }) {
  if (!user) {
    return (
      <section className="sheet">
        <h1>Posted by me</h1>
        <Empty title="Sign in to see your posts" body="Favors you post, and who claimed them, show up here." />
      </section>
    );
  }
  return (
    <section className="sheet">
      <h1>Posted by me</h1>
      {favors.length === 0 ? (
        <Empty title="You haven’t posted a favor" body="Post one for today: a small favor, a neighborhood, 20 minutes, and a fixed price." />
      ) : (
        <div className="stack">
          {favors.map((whim) => (
            <Ticket key={whim.id} whim={whim}>
              <p className="locked">
                {whim.claimerName ? `Claimed by ${whim.claimerName}` : 'Still open'}
                {whim.status === 'done' && ' · marked done'}
                {whim.status === 'paid' && ` · paid recorded, agreed ${formatMoney(whim.price)}`}
              </p>
            </Ticket>
          ))}
        </div>
      )}
    </section>
  );
}

function Settings({ settings, onSave }) {
  const [paypalMe, setPaypalMe] = useState(settings.paypalMe || '');
  const [signupPrice, setSignupPrice] = useState(String(settings.signupPrice));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  function submit(event) {
    event.preventDefault();
    const result = onSave({ paypalMe, signupPrice });
    if (result) {
      setSaved(false);
      setError(result);
      return;
    }
    setError('');
    setSaved(true);
  }

  return (
    <section className="sheet">
      <h1>Settings</h1>
      <p className="lede">Owner settings for this browser. People pay the signup price on PayPal when they create an account.</p>
      <form className="stack-form" onSubmit={submit} data-testid="settings-form">
        <Field label="PayPal.me link" id="paypal" hint="Example: https://paypal.me/theirname">
          <input
            id="paypal"
            name="paypalMe"
            type="url"
            inputMode="url"
            placeholder="https://paypal.me/theirname"
            autoComplete="off"
            spellCheck={false}
            value={paypalMe}
            onChange={(event) => { setPaypalMe(event.target.value); setSaved(false); }}
          />
        </Field>
        <Field label="Signup price in dollars" id="signup-price" hint="Default is 5. This is what creating an account costs.">
          <input
            id="signup-price"
            name="signupPrice"
            inputMode="numeric"
            value={signupPrice}
            onChange={(event) => { setSignupPrice(event.target.value); setSaved(false); }}
          />
        </Field>
        {error && <p className="form-error" role="alert">{error}</p>}
        {saved && <p className="notice" role="status">Settings saved on this browser.</p>}
        <button className="btn" type="submit">Save settings</button>
        <p className="fine">
          Whim stores this link and this price only. It never asks for a bank password, a bank account number,
          a routing number, a card number, or a PayPal password.
        </p>
      </form>
    </section>
  );
}

function Signups({ signups }) {
  const total = signupsTotal(signups);
  return (
    <section className="sheet" data-testid="signups">
      <h1>Signups</h1>
      <p className="lede">Paid account signups on this browser. This is how Whim is paid.</p>
      <p className="total" data-testid="signup-total">Total {formatMoney(total)}</p>
      {signups.length === 0 ? (
        <Empty title="No paid signups yet" body="When someone confirms they paid the signup price, their name, email, amount, and time show up here." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>First name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((signup) => (
                <tr key={signup.id}>
                  <td>{signup.firstName}</td>
                  <td>{signup.email}</td>
                  <td>{formatMoney(signup.amount)}</td>
                  <td>{formatStamp(signup.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Field({ label, id, hint, error, children }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

function Empty({ title, body }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
