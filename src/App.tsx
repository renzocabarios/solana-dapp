import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { PhantomProvider } from "./interfaces";
import { Buffer } from "buffer";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils } from "@project-serum/anchor";
const { SystemProgram, Keypair } = web3;
import idl from "./idl.json";
import * as anchor from "@project-serum/anchor";
window.Buffer = Buffer;
const temp = anchor.web3.Keypair.generate();

const programID = new PublicKey("B5siGtoGsZmrTdBkeja6tv4YG8mHpPQmsNXp2FhYWkJT");
function App() {
  const [provider, setProvider] = useState<any | undefined>(undefined);
  const [text, setText] = useState<string>("");
  const [textField, setTextField] = useState<string>("");

  const disconnectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (walletKey && solana) {
      await (solana as PhantomProvider).disconnect();
      setWalletKey(undefined);
    }
  };

  const [walletKey, setWalletKey] = useState<string | undefined>(undefined);

  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        console.log("wallet account ", response.publicKey.toString());
        setWalletKey(response.publicKey.toString());
      } catch (err) {}
    }
  };

  useEffect(() => {
    const provider = getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  const getProvider = (): any | undefined => {
    if ("solana" in window) {
      const provider = window.solana as any;
      if (provider.isPhantom) return provider;
    }
  };

  const initialize = async () => {
    const network = clusterApiUrl("devnet");
    // @ts-ignore
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(
      connection,
      // @ts-ignore
      window.solana,
      // @ts-ignore
      "processed"
    );
    // @ts-ignore
    const program = new Program(idl, programID, provider);
    const tempText = textField;
    try {
      await program.rpc.initialize(tempText, {
        accounts: {
          saver: temp.publicKey,
          // @ts-ignore
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [temp],
      });
      const account = await program.account.stringSaver.fetch(temp.publicKey);
      setText(account.text);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchText = async () => {
    const network = clusterApiUrl("devnet");
    // @ts-ignore
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(
      connection,
      // @ts-ignore
      window.solana,
      // @ts-ignore
      "processed"
    );
    // @ts-ignore
    const program = new Program(idl, programID, provider);

    try {
      const tx = await program.rpc.update("test", {
        accounts: {
          saver: temp.publicKey,
        },
      });

      const account = await program.account.stringSaver.fetch(temp.publicKey);
      setText(account.text);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextField(e.target.value);
  };
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h2>Tutorial: Connect to Phantom Wallet</h2>
          {provider && (
            <button
              style={{
                fontSize: "16px",
                padding: "15px",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
              onClick={connectWallet}
            >
              Connect to Phantom Wallet
            </button>
          )}
          {provider && walletKey && (
            <div>
              <p>Connected account {walletKey}</p>

              <button
                style={{
                  fontSize: "16px",
                  padding: "15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  margin: "15px auto",
                }}
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </div>
          )}
          {provider && walletKey && (
            <div>
              <input type="text" onChange={handleChange} value={textField} />
              <button
                style={{
                  fontSize: "16px",
                  padding: "15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  margin: "15px auto",
                }}
                onClick={initialize}
              >
                Initialize
              </button>
            </div>
          )}
          {provider && walletKey && (
            <div>
              <p>Current Text: {text}</p>

              <button
                style={{
                  fontSize: "16px",
                  padding: "15px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  margin: "15px auto",
                }}
                onClick={fetchText}
              >
                Fetch
              </button>
            </div>
          )}
          {!provider && (
            <p>
              No provider found. Install
              <a href="https://phantom.app/">Phantom Browser extension</a>
            </p>
          )}
        </header>
      </div>
    </>
  );
}

export default App;
