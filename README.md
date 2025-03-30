# **ThePasswordle**
Hi! This is my intro to blockchain  blockchain password manager project. I spent far too long on the UI but I hope it looks pretty neat!

## "*What it does**

This app allows you to keep your passwords safe on the blockchain. I know it sounds insane to keep passwords on a public blockchain, but it stores the hashes, not the actual passwords. Here's what you can do with it:

1. Keep passwords (they're hashed before they go on-chain)
2. Put labels on to remember what password is for something
3. Verify a password is correct without showing it
4. Remove passwords you no longer need
5. See all your saved passwords at once
   
## **How I created it**

It was my first time creating a dApp, so I learned lots! I used:

1. React for the frontend (my first ever React project!)
2. Ethers.js to communicate with the blockchain
3. Solidity for the smart contract (that one was in the last assignment)
4. CSS for making it look pretty (I'm rather happy with how it looks)
5. The smart contract is deployed on the MegaETH testnet at this address: 0x283aa65bC6340f39B7573e3f7635A4d30c26F637

## **Challenges I encountered**

1. Getting MetaMask to connect correctly was a nightmare
2. React state management was initially confusing
3. Making the UI look decent on mobile took an eternity
4. I kept getting strange errors when attempting to call the smart contract
   
## **What I learned**

1. How to create a simple React app
2. How to connect a frontend to a smart contract
3. That CSS animations are fun but time-consuming
4. The need for error handling (so many things could go wrong!)

## **How to use it**

1. Clone the repo
2. Run `npm install` to get everything you need
3. Ensure that you have MetaMask installed with MegaETH testnet configured
4. Run `npm start` to begin the development server
5. Attach your MetaMask wallet when asked
6. The server-based functions and actions require you to confirm them from your MetaMask wallet, so don't feel confused if the 'Processing...' doesn't go away, it's probably there because your confirmation awaits.

## **Future development**

If I had more time, I would implement:
1. An option to export your password hashes as a backup
2. Improved password strength verification
3. More customization options for the UI
4. Support for multiple accounts

Thanks for checking out my project! This was a lot of work but I learned so much about blockchain development.
