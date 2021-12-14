/** Connect to Moralis server */Moralis.start({ serverUrl, appId });

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

async function searchNFTsByName() {
  // todo: check min 3 characters
  let search_param_name = document.getElementById("search-param-name").value;
  // console.log(search_param_name);
  const options = { q: search_param_name, chain: "bsc", filter: "name" };
  // console.log(options);

  let resultsByName = document.getElementById('resultsByName')
  resultsByName.innerText = "";
  let content = "";
  let results;

  try {
    results = await Moralis.Web3API.token.searchNFTs(options);
    // console.log("results1: ", results);
  } catch (error) {
    console.log(error);
    resultsByName.innerHTML = `<p>No results...</p>`;
    return;
  }
  console.log(results.result);
  if (results.result.length == 0) {
    resultsByName.innerHTML = `<p>No results...</p>`;
    return;
  }

  // console.log(results.result.length);
  result = results.result;
  for (let i = 0; i < result.length && i < 15; i++) {
    // console.log(i);
    token_address = result[i].token_address;
    metadata_name = result[i].metadata;
    created_at    = result[i].created_at;
    console.log(token_address, metadata_name, created_at);
    const div = document.createElement("div");
    // div.innerHTML = token_address + metadata_name + created_at;
    div.innerHTML = 
    `<h6>${token_address}</h6>
     <p>${created_at.toLocaleString()}</p>
     <p>${metadata_name}</p>
     <hr/>`

    resultsByName.appendChild(div);
  }
  // renderResults();
}

// // display NFT list...
// async function renderResults() {
//   let commentSection = document.getElementById('resultsByName')
//   commentSection.innerText = "";
//   let result;

//   // <ul class="list-group">
//   //   <li class="list-group-item">An item</li>
//   // </ul>

//   try {
//       result = await Moralis.Cloud.run("getData", {});
//   } catch (error) {
//       commentSection.innerHTML = `
//                   <p>No comments, you may not have permission to view them</p>
//                   `
//       return;
//   }
//   if (result) {
//       for (let i = 0; i < result.length; i++) {
//           let _user = result[i].attributes.writer;
//           console.log(result[i])
//           const content = document.createElement("div")
//           content.innerHTML = `
//           <h6>${result[i].get('content')}</h6>
//           <p>(Posted by ${_user}: ${result[i].get('createdAt').toLocaleString()})</p>
//                           <hr/>
//                           `
//           commentSection.appendChild(content)
//       }
//   }
// }
