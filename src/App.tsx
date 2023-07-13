import { useEffect, useState } from "react";
import "./App.css";
import { PhantomProvider } from "./interfaces";

function App() {
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );

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

  const getProvider = (): PhantomProvider | undefined => {
    if ("solana" in window) {
      // @ts-ignore
      const provider = window.solana as any;
      if (provider.isPhantom) return provider as PhantomProvider;
    }
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
