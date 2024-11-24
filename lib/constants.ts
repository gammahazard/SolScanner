export const COMMON_TOKENS = {
  'WIF': 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  'GOAT': 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
  'FWOG': 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump',
  'PNUT': '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump',
  'POPCAT': '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
  'MOODENG': 'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY',
  'FARTCOIN': '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump'
} as const;

export type TokenSymbol = keyof typeof COMMON_TOKENS;

export const EXCHANGE_WALLETS = {
  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1': 'RAYDIUM AUTHORITY V4',

  // Gate.io
  'u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w': 'Gate.io',

  // Wintermute
  '5sTQ5ih7xtctBhMXHr3f1aWdaXazWrWfoehqWdqWnTFP': 'Wintermute 3',

  // Bitget
  'A77HErqtfN1hLLpvZ9pCtu66FEtM8BveoaKbbMoZ4RiR': 'Bitget',

  // KuCoin
  'HVh6wHNBAsG3pq1Bj5oCzRjoWKVogEDHwUHkRz3ekFgt': 'KuCoin',
  'BmFdpraQhkiDQE6SnfG5omcA1VwzqfXrwtNYBwWTymy6': 'KuCoin',
  '57vSaRTqN9iXaemgh4AoDsZ63mcaoshfMK8NP3Z5QNbs': 'KuCoin',

  // Bybit
  'CG4tRANBKrzUmpv93V5sgftjQznBdiJsc2yPCzZWWuS9': 'Bybit Staking Vote Account',
  'AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2': 'Bybit',

  // Kraken
  'FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5': 'Kraken Exchange',
  'krakeNd6ednDPEXxHAmoBs1qKVM8kLg79PvWF2mhXV1': 'Kraken Exchange',

  // Crypto.com
  '6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy': 'Crypto.com 1',
  'AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS': 'Crypto.com 2',

  // OKX
  '9un5wqE3q4oCjyrDkwsdD48KteCJitQX5978Vh7KKxHo': 'OKX',
  '5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD': 'OKX',

  // Binance
  '2ojv9BAiHUrvsm9gxDe7fJSzbNZSJcxZvf8dqmWGHG8S': 'Binance',
  '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9': 'Binance',
  '3yFwqXBfZY4jBVUafQ1YEXw189y2dN3V5KQq9uzBDy1E': 'Binance',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM': 'Binance',

  // Jupiter (JUP)
  'CbU4oSFCk8SVgW23NLvb5BwctvWcZZHfxRD6HudP8gAo': 'JUP Team Hot Wallet',
  'FVhQ3QHvXudWSdGix2sdcG47YmrmUxRhf3KCBmiKfekf': 'JUP Community Wallet',
  'BQ72nSv9f3PRyRKCBnHLVrerrv37CYTHm5h3s9VSGQDV': 'Jupiter Aggregator Authority 1',
  '2MFoS3MPtvyQ4Wh4M9pdfPjz6UhVoNbFbGJAskCPCj3h': 'JUP Aggregator Authority 2',
  'HU23r7UoZbqTUuh3vA7emAGztFtqwTeVips789vqxxBw': 'JUP Aggregator Authority 3',
  '3CgvbiM3op4vjrrjH2zcrQUwsqh5veNVRjFCB9N6sRoD': 'JUP Aggregator Authority 4',
  '6LXutJvKUw8Q5ue2gCgKHQdAN4suWW8awzFVC6XCguFx': 'JUP Aggregator Authority 5',
  'CapuXNQoDviLvU1PxFiizLgPNQCxrsag1uMeyk6zLVps': 'JUP Aggregator Authority 6',

  // Wormhole
  'GugU1tP7doLeTw9hQP51xRJyS8Da1fWxuiy2rVrnMD2m': 'Wormhole Custody Authority',

  // Solend
  'DdZR6zRFiUt4S5mg7AV1uKB2z1f1WzcNYCaTEEWPAuby': 'Solend Main Pool Lending Authority',

  // Drift
  'JCNCMFXo5M5qwUPg2Utu1u6YWp3MbygxqBsBeXXJfrw': 'Drift Vault',

  // Bonk
  'AGkGWK1R669KDT4FCqgDgK7PgahGJPjD4J9xmVjuL9kn': 'BonkDao',
  '9AdEE8AAm1XgJrPEs4zkTPozr3o4U5iGbgvPwkNdLDJ3': 'Bonk Stake Pool',
  '6JZoszTBzkGsskbheswiS6z2LRGckyFY4SpEGiLZqA9p': 'Bonk Treasury',

  // Coinbase
  'H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS': 'Coinbase',
  '2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm': 'Coinbase',
  'XkCriyrNwS3G4rzAXtG5B1nnvb5Ka1JtCku93VqeKAr': 'Coinbase',
  'CW9C7HBwAMgqNdXkNgFg9Ujr3edR2Ab9ymEuQnVacd1A': 'Coinbase',
  'GJRs4FwHtemZ5ZE9x3FNvJ8TMwitKTh21yxdRPqn7npE': 'Coinbase',
  '3vxheE5C46XzK4XftziRhwAf8QAfipD7HXXWj25mgkom': 'Coinbase Prime',

  // Kamino
  '81BgcfZuZf9bESLvw3zDkh7cZmMtDwTPgkCvYu7zx26o': 'Kamino Reserve 3',

  // MEXC
  'ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ': 'MEXC',
  '5PAhQiYdLBd6SVdjzBQDxUAEFyDdF5ExNPQfcscnPRj5': 'MEXC',
} as const;
export type ExchangeWalletAddress = keyof typeof EXCHANGE_WALLETS;
