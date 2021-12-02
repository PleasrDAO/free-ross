import { ethers } from 'ethers';

export const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_PROJECT_ID);
