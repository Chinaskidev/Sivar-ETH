import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  polygon,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Volcanoes',
  projectId: 'bd6f9cb329ee9d45a2494ef05a017254',
  chains: [
    mainnet,
    polygon,
    arbitrum,
    base,
    sepolia,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [base] : []),
  ],
});