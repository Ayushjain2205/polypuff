# AI Wallet Manager

A natural language interface to do anything with your wallet!

- send transactions
- swap tokens
- deposit to any defi protocol
- query blockchain data
- deploy tokens and nfts

Video build: https://x.com/joenrv/status/1963665386983059916

## Running the project

### Environment Variables

To use the Thirdweb AI chat functionality, you need to set up your Thirdweb API credentials.

Create a `.env.local` file in the root directory with one of the following:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
THIRDWEB_SECRET_KEY=your_secret_key_here
```

To use the SideShift API integration, add your SideShift credentials:

```bash
SIDESHIFT_SECRET=your_private_api_key
SIDESHIFT_AFFILIATE_ID=your_affiliate_id # optional but recommended
```

`SIDESHIFT_AFFILIATE_ID` defaults to the value of `SIDESHIFT_AFFILIATE`, if present. The server-side API routes never expose the secret to the client.

### Available API Routes

- `GET /api/sideshift/coins` — list supported coins and networks.
- `GET /api/sideshift/pairs?depositCoin=eth&settleCoin=usdc` — inspect available trading pairs.
- `POST /api/sideshift/quotes` — request a fixed quote (requires `SIDESHIFT_SECRET`).
- `POST /api/sideshift/shifts/fixed` — create a fixed shift from a quote.
- `GET /api/sideshift/shifts/{shiftId}` — fetch the latest status for a shift.

All SideShift routes automatically attach the affiliate ID (when provided) and include robust error handling for upstream failures.

### Getting Your Credentials

1. Go to [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create an account or sign in
3. Create a new project or select an existing one
4. Copy your Client ID and Secret Key

### Running the Application

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up your environment variables (see above)

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser
