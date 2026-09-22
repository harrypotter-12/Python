# Shelfcut

Shelfcut is a pricing desk for a sample product sheet. Set an ask price, see landed cost, your cut, and margin, and keep the lines you care about in My Store.

Catalog costs are sample data. Your cut is an estimate from the ask price you type. Shelfcut is a tool for choosing and pricing products. It is not a promise of income and not a live supplier network. There is no login, no checkout, and no supplier connection.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints, usually [http://localhost:5173](http://localhost:5173).

```bash
npm test
npm run build
npm run preview
```

## How a line is priced

- **Landed cost** = product cost + shipping
- **Ask price** = the retail price you type
- **Your cut** = ask price − landed cost
- **Margin** = your cut ÷ ask price

The sheet is ordered by margin, highest first.

## What you can do

- **Desk** — imported count, average margin, and estimated cut if you sell one of each saved product.
- **Catalog** — 40 original sample products in home, beauty, fitness, pets, and kitchen. Search by title or country. Filter by category, maximum shipping days, and minimum margin.
- **My Store** — add or remove lines, edit the ask price, and see total estimated cut. The list is stored in `localStorage` and survives a refresh.

Row marks are drawn in the app. They are not photographs of branded goods.
