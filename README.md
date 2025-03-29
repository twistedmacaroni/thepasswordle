# ThePasswordle

Hey there! This is my blockchain password manager project for Intro to Blockchain (CS 4501). I spent way too much time on the UI but I think it turned out pretty cool!

## What it does

This app lets you store your passwords securely on the blockchain. I know storing passwords on a public blockchain sounds crazy, but don't worry - it only stores the hashes, not the actual passwords! Here's what you can do with it:

- Store passwords (they get hashed before going on-chain)
- Add labels to remember what each password is for
- Check if a password is correct without revealing it
- Delete passwords you don't need anymore
- See all your stored passwords in one place

## How I built it

This was my first time building a dApp, so I had to learn a lot! I used:

- React for the frontend (my first React project!)
- Ethers.js to talk to the blockchain
- Solidity for the smart contract (that was in the previous assignment)
- CSS for styling (I'm pretty proud of how it looks)

The smart contract is deployed on the MegaETH testnet at this address:
```0x283aa65bC6340f39B7573e3f7635A4d30c26F637```

## Challenges I faced

- Getting MetaMask to connect properly was a nightmare
- React state management was confusing at first
- Making the UI look good on mobile took forever
- I kept getting weird errors when trying to call the smart contract

## What I learned

- How to build a basic React app
- How to connect a frontend to a smart contract
- That CSS animations are fun but time-consuming
- The importance of error handling (so many things can go wrong!)

## How to run it

1. Clone the repo
2. Run ```npm install``` to get all the dependencies
3. Make sure you have MetaMask installed with MegaETH testnet set up
4. Run ```npm start``` to start the development server
5. Connect your MetaMask wallet when prompted

## Future improvements

If I had more time, I would add:
- A way to export your password hashes as a backup
- Better password strength checking
- More customization options for the UI
- Support for multiple accounts

Thanks for checking out my project! This was a lot of work but I learned so much about blockchain development.
