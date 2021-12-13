/** Connect to Moralis server */

Moralis.start({ serverUrl, appId });

/** Add from here down */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "hello NiFTy" })
      console.log("user: ", user)
      console.log("user address: ", user.get('ethAddress'))
   } catch(error) {
     console.log(error)
   }
  }
}

async function logout() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logout;
document.getElementById("btn-search").onclick = searchNFTs;

async function searchNFTs() {
  const options = { q: "asdf", chain: "bsc", filter: "name" };
  console.log(options);
  const NFTs = await Moralis.Web3API.token.searchNFTs(options);
  console.log(NFTs);
}

searchNFTs();
