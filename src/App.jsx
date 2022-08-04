import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
  useVote,
} from "@thirdweb-dev/react";
import { AddressZero } from "@ethersproject/constants"; 
import { useState, useEffect, useMemo } from "react";
import "./styles.css";

const App = () => {
  // Using the hooks from thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initialize editionDrop contract
  const editionDrop = useEditionDrop(
    "0x72f0948daFC590f31f9c3F729EaaFA0147EB799e"
  );
  // Initiliaze our token contract
  const token = useToken("0x7c2c645734e89b6f10D429528D04cFB8c3bD27C5");
  const vote = useVote("0x3EA883F93Abc6346faE2cB4a3ec94fCDe5Af14C4");
  // State variable for us to know if user has our NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming: loading state while the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);

  // The array holding all of our members addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // A fancy function to shorten a wallet address, no need to show the whole thing
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // Give our app access to our vote
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Retrieve all our existing proposals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // A simple call to vote.getAll() to grab the proposals
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals: ", proposals);
      } catch (error) {
        console.log("Failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // We also need to check if the user has already voted 
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // If we haven't finished retrieving the proposals from the useEffect above 
    // then we can't check if the user voted yet 
    if (!proposals.length) {
      return;
    } 

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted!");
        } else {
          console.log("🙂 User has not voted yet."); 
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);  
      }
    }; 
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]); 

  // This useEffect grabs all the addresses of our members holding our NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab the users who hold the NFT with tokenId 0
    const getAllAddresses = async () => {
      try {
        const memberAddresses =
          await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // This useEffect grabs the number of token each member holds
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("Failed to get member balance", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  // Can now combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // Check if we are finding the address in the memberTokenAmounts array
      // If yes, return the amount of token the user has
      // Otherwise, return 0
      const member = memberTokenAmounts?.find(
        ({ holder }) => holder === address
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // Exit if they don't have a connected wallet
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 This user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 This user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balace", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
      );
      // user has successfully claimed an NFT
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      // set to false to stop the loading state
      setIsClaiming(false);
    }
  };

  // Case if user has not connected their wallet
  // Let them call connectWallet
  if (!address) {
    return (
      <div className="landing">
        <h1 className="welcomeHeader">Welcome to MiddleEarthDAO 🧙‍♂️</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your Wallet
        </button>
      </div>
    );
  }

  // Dsiplay internal token-gated Member DAO dashboard
  // Only for members that already have claimed their NFT
  // Render all members + their token amounts  
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>💎 MiddleEarth DAO 💎 Member Page 💎</h1>
        <p>Congratulations on being a Member!</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Before doing async things, disable the button to prevent double clicks 
                setIsVoting(true); 

                // Get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposals.proposalId,
                    // abstain by default 
                    vote: 2,
                  };
                  proposal.vote.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote 
                try {
                  // We'll check if the wallet still needs to delegate their tokens before they can vote 
                  const delegation = await token.getDelegationOf(address); 
                  // If the delegation is the 0x0 address that means they have not delegated their governance tokens yet 
                  if (delegation === AddressZero) {
                    // If they haven't delegated their tokens yet, we'll have them delegate them before voting 
                    await token.delegateTo(address); 
                  }
                  
                  // Then we need to vote on the proposals 
                  try {
                    await Promise.all(posalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting 
                        // we first need to get the latest state of the proposal 
                        const proposal = await vote.get(proposalId); 
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // If it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote); 
                        }
                        // If the proposal is not open for voting, we just return nothing. Letting us continue 
                          return; 
                      })
                    );
                    try {
                      // If any of the proposals are ready to be executed, we'll need to execute them 
                      // A proposal is ready to be executed if it is in state 4 
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // We'll first get the latest state of the proposal again, since we may have just voted before  
                          const proposal = await vote.get(proposalId);
                          
                          // If the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal 
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      ); 
                      // If we get here that means we successfully voted, so let's set the "hasVoted" state to true 
                      setHasVoted(true);
                      // And log out a success message 
                      console.log("Successfully voted!");
                    } catch (error) {
                      console.error("Failed to execute votes", error);
                    } 
                  } catch (error) {
                    console.error("Failed to vote", error); 
                  }
                } catch (error) {
                  console.error("Failed to delegate tokens", error);
                } finally {
                  // In *either* case we need to set the isVoting state to false to enable the button again 
                  setIsVoting(false); 
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input 
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          // Default the "abstain" vote to checked 
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render mint NFT screen
  return (
    <div className="mint-nft">
      <h1>Mint your Free 💎DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Minting..." : "Mint your NFT (FREE)"}
      </button>
    </div>
  );
};

export default App;
