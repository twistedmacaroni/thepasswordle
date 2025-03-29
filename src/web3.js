import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x3ca03A7B7d21E8260F1549CCCfbFeE80B127C1a7";
const CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "password", "type": "string" },
            { "internalType": "string", "name": "passphrase", "type": "string" }
        ],
        "name": "storePassword",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const getContract = async () => {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return null;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
