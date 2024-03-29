const connectButton = document.getElementById("connect-button");
const dropdownContent = document.getElementById("dropdown-content");

if(localStorage.getItem("connected") === "true"){
    address = localStorage.getItem("address")

    const dropdown = document.getElementById("dropdown");
    const shortenedAddress = address.substring(0, 4) + "..." + address.substr(-5);
    document.getElementById("connect-button").innerHTML = shortenedAddress;

  
    connectButton.addEventListener("mouseover", () => {
        // Add the div code here
        const dropdown = document.createElement("div");
        dropdown.classList.add("dropdown-content", "dropdown-menu");
        dropdown.id = "dropdown";
        const transactionsButton = document.createElement("a");
        transactionsButton.href = "#";
        transactionsButton.id = "transactions-button";
        transactionsButton.innerHTML = "Transactions";
        const nftsButton = document.createElement("a");
        nftsButton.href = "#";
        nftsButton.id = "nfts-button";
        nftsButton.innerHTML = "NFTs";
        const disconnectButton = document.createElement("a");
        disconnectButton.href = "#";
        disconnectButton.id = "disconnect-button";
        disconnectButton.innerHTML = "Disconnect";
        dropdown.appendChild(transactionsButton);
        dropdown.appendChild(nftsButton);
        dropdown.appendChild(disconnectButton);
        
        // Insert the dropdown after the button
        connectButton.insertAdjacentElement("afterend", dropdown);

        connectButton.addEventListener("mouseout", (e) => {
            if (localStorage.getItem("connected") === "true") {
                const dropdown = document.getElementById("dropdown");
                if(dropdown) {
                    const rect = dropdown.getBoundingClientRect();
                    const isHovered = rect.left <= e.clientX && e.clientX <= rect.right && rect.top <= e.clientY && e.clientY <= rect.bottom;
                    if (!isHovered) {
                        dropdown.style.display = "none";
                        dropdown.remove();
                    }
                }
            }
        });
        // display the dropdown
        dropdown.style.display = "block";
        // Add event listeners to the actual dropdown element in the DOM
        const actualDropdown = document.querySelector(".dropdown-menu")
        actualDropdown.addEventListener("mouseover", () => {
            if (localStorage.getItem("connected") === "true") {
                actualDropdown.style.display = "block";
            }
        });
        
        actualDropdown.addEventListener("mouseout", (e) => {
            if (localStorage.getItem("connected") === "true") {
                const dropdown = document.getElementById("dropdown");
                if(dropdown) {
                    const rect = dropdown.getBoundingClientRect();
                    const isHovered = rect.left <= e.clientX && e.clientX <= rect.right && rect.top <= e.clientY && e.clientY <= rect.bottom;
                    if (!isHovered) {
                        dropdown.style.display = "none";
                        dropdown.remove();
                    }
                }
            }
        });

        // Add an event listener to the disconnect button
        disconnectButton.addEventListener("click", () => {
            // Disable MetaMask
            // Clear the LocalStorage
            localStorage.removeItem("connected");
            localStorage.removeItem("address");
            localStorage.removeItem("token");
           // location.reload();
           dropdown.style.display = "none";
            document.getElementById("connect-button").innerHTML = "Connect Wallet";
            location.reload()
        });  
    
        window.ethereum.on('disconnect', (error) => {
            localStorage.removeItem("connected");
            localStorage.removeItem("address");
            localStorage.removeItem("token");
            document.getElementById("connect-button").innerHTML = "Connect Wallet";
            location.reload();    
        });
    

    });

}
// Add an event listener to the button
connectButton.addEventListener("click", () => {
    // Check if MetaMask is installed
    if (localStorage.getItem("connected") !== "true") {
// Connect to MetaMask
if (window.ethereum) {
window.ethereum.enable().then(() => {
    const web3 = new Web3(window.ethereum);
    // Get the current network ID
    web3.eth.net.getId().then(networkId => {
        // Check if the network ID matches the Polygon network ID
        if (networkId === 137) {
            // Get the user's Ethereum address
            web3.eth.getAccounts().then(accounts => {
                const address = accounts[0];

                fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: address,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    // Save token to local storage
                    localStorage.setItem("token", data.token);
                });
                // Save the connection status and address in LocalStorage
                localStorage.setItem("connected", "true");
                localStorage.setItem("address", address);

                const connectButton = document.getElementById("connect-button");
                const dropdown = document.getElementById("dropdown");
                connectButton.addEventListener("mouseover", () => {
                    if (localStorage.getItem("connected") === "true") {
                        dropdown.style.display = "block";
                    }
                });
                

                // Change the button text to the user's Ethereum address
                const shortenedAddress = address.substring(0, 4) + "..." + address.substr(-5);
                document.getElementById("connect-button").innerHTML = shortenedAddress;
                location.reload(); 
            });
        
        }  else {
                    var getPost = async function () {
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (window.ethereum) {
                            try {
                                // check if the chain to connect to is installed
                                await window.ethereum.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: '0x89' }]
                                });
                                // Wait for the promise to resolve
                                await web3.eth.net.getId().then(async (networkId) => {
                                    if (networkId === 137) {
                                        await web3.eth.getAccounts().then((accounts) => {
                                            const address = accounts[0];
                                            fetch("http://localhost:3000/login", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    username: address,
                                                })
                                            })
                                            .then(res => res.json())
                                            .then(data => {
                                                // Save token to local storage
                                                localStorage.setItem("token", data.token);
                                            });
                                            localStorage.setItem("connected", "true");
                                            localStorage.setItem("address", address);
                                            
                                            // Change the button text to the user's Ethereum address
                                            const shortenedAddress = address.substring(0, 4) + "..." + address.substr(-5);
                                            document.getElementById("connect-button").innerHTML = shortenedAddress;
                                            location.reload();
                                        });
                                    }
                                });
                            } catch (error) {
                          // This error code indicates that the chain has not been added to MetaMask
                          // if it is not, then install it into the user MetaMask
                          if (error.code === 4902) {
                            try {
                                
                                chainId = '137'; chainId = web3.utils.toHex(chainId)

                                // check if the chain to connect to is installed
                                await   window.ethereum.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [{
                                        chainId: chainId,
                                        chainName: 'Matic(Polygon) Mainnet',
                                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                                        rpcUrls: ['https://polygon-rpc.com'],
                                        blockExplorerUrls: ['https://www.polygonscan.com'],
                                    }],
                                  });
                                // Wait for the promise to resolve
                                await web3.eth.net.getId().then(async (networkId) => {
                                    if (networkId === 137) {
                                        await web3.eth.getAccounts().then((accounts) => {
                                            const address = accounts[0];
                                            fetch("http://localhost:3000/login", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    username: address,
                                                })
                                            })
                                            .then(res => res.json())
                                            .then(data => {
                                                // Save token to local storage
                                                localStorage.setItem("token", data.token);
                                            });
                                            // Save the connection status and address in LocalStorage
                                            localStorage.setItem("connected", "true");
                                            localStorage.setItem("address", address);
                                            const connectButton = document.getElementById("connect-button");
                                            const dropdown = document.getElementById("dropdown");
                                            connectButton.addEventListener("mouseover", () => {
                                                if (localStorage.getItem("connected") === "true") {
                                                    dropdown.style.display = "block";
                                                    //dropdownContent.classList.add("show");
                                                }
                                            });
                                            
                                            connectButton.addEventListener("mouseout", () => {
                                                if (localStorage.getItem("connected") === "true") {
                                                    dropdown.style.display = "none";
                                                   // dropdownContent.classList.remove("show");
                                                }
                                            });
                                        
                                            dropdown.addEventListener("mouseover", () => {
                                                if (localStorage.getItem("connected") === "true") {
                                                    dropdown.style.display = "block";
                                                }
                                            });
                                            
                                            dropdown.addEventListener("mouseout", () => {
                                                if (localStorage.getItem("connected") === "true") {
                                                    dropdown.style.display = "none";
                                                }
                                            });
                                            // Change the button text to the user's Ethereum address
                                            const shortenedAddress = address.substring(0, 4) + "..." + address.substr(-5);
                                            document.getElementById("connect-button").innerHTML = shortenedAddress;
                                            location.reload();
                                        });
                                    }else{
                                        localStorage.removeItem("connected");
                                        localStorage.removeItem("address");
                                        localStorage.removeItem("token");
                                        document.getElementById("connect-button").innerHTML = "Connect Wallet";
                                        location.reload(); 
                                    }
                                });
                            } catch (error) {
                              console.error(addError);
                            }
                          }
                          console.error(error);
                        }
                      }     
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            getPost()
            } 
            });
        });
    }
}if (!window.ethereum) {
        // MetaMask is not installed
        // Create the modal element
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <p>MetaMask is not installed. Please install MetaMask before continue</p>
            </div>
        `;
        document.body.appendChild(modal);
        // Get the modal element
        let modalContent = document.getElementsByClassName("modal")[0];
        // Get the <span> element that closes the modal
        let span = document.getElementsByClassName("close")[0];
        // When the user clicks on the button, open the modal
        modalContent.style.display = "block";
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modalContent.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modalContent) {
                modalContent.style.display = "none";
            }
        }
    }
});

// Add a event listener for the "accountsChanged" event
if (window.ethereum && localStorage.getItem("connected") === "true") {
    window.ethereum.on('chainChanged', function () {
        const web3 = new Web3(window.ethereum);
        web3.eth.net.getId().then(networkId => {
            if (networkId !== 137) {


        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `
        <div id="modal">
        <div id="modal-content" class="modal-content2">
            <p>Currently this page only supported in Polygon</p>
            <button id="modal-yes">Switch network</button>
            <button id="modal-no">Disconnect wallet</button>
        </div>
    </div>
        `;
        document.body.appendChild(modal);
        // Get the modal element
        let modalContent = document.getElementsByClassName("modal")[0];
        // Get the <span> element that closes the modal

        modalContent.style.display = "block";

        // When the user clicks anywhere outside of the modal, close it


// Get the "Yes" button
const modalYesButton = document.getElementById("modal-yes");

// Get the "No" button
const modalNoButton = document.getElementById("modal-no");

modalYesButton.addEventListener("click", () => {

    var getPost = async function () {
    await   window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
      });
    }
    getPost()

    const intervalId = setInterval(() => {
    const web3 = new Web3(window.ethereum);
    web3.eth.net.getId().then(networkId => {
        if (networkId === 137) {
        clearInterval(intervalId);
        modalContent.style.display = "none";
        }
        });
        }, 10000);

});

modalNoButton.addEventListener("click", () => {       
            localStorage.removeItem("connected");
            localStorage.removeItem("address");
            localStorage.removeItem("token");
            document.getElementById("connect-button").innerHTML = "Connect Wallet";
            location.reload();    
    });
}
        })
});

    window.ethereum.on('accountsChanged', function () {
        const web3 = new Web3(window.ethereum);
        web3.eth.getAccounts().then(accounts => {
            const address = accounts[0];
if (address !== undefined){
            fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: address,
                })
            })
            .then(res => res.json())
            .then(data => {
                // Save token to local storage
                localStorage.setItem("token", data.token);
            });
            // Save the connection status and address in LocalStorage
            localStorage.setItem("connected", "true");
            localStorage.setItem("address", address);

            // Change the button text to the user's Ethereum address
            const shortenedAddress = address.substring(0, 4) + "..." + address.substr(-5);
            document.getElementById("connect-button").innerHTML = shortenedAddress;;
        }else{
            localStorage.removeItem("connected");
            localStorage.removeItem("address");
            localStorage.removeItem("token");
            location.reload();

        }
        });
           
    });
}

    

    if (window.ethereum && localStorage.getItem("connected") === "true") {
            const web3 = new Web3(window.ethereum);
            web3.eth.net.getId().then(networkId => {
                if (networkId !== 137) {
    
    
            let modal = document.createElement("div");
            modal.classList.add("modal");
            modal.innerHTML = `
            <div id="modal">
            <div id="modal-content" class="modal-content2">
                <p>Currently this page only supported in Polygon</p>
                <button id="modal-yes">Switch network</button>
                <button id="modal-no">Disconnect wallet</button>
            </div>
        </div>
            `;
            document.body.appendChild(modal);
            // Get the modal element
            let modalContent = document.getElementsByClassName("modal")[0];
            // Get the <span> element that closes the modal
    
            modalContent.style.display = "block";
    
            // When the user clicks anywhere outside of the modal, close it


    // Get the "Yes" button
    const modalYesButton = document.getElementById("modal-yes");
    
    // Get the "No" button
    const modalNoButton = document.getElementById("modal-no");
    
    modalYesButton.addEventListener("click", () => {
    
        var getPost = async function () {
        await   window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
          });
        }
        getPost()
        const intervalId = setInterval(() => {
        const web3 = new Web3(window.ethereum);
        web3.eth.net.getId().then(networkId => {
            if (networkId === 137) {
            clearInterval(intervalId);
            modalContent.style.display = "none";
            }
            });
            }, 100000);
    
    });
    
    modalNoButton.addEventListener("click", () => {       
                localStorage.removeItem("connected");
                localStorage.removeItem("address");
                localStorage.removeItem("token");
                document.getElementById("connect-button").innerHTML = "Connect Wallet";
                location.reload();    
        });
    }
            })

    
        window.ethereum.on('accountsChanged', function () {
            const web3 = new Web3(window.ethereum);
            web3.eth.getAccounts().then(accounts => {
                const address = accounts[0];
                if (networkId === 137) {
                fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: address,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    // Save token to local storage
                    localStorage.setItem("token", data.token);
                });
                // Save the connection status and address in LocalStorage
                localStorage.setItem("connected", "true");
                localStorage.setItem("address", address);
                connectButton.addEventListener("mouseover", () => {
                    if (localStorage.getItem("connected") === "true") {
                        dropdown.style.display = "block";
                        //dropdownContent.classList.add("show");
                    }
                });
                
                // Change the button text to the user's Ethereum address
                const shortenedAddress = address.substring(0, 4) + "..." + address.substr(-5);
                document.getElementById("connect-button").innerHTML = shortenedAddress;;
            }
            });
            location.reload(); 
               
        });
    }
    window.ethereum.on('disconnect', (error) => {
        localStorage.removeItem("connected");
        localStorage.removeItem("address");
        localStorage.removeItem("token");
        document.getElementById("connect-button").innerHTML = "Connect Wallet";
        location.reload();    
    });
