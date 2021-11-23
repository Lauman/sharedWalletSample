import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { ethers } from "ethers";
import SharedWallet from "./artifacts/contracts/SharedWallet.sol/SharedWallet.json";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
const sharedWalletAddress = process.env.REACT_APP_CONTRACT;

function App() {
  const [addressTest, setAddres] = useState(null);
  // request access to the user's MetaMask account
  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const getBalanceAddress = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        sharedWalletAddress,
        SharedWallet.abi,
        provider
      );
      try {
        const data = await contract
          .getBalanceContract()
          .then(function (result) {
            Swal.fire({
              title: "Balance",
              text: "Balance: " + ethers.utils.formatEther(result.toString()),
              icon: "info",
              confirmButtonText: "Accept",
            });
          })
          .catch(function (error) {
            //console.log(error);
            Swal.fire({
              title: "Transaction fails",
              text: error.data.message,
              icon: "error",
              confirmButtonText: "Accept",
            });
          });
        //console.log("data: ", ethers.utils.formatEther(data.toString()));
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  const sendEtherToContract = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        sharedWalletAddress,
        SharedWallet.abi,
        signer
      );
      const tx = await signer.sendTransaction({
        to: sharedWalletAddress,
        value: ethers.utils.parseEther("2.0"),
      });

      await tx
        .wait()
        .then(function (result) {
          if (result.hash !== null) {
            Swal.fire({
              title: "Transaction complete",
              text: "Send 2 ethers complete",
              icon: "success",
              confirmButtonText: "Accept",
            });
          }
        })
        .catch(function (error) {
          //console.log(error);
          Swal.fire({
            title: "Transaction fails",
            text: error.data.message,
            icon: "error",
            confirmButtonText: "Accept",
          });
        });
      //getBalanceAddress();
    }
  };

  const addAllowance = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        sharedWalletAddress,
        SharedWallet.abi,
        signer
      );
      const tx = await contract
        .addAllowance(addressTest, ethers.utils.parseEther("1.0"))
        .then(function (result) {
          if (result.hash !== null) {
            Swal.fire({
              title: "Transaction complete",
              text: "Allow address:  " + addressTest,
              icon: "success",
              confirmButtonText: "Accept",
            });
          }
        })
        .catch(function (error) {
          //console.log(error);
          Swal.fire({
            title: "Transaction fails",
            text: error.data.message,
            icon: "error",
            confirmButtonText: "Accept",
          });
        });
    }
  };

  const withDrawMoney = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        sharedWalletAddress,
        SharedWallet.abi,
        signer
      );
      await contract
        .withDrawMoney(addressTest, ethers.utils.parseEther("0.001"))
        .then(function (result) {
          //console.log(result);
          if (result.hash !== "") {
            result.wait().then(function (result) {
              if (result.status === 1) {
                //console.log(result.events[0].args);
                Swal.fire({
                  title: "Transaction complete",
                  text:
                    "From event MoneySent " +
                    result.events[0].args._beneficiary +
                    " " +
                    ethers.utils.formatEther(
                      result.events[0].args._amount.toString()
                    ),

                  icon: "success",
                  confirmButtonText: "Accept",
                });
              }
            });
          }
        })
        .catch(function (error) {
          //console.log(error);
          Swal.fire({
            title: "Transacción fails",
            text: error.data.message,
            icon: "error",
            confirmButtonText: "Accept",
          });
        });
    }
  };

  const RenounceOwnership = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        sharedWalletAddress,
        SharedWallet.abi,
        provider
      );
      try {
        const data = await contract
          .renounceOwnership()
          .then(function (result) {
            if (result.hash !== null) {
              //do someting
            }
          })
          .catch(function (error) {
            //console.log(error);
            Swal.fire({
              title: "Transacción incompleta",
              text: error.data.message,
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          });
        //console.log("data: ", ethers.utils.formatEther(data.toString()));
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };
  return (
    <>
      <Box
        sx={{
          alignItems: "baseline",
          justifyContent: "center",
          display: "grid",
          margin: 1,
        }}
      >
        <Button variant="contained" onClick={() => getBalanceAddress()}>
          Get balance of contract
        </Button>

        <br></br>

        <Button variant="contained" onClick={() => sendEtherToContract()}>
          Send ether to contract
        </Button>

        <br></br>

        <br></br>
        <Paper>
          {/* <input
            onChange={(e) => setAddres(e.target.value)}
            placeholder="Set allowance"
          /> */}
          <TextField
            id="standard-basic"
            label="Set allowance"
            variant="standard"
            onChange={(e) => setAddres(e.target.value)}
          />
          {/* <button onClick={() => addAllowance()}>Set allowance</button> */}
          <Button variant="contained" onClick={() => addAllowance()}>
            Set allowance
          </Button>
        </Paper>
        <br></br>

        <Button variant="contained" onClick={() => RenounceOwnership()}>
          Renounce Ownership
        </Button>

        <br></br>
        <Paper>
          {/* <input
            onChange={(e) => setAddres(e.target.value)}
            placeholder="Set allowance"
          /> */}
          {/* <button onClick={() => addAllowance()}>Set allowance</button> */}
          <Button variant="contained" onClick={() => withDrawMoney()}>
            Withdrawals to
          </Button>
          <TextField
            id="standard-basic"
            label="Address to send"
            variant="standard"
            onChange={(e) => setAddres(e.target.value)}
          />
        </Paper>
      </Box>
    </>
  );
}

export default App;
