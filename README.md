# `Athlon`

`Athlon`  is a decentralized sports arena booking platform powered by Internet Computer (ICP) blockchain. By leveraging smart contracts and Web3 infrastructure, Athlon ensures transparent, secure, and efficient reservations between arena owners and users. Say goodbye to double bookings, hidden fees, or manual check-ins — and welcome to the future of sports bookings.

<p align="center">
  <img src="https://i.imghippo.com/files/AP5018QQ.png" alt="" border="0">
</p>

## 👥 Team Members
Athlon is developed by a dedicated team of four members:

- **Anak Agung Gede Putu Wiradarma** – Leader, Full-stack Developer
- **Ida Bagus Dharma Abimantra** – Backend Developer
- **Anak Agung Gede Bagus Abi Wiguna** - Frontend Developer
- **I Made Sutha Raditya** – UI/UX Designer

## 🏟️ Features
- **Decentralized Arena Booking** – Reserve sports venues using tamper-proof blockchain logic.
- **ICP Wallet Integration** – All payments and balances handled using ICP tokens.
- **Booking History** – Track all transactions and receive instant updates.
- **Premium Accounts** – Access to exclusive arenas, discounts, and faster booking.
- **Full Decentralization** – Data stored and run directly on ICP canisters, not centralized servers.
- **AI Generative Description** - Using generative AI, the platform automatically generates engaging and informative descriptions for each arena based on its facilities, location, and user reviews.

## 🚀 Technology Stack
- **Frontend:** React, Tailwind CSS, GSAP, Draggable React
- **Backend:** Motoko (Deployed on ICP)
- **AI Integration:** Gemini AI API
- **Blockchain:** ICP (Internet Computer), Smart Contracts

## 🔧 Prerequisites
 🔧 Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (v16+ recommended) [Get It From](https://nodejs.org/)
- **Dfinity SDK (dfx)** – To deploy on ICP [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/getting-started/install)
- **Git** [Download](https://git-scm.com/downloads)

## 🛠 Installation
Clone the repository and install dependencies:
```sh
# Clone the repo
git clone https://github.com/GungWira/Athlon.git
cd Athlon

# Install dependencies
npm install
mops install
```

## 🌎 Environment Setup
To integrate **Gemini AI**, you need API keys:

**Obtain Gemini API Key**
- Sign up at [Google AI](https://ai.google.dev/) and generate an API key.
- Add the key to your `/src/ECOBUDDY_backend/constants/GlobalConstants.mo` file:
     ```sh
     API_KEY=your_api_key_here
     ```

## 💻 Local Development
To start the local development server:
1. Clean dfx processes on system:
   ```bash
   dfx killall
   ```
   
2. Deploy the ICP Ledger:
   ```bash
   npm run deploy-ledger
   ```

3. Deploy project canisters:
   ```bash
   dfx deploy
   ```

Your application should now be running at `http://[your CANISTER_ID_ATHLON_FRONTEND].localhost:4943`.
