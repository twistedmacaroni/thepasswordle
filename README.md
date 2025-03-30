# ThePasswordle
Hi! This is my intro to blockchain  blockchain password manager project. I spent far too long on the UI but I hope it looks pretty neat!

# What it does
This app allows you to keep your passwords safe on the blockchain. I know it sounds insane to keep passwords on a public blockchain, but relax - it stores the hashes, not the actual passwords! Here's what you can do with it:

Keep passwords (they're hashed before they go on-chain)
Put labels on to remember what password is for something
Verify a password is correct without showing it
Remove passwords you no longer need
See all your saved passwords at once
How I created it
It was my first time creating a dApp, so I learned lots! I used:

React for the frontend (my first ever React project!)
Ethers.js to communicate with the blockchain
Solidity for the smart contract (that one was in the last assignment)
CSS for making it look pretty (I'm rather happy with how it looks)
The smart contract is deployed on the MegaETH testnet at this address: 0x283aa65bC6340f39B7573e3f7635A4d30c26F637

# Challenges I encountered
Getting MetaMask to connect correctly was a nightmare
React state management was initially confusing
Making the UI look decent on mobile took an eternity
I kept getting strange errors when attempting to call the smart contract
What I learned
How to create a simple React app
How to connect a frontend to a smart contract
That CSS animations are fun but time-consuming
The need for error handling (so many things could go wrong!)

# How to use it
Clone the repo
Run npm install to get everything you need
Ensure that you have MetaMask installed with MegaETH testnet configured
Run npm start to begin the development server
Attach your MetaMask wallet when asked

# Future development
If I had more time, I would implement:
An option to export your password hashes as a backup
Improved password strength verification
More customization options for the UI
Support for multiple accounts

# Thanks for checking out my project! This was a lot of work but I learned so much about blockchain development.
