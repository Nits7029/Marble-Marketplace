/* legacy and is a subject for refactor */
export const colorTokens = {
  black: '#161616',
  gray: '#858585',
  lightGray: '#FAF9F9',
  lightBlue: '#2F80ED',
  white: '#ffffff',
  primary: '#0066DB',
  secondaryText: 'rgba(25, 29, 32, 0.75)',
  bodyText: 'rgba(25, 29, 32, 0.95)',
  tertiaryText: 'rgba(25, 29, 32, 0.6)',
  tertiaryIcon: 'rgba(25, 29, 32, 0.5)',
  disabled: '#858585',
}

/* legacy and is a subject for refactor */
export const spaces = {
  0: '0',
  2: '2px',
  10: '10px',
  12: '12px',
  14: '14px',
  18: '18px',
  24: '24px',
}
export const default_image = '/default.png'
export const default_featured_image = '/default-featured.png'
export const contractName = 'hera.cmdev0.testnet'

export const DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL = 10000
export const SLIPPAGE_OPTIONS = [0.01, 0.02, 0.03, 0.05]
export const NETWORK_FEE = 0.003

export const APP_NAME = process.env.NEXT_PUBLIC_SITE_TITLE
export const INCENTIVE_AMOUNT = 40000000
export const DEPLOY_TIMESTAMP = 1650959066

/* the app operates in test mode */
export const __TEST_MODE__ = !JSON.parse(
  process.env.NEXT_PUBLIC_TEST_MODE_DISABLED
)

/* feature flags */
export const __POOL_REWARDS_ENABLED__ = true // is under development and cannot be enabled
export const __TRANSFERS_ENABLED__ = JSON.parse(
  process.env.NEXT_PUBLIC_ENABLE_FEATURE_TRANSFERS
)

export const PINATA_PRIMARY_IMAGE_SIZE =
  process.env.NEXT_PUBLIC_PINATA_PRIMARY_IMAGE_SIZE
export const PINATA_SECONDARY_IMAGE_SIZE =
  process.env.NEXT_PUBLIC_PINATA_SECONDARY_IMAGE_SIZE
/* /feature flags */
export const backend_url = 'https://marble-backend.herokuapp.com'
// export const backend_url = 'http://localhost:3030'
export const marketplace_subgraph_url =
  'https://api.thegraph.com/subgraphs/name/rafleberry/marble-marketplace'
export const nft_subgraph_url =
  'https://api.thegraph.com/subgraphs/name/rafleberry/marble-nft'
export const nfts_per_page = 12
