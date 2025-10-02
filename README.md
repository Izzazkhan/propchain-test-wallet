# PropChain Test - Wallet Connection

Quick start

1. Install dependencies:

```
npm install
```

2. Run the dev server:

```
npm run dev
```

3. Open the app at the printed local URL. Click "Connect Wallet" to open the modal, choose MetaMask, and approve the connection. If MetaMask is missing, a helpful link is shown.

Notes

- Uses `window.ethereum` directly, no heavy libraries.
- Connected address is stored in context and reflected on the header button.

