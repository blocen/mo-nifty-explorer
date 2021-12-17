/** Connect to Moralis server */

Moralis.start({ serverUrl, appId });

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

document.getElementById("btn-search-name").onclick = searchNFTsByName;

// curl -X 'GET' \
//   'https://deep-index.moralis.io/api/v2/nft/search?chain=eth&format=decimal&q=abba&filter=name&limit=3' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: KhC2ENlo2K38xHZziBCjVjCVm0C7v7KejLPsV7L0P2YUiiw09fsVZDnCcSuPm9fy'

async function searchNFTsByName() {
  // todo: check min 3 characters
  // todo: param chain
  let search_param_name = document.getElementById("search-param-name").value;
  // console.log(search_param_name);
  const options = { q: search_param_name, chain: "bsc", filter: "name" };
  // console.log(options);
  let resultsByName = document.getElementById('resultsByName')
  let results;

  try {
    results = await Moralis.Web3API.token.searchNFTs(options);
  } catch (error) {
    console.log(error);
    resultsByName.innerHTML = `<p>No results...</p>`;
    return;
  }
  if (results.result.length == 0) {
    resultsByName.innerHTML = `<p>No results...</p>`;
    return;
  }

  resultsByName.innerText = "";
  let content = "";
  let nfts = results.result;
  // console.log("nfts: ", nfts);
  let res = nfts.map((nft) => {
    let obj = {}; 
    let parsed = JSON.parse(nft.metadata);
    obj["name"]  = parsed.name;
    obj["descr"] = parsed.description;
    obj["address"] = nft.token_address;
    obj["created_at"] = nft.created_at;
    return obj;
  });

  // console.log(res);

  for(let i = 0; i < res.length && i < 5; i++) {
    const div = document.createElement("div");
    div.innerHTML = 
    `<h6>${res[i].name}</h6>
      <p>${res[i].descr}<br>
      Created at: ${res[i].created_at.toLocaleString()}<br>
      ${res[i].address}
      </p>
     <hr/>`

    resultsByName.appendChild(div);
  }

}



// metadata:"{\"name\":\"Abbas\",\"image\":\"ipfs:\\/\\/QmPR1fGgE4XxC2Po9bZPdkwzsrza34Ayyj7FSZ4NcE81N4\\/94.jpg\",\"description\":\"Blocksport is an innovative and leading SportsTech based in Zurich, Switzerland.Our state-of-the-sport NFT platform provides features like NFT and fan token issuance, auction, bidding as well as NFT mining.NFT features:BlocksportNFT Ticket is a membership ticket for Blocksport;Blocksport early member certificate;Blocksport lottery to earn prize (Stars NFT);IDO White list;Additional prize\",\"attributes\":[{\"trait_type\":\"level\",\"value\":\"common\"}]}"
