import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import React from "react";

// Contract address from my deployment on MegaETH testnet
const contractAddress = "0x283aa65bC6340f39B7573e3f7635A4d30c26F637";

// ABI copied from Remix after compilation - don't touch this!
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "PasswordsCleared",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "PasswordDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "label",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PasswordStored",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "clearAllPasswords",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "deletePassword",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPasswordCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPasswords",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "label",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct EnhancedPasswordManager.PasswordData[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "passwordHash",
        "type": "bytes32"
      }
    ],
    "name": "passwordHashExists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "password",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "passphrase",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "label",
        "type": "string"
      }
    ],
    "name": "storePassword",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "newLabel",
        "type": "string"
      }
    ],
    "name": "updateLabel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "password",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "passphrase",
        "type": "string"
      }
    ],
    "name": "verifyPassword",
    "outputs": [
      {
        "internalType": "int256",
        "name": "index",
        "type": "int256"
      },
      {
        "internalType": "bool",
        "name": "found",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// SVG icons - spent way too much time on these lol
const Icons = {
  Store: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 11H5V21H19V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 9V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z" fill="currentColor"/>
    </svg>
  ),
  Fetch: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 7L13 15L9 11L3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 13V7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Verify: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Delete: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Success: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Error: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Clear: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Tag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 7H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

function App() {
  // State variables - probably should organize these better
  const [contract, setContract] = useState(null);
  const [password, setPassword] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [passwordLabel, setPasswordLabel] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyPassphrase, setVerifyPassphrase] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [modalActive, setModalActive] = useState(false);
  const [storedPasswords, setStoredPasswords] = useState([]);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newLabel, setNewLabel] = useState("");
  // const [exportEnabled, setExportEnabled] = useState(false); // TODO: implement this later

// Removed network checking - was causing too many issues
// Just let users manually switch to MegaETH
useEffect(() => {
  const loadProvider = async () => {
    if (window.ethereum) {
      try {
        // console.log("Connecting to MetaMask...");
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Provider.listAccounts();
        setAccount(accounts[0]);

        const web3Signer = web3Provider.getSigner();
        const passwordManager = new ethers.Contract(contractAddress, contractABI, web3Signer);
        setContract(passwordManager);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
          window.location.reload();
        });

        // This was supposed to check for network changes but it's buggy
        // window.ethereum.on('chainChanged', () => {
        //   window.location.reload();
        // });
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
        setMessage("Failed to connect to Metamask. Please make sure it's installed and unlocked.");
        setMessageType("error");
      }
    } else {
      console.error("Metamask not detected ❌");
      setMessage("Metamask not detected. Please install Metamask to use this application.");
      setMessageType("error");
    }
  };

  loadProvider();

  // Cleanup function - not sure if this actually works
  return () => {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      // window.ethereum.removeAllListeners('chainChanged');
    }
  };
}, []);


  const openModal = (type) => {
    // If opening the fetch modal, get the passwords first
    if (type === "fetch") {
      fetchPasswords();
    }

    setActiveModal(type);
    // Delay the animation slightly for better effect
    setTimeout(() => {
      setModalActive(true);
    }, 50);
  };

  const closeModal = () => {
    setModalActive(false);
    // Wait for animation to complete before removing the modal
    setTimeout(() => {
      setActiveModal(null);
      // Reset form fields
      setEditIndex(null);
      setNewLabel("");
    }, 300);
  };

  // Format timestamp to readable date
  // Borrowed from StackOverflow: https://stackoverflow.com/questions/12710001/
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();

    // This is a more customized format I might use later
    // const year = date.getFullYear();
    // const month = ('0' + (date.getMonth() + 1)).slice(-2);
    // const day = ('0' + date.getDate()).slice(-2);
    // const hours = ('0' + date.getHours()).slice(-2);
    // const minutes = ('0' + date.getMinutes()).slice(-2);
    // return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Store a password with label
  const storePassword = async () => {
    if (!contract) {
      setMessage("Please connect to Metamask first.");
      setMessageType("error");
      return;
    }

    if (!password || !passphrase) {
      setMessage("Please enter both password and passphrase.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      // console.log("Storing password...");
      // console.log("Label:", passwordLabel);
      // Don't log actual passwords even in comments!

      // Call the storePassword function from your contract with label
      const tx = await contract.storePassword(password, passphrase, passwordLabel || "");
      setMessage("Transaction submitted. Waiting for confirmation...");
      setMessageType("success");

      // Wait for the transaction to be mined
      await tx.wait();
      setMessage("Password stored successfully!");
      setMessageType("success");
      setPassword("");
      setPassphrase("");
      setPasswordLabel("");
      closeModal();
    } catch (err) {
      console.error(err);
      // Check if it's a user rejected transaction
      if (err.code === 4001) {
        setMessage("Transaction rejected by user");
      } else {
        setMessage(`Error storing password: ${err.message || "Unknown error"}`);
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stored passwords
  const fetchPasswords = async () => {
    if (!contract) {
      setMessage("Please connect to Metamask first.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      // Call the getPasswords function from your contract
      const passwords = await contract.getPasswords();
      // console.log("Fetched passwords:", passwords);
      setStoredPasswords(passwords);

      if (passwords.length === 0) {
        setMessage("No passwords found. Store some passwords first.");
        setMessageType("info");
      } else {
        setMessage(`Found ${passwords.length} password entries.`);
        setMessageType("success");
      }
    } catch (err) {
      console.error(err);
      // Check if it's a network error
      if (err.message && err.message.includes("network")) {
        setMessage("Network error. Are you connected to MegaETH?");
      } else {
        setMessage(`Error fetching passwords: ${err.message || "Unknown error"}`);
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Verify a password - this took me forever to debug - don't touch!
  const verifyStoredPassword = async () => {
    if (!contract) {
      setMessage("Please connect to Metamask first.");
      setMessageType("error");
      return;
    }

    if (!verifyPassword || !verifyPassphrase) {
      setMessage("Please enter both password and passphrase to verify.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      // Call the verifyPassword function from your contract
      const [index, found] = await contract.verifyPassword(verifyPassword, verifyPassphrase);

      if (found) {
        setMessage(`Password verified successfully! Found at index: ${index}`);
        setMessageType("success");
      } else {
        setMessage("Incorrect password or passphrase.");
        setMessageType("error");
      }
      closeModal();
    } catch (err) {
      console.error(err);
      setMessage(`Error verifying password: ${err.message || "Unknown error"}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Delete a password
  function deletePassword(index){
    if (!contract) {
      setMessage("Please connect to Metamask first.");
      setMessageType("error");
      return;
    }

    if (index === "" || isNaN(parseInt(index))) {
      setMessage("Please enter a valid index.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      // Call the deletePassword function from your contract
      contract.deletePassword(index)
        .then(tx => {
          setMessage("Transaction submitted. Waiting for confirmation...");
          setMessageType("success");
          return tx.wait();
        })
        .then(() => {
          setMessage("Password deleted successfully!");
          setMessageType("success");
          // Refresh the password list
          fetchPasswords();
          closeModal();
        })
        .catch(err => {
          console.error(err);
          setMessage(`Error deleting password: ${err.message || "Unknown error"}`);
          setMessageType("error");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
      setMessage(`Error deleting password: ${err.message || "Unknown error"}`);
      setMessageType("error");
      setLoading(false);
    }
  };

  // Clear all passwords - BE CAREFUL WITH THIS ONE!
  const clearAllPasswords = async () => {
    if (!contract) {
      setMessage("Please connect to Metamask first.");
      setMessageType("error");
      return;
    }

    if (!window.confirm("Are you sure you want to delete ALL your stored passwords? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      // Call the clearAllPasswords function from your contract
      const tx = await contract.clearAllPasswords();
      setMessage("Transaction submitted. Waiting for confirmation...");
      setMessageType("success");

      // Wait for the transaction to be mined
      await tx.wait();
      setMessage("All passwords cleared successfully!");
      setMessageType("success");

      // Refresh the password list
      setStoredPasswords([]);
      closeModal();
    } catch (err) {
      console.error(err);
      setMessage(`Error clearing passwords: ${err.message || "Unknown error"}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Update password label
  const updatePasswordLabel = async () => {
    if (!contract) {
      setMessage("Please connect to Metamask first.");
      setMessageType("error");
      return;
    }

    if (editIndex === null) {
      setMessage("No password selected for update.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      // Call the updateLabel function from your contract
      const tx = await contract.updateLabel(editIndex, newLabel);
      setMessage("Transaction submitted. Waiting for confirmation...");
      setMessageType("success");

      // Wait for the transaction to be mined
      await tx.wait();
      setMessage("Label updated successfully!");
      setMessageType("success");

      // Refresh the password list
      fetchPasswords();
      setEditIndex(null);
      setNewLabel("");
    } catch (err) {
      console.error(err);
      setMessage(`Error updating label: ${err.message || "Unknown error"}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Copy hash to clipboard
  const copyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash)
      .then(() => {
        setMessage("Hash copied to clipboard!");
        setMessageType("success");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setMessage("Failed to copy hash.");
        setMessageType("error");
      });
  };

  // Feature in progress - will implement export functionality later
  // function exportPasswords() {
  //   if (!storedPasswords || storedPasswords.length === 0) {
  //     setMessage("No passwords to export");
  //     setMessageType("error");
  //     return;
  //   }
  //   
  //   // TODO: Implement proper export with encryption
  //   const exportData = storedPasswords.map((pwd, idx) => ({
  //     index: idx,
  //     label: pwd.label || "Unlabeled",
  //     hash: pwd.hash,
  //     date: formatDate(pwd.timestamp)
  //   }));
  //   
  //   const dataStr = JSON.stringify(exportData, null, 2);
  //   const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  //   
  //   const exportFileDefaultName = 'password_hashes_backup.json';
  //   
  //   let linkElement = document.createElement('a');
  //   linkElement.setAttribute('href', dataUri);
  //   linkElement.setAttribute('download', exportFileDefaultName);
  //   linkElement.click();
  // }

  const renderModalContent = () => {
    switch (activeModal) {
      case "store":
        return (
          <>
            <div className="modal-header">
              <div className="modal-icon"><Icons.Store /></div>
              <h2 className="modal-title">Store Password</h2>
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Passphrase</label>
              <input 
                type="password" 
                placeholder="Enter your passphrase" 
                value={passphrase} 
                onChange={(e) => setPassphrase(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Label (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g., Gmail, GitHub, Netflix" 
                value={passwordLabel} 
                onChange={(e) => setPasswordLabel(e.target.value)} 
              />
            </div>
            <button className="action-btn" onClick={storePassword} disabled={loading}>
              {loading ? "Processing..." : "Save Password"}
            </button>
          </>
        );
      case "fetch":
        return (
          <>
            <div className="modal-header">
              <div className="modal-icon"><Icons.Fetch /></div>
              <h2 className="modal-title">Stored Passwords</h2>
            </div>
            {loading ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                Loading passwords...
              </p>
            ) : storedPasswords.length > 0 ? (
              <div className="password-list">
                {storedPasswords.map((pwd, index) => (
                  <div key={index} className="password-item">
                    <div className="password-index">{index}</div>
                    <div className="password-details">
                      <div className="password-label">
                        <span className="label-icon"><Icons.Tag /></span>
                        {pwd.label || "Unlabeled Password"}
                      </div>
                      <div className="password-hash">
                        {`${pwd.hash.substring(0, 10)}...${pwd.hash.substring(58)}`}
                      </div>
                      <div className="password-date">
                        <span className="date-icon"><Icons.Calendar /></span>
                        {formatDate(pwd.timestamp)}
                      </div>
                    </div>
                    <div className="password-actions">
                      <button 
                        className="action-icon-btn" 
                        onClick={() => {
                          setEditIndex(index);
                          setNewLabel(pwd.label);
                          openModal("edit");
                        }}
                        title="Edit label"
                      >
                        <Icons.Edit />
                      </button>
                      <button 
                        className="action-icon-btn" 
                        onClick={() => copyToClipboard(pwd.hash)}
                        title="Copy hash"
                      >
                        <Icons.Copy />
                      </button>
                      <button 
                        className="action-icon-btn delete" 
                        onClick={() => {
                          if(window.confirm(`Delete password ${pwd.label ? `"${pwd.label}"` : `at index ${index}`}?`)) {
                            deletePassword(index);
                          }
                        }}
                        title="Delete"
                      >
                        <Icons.Delete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                No passwords stored yet. Use the "Store Password" function to add passwords.
              </p>
            )}
            <div className="modal-actions">
              <button className="secondary-btn" onClick={closeModal}>Close</button>
              {storedPasswords.length > 0 && (
                <button className="danger-btn" onClick={clearAllPasswords} disabled={loading}>
                  {loading ? "Processing..." : "Clear All Passwords"}
                </button>
              )}
              {/* TODO: Add export button when feature is ready */}
              {/* {storedPasswords.length > 0 && (
                <button className="secondary-btn" onClick={exportPasswords}>
                  Export Passwords
                </button>
              )} */}
            </div>
          </>
        );
      case "verify":
        return (
          <>
            <div className="modal-header">
              <div className="modal-icon"><Icons.Verify /></div>
              <h2 className="modal-title">Verify Password</h2>
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                placeholder="Enter password to verify" 
                value={verifyPassword} 
                onChange={(e) => setVerifyPassword(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Passphrase</label>
              <input 
                type="password" 
                placeholder="Enter passphrase" 
                value={verifyPassphrase} 
                onChange={(e) => setVerifyPassphrase(e.target.value)} 
              />
            </div>
            <button className="action-btn" onClick={verifyStoredPassword} disabled={loading}>
              {loading ? "Verifying..." : "Verify Password"}
            </button>
          </>
        );
      case "delete":
        return (
          <>
            <div className="modal-header">
              <div className="modal-icon"><Icons.Delete /></div>
              <h2 className="modal-title">Delete Password</h2>
            </div>
            <div className="input-group">
              <label className="input-label">Password Index</label>
              <input 
                type="number" 
                placeholder="Enter the index to delete" 
                id="deleteIndex"
              />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
              Tip: Use the "Fetch Passwords" function to see available indices.
            </p>
            <button 
              className="action-btn" 
              onClick={() => {
                const index = document.getElementById("deleteIndex").value;
                deletePassword(index);
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Delete Password"}
            </button>
          </>
        );
      case "edit":
        return (
          <>
            <div className="modal-header">
              <div className="modal-icon"><Icons.Edit /></div>
              <h2 className="modal-title">Edit Password Label</h2>
            </div>
            <div className="input-group">
              <label className="input-label">New Label</label>
              <input 
                type="text" 
                placeholder="Enter new label" 
                value={newLabel} 
                onChange={(e) => setNewLabel(e.target.value)} 
              />
            </div>
            <button className="action-btn" onClick={updatePasswordLabel} disabled={loading}>
              {loading ? "Updating..." : "Update Label"}
            </button>
          </>
        );
      case "clear":
        return (
          <>
            <div className="modal-header">
              <div className="modal-icon"><Icons.Clear /></div>
              <h2 className="modal-title">Clear All Passwords</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Are you sure you want to delete ALL your stored passwords? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={closeModal}>Cancel</button>
              <button className="danger-btn" onClick={clearAllPasswords} disabled={loading}>
                {loading ? "Processing..." : "Clear All Passwords"}
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1>ThePasswordle</h1>
      <p className="subtitle">Secure blockchain-based password management</p>

      {contract ? (
        <div className="connection-status connected">
          Connected to Ethereum
          <span className="account-info">
            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : ''}
          </span>
        </div>
      ) : (
        <div className="connection-status">Connecting to Ethereum...</div>
      )}

      <div className="button-container">
        {[
          { type: "store", label: "Store Password", icon: <Icons.Store /> },
          { type: "fetch", label: "Manage Passwords", icon: <Icons.Fetch /> },
          { type: "verify", label: "Verify Password", icon: <Icons.Verify /> },
          { type: "delete", label: "Delete Password", icon: <Icons.Delete /> }
        ].map(({ type, label, icon }) => (
          <button 
            key={type} 
            className="action-button"
            onClick={() => openModal(type)}
          >
            <div className="button-icon">{icon}</div>
            <div className="button-label">{label}</div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeModal && (
        <div className={`modal-overlay ${modalActive ? 'active' : ''}`} onClick={closeModal}>
          <div 
            className={`modal ${modalActive ? 'active' : ''}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <button className="close-btn" onClick={closeModal}>
              <Icons.Close />
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}

      {message && (
        <div className={`message ${messageType}`}>
          <div className="message-icon">
            {messageType === "success" ? <Icons.Success /> : <Icons.Error />}
          </div>
          <div>{message}</div>
        </div>
      )}

      <div className="footer">
        © 2025 ThePasswordle • Secure Blockchain Storage
      </div>
    </div>
  );
}

export default App;
