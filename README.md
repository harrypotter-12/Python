# Whim

Whim is a same-day claim board for 20-minute unfinished favors. A person posts one small favor, a fixed price, a neighborhood, and a 20-minute window for today. Someone else claims it, and the claim locks that favor to them. There is no bidding.

Whim is paid when someone creates an account, not when a favor is finished. The signup price defaults to $5 and can be changed in settings, along with the owner's PayPal.me link (for example `https://paypal.me/theirname`). The signup screen shows that price before an account exists. **Pay with PayPal** opens PayPal's own website for the signup amount. The payer finishes on PayPal. After they come back, they confirm they paid, and only then is the account created. Paid signups are listed under Signups with a total.

Whim stores the PayPal.me link and the signup price in this browser. It never asks for a bank password, a bank account number, a routing number, a card number, or a PayPal password.

On a favor, **mark paid** only records that the poster handed over the agreed amount. It does not charge a card, and it does not pay Whim.

Accounts, favors, settings, and signup records stay in `localStorage` on this device. Passwords are hashed in the browser before they are stored. This is a local demo, not a hosted account system.

## Run

```bash
npm install
npm run dev
```

Open the address Vite prints, usually [http://localhost:5173](http://localhost:5173).

The board starts with sample favors so it is not empty. Sample slips are labeled **Sample**. Add a PayPal.me link in settings before anyone can create an account.
