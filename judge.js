const fs = require('fs');
const path = require('path');
const { ethers } = require("ethers");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const { CovalentClient } =require("@covalenthq/client-sdk");
const axios = require('axios');

//old:Wz/q+FBeyBWGFiT+BDRoikIfxWm+TfxyevbhR6RE4AUW3O6mvU8uNW1qpNbKiErH
const footPrintApiKey="fBQ42rAqnpaR7MiOo8zKH5xk2ICaE6QfKnlIljpAXg03r2e34PmLIzgUm8BNN1Wy";

const folderWaitSybilAddressPath = './sybilAddress';
const outputFilePath = './foundSybil/AggregatedWaitSybilGroup.csv';
let allWaitData = []; 

//Aggregated csv
async function aggregatedCsv(){
  fs.readdir(folderWaitSybilAddressPath, (err, files) => {
    if (err) {
      return console.error('Read csv error:', err);
    }

  const csvFiles = files.filter(file => path.extname(file) === '.csv');

  if (csvFiles.length === 0) {
    return console.log('No csv');
  }

  csvFiles.forEach((file, index) => {
    const filePath = path.join(folderWaitSybilAddressPath, file);
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        allWaitData.push(row);
      })
      .on('end', () => {
        //
        if (index === csvFiles.length - 1) {
          writeAllWaitSybilGroupCsv();
        }
      });
  });
});
}

//
async function writeAllWaitSybilGroupCsv() {
  if (allWaitData.length === 0) {
    return console.log('No data');
  }

  const csvWriter = createCsvWriter({
    path: outputFilePath,
    header: [
      { id: 'address', title: 'Address' },
      { id: 'total_gas', title: 'Total_Gas'},
      { id: 'total_tx', title: 'Total_Tx'},
      { id: 'use_chains', title: 'Use_Chains'},
      { id: 'wallet_age', title: 'Wallet_Age'}
  ]
  });
  const records = allWaitData.map(item => ({
    address: item.Address,
    total_gas: item.Total_Gas,
    total_tx: item.Total_Tx,
    use_chains: item.Use_Chains,
    wallet_age: item.Wallet_Age
  }));
  
  await csvWriter.writeRecords(records);
  console.log('CSV file written successfully');
  return true;
}

//footprint
async function getWalletTxnStats(footprint_chain,address){
  const config = {
      url: "https://api.footprint.network/api/v3/address/getWalletTxnStats",
      method: "GET",
      params: {
          chain: footprint_chain,
          wallet_address: address,
      },
      headers: {
          "Accept": "application/json",
          "api-key": footPrintApiKey,
          // "Content-Type": "application/json"
      }
  };
    
  try {
      const response = await axios(config);
      const data = response.data.data;
      console.log("number_of_active_days:",data);
      return data;

  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

async function getWalletContractTxnStats(footprint_chain,userAddress,contractAddress){
  const config = {
      url: "https://api.footprint.network/api/v3/address/getWalletContractTxnStats",
      method: "GET",
      params: {
          chain: footprint_chain,
          wallet_address: userAddress,
          contract_address: contractAddress
      },
      headers: {
          "Accept": "application/json",
          "api-key": footPrintApiKey,
          "Content-Type": "application/json"
      }
  };
    
  try {
      
      const response = await axios(config);
      const data = response.data.data;
      console.log("WalletContractTxnStats:",data);
      // transactionList.forEach(transaction => {
      //     console.log(transaction);
      // });

  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

//Covalent("matic-mainnet")
//get earliest_transaction, latest_transaction, time
async function getTransactionService(address,covalent_chain){
  const client = new CovalentClient("cqt_rQGQmPWdcKPPkbPDYFvM3JB9khxJ");
  const resp = await client.TransactionService.getTransactionSummary(covalent_chain,address);
  const earliest=resp.data.items[0].earliest_transaction.block_signed_at;
  const latest=resp.data.items[0].latest_transaction.block_signed_at
  const firstTime = new Date(earliest);
  const lastTime = new Date(latest);
  const a = firstTime.getTime();
  const b = lastTime.getTime();
  const earliest_transaction = Math.floor(a / 1000);
  const latest_transaction  = Math.floor(b / 1000);
  console.log("earliest_transaction:",firstTime);
  console.log("latest_transaction:",lastTime);
  //use three months
  const threeMoney=60*60*24*90;
  const useTime=latest_transaction-earliest_transaction;
  if(useTime-threeMoney>0){
    return true;
  }else{
    return false;
  }
}

//Get paginated transactions
async function getPaginatedTransactions(address,covalent_chain,page){
  const apiKey = "cqt_rQGQmPWdcKPPkbPDYFvM3JB9khxJ";
  const url = `https://api.covalenthq.com/v1/${covalent_chain}/address/${address}/transactions_v3/page/${page}/?no-logs=true`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    return response.data; // 只返回交易数组
  } catch (error) {
    console.error(`Error fetching transactions for page ${page}:`, error);
    return [];
  }
}

//Get active days
async function getUserActiveDays(address,covalent_chain){
  let page = 0;
  let allTransactions = [];
  const polygon_provider = new ethers.providers.JsonRpcProvider("https://polygon-bor-rpc.publicnode.com");
  const polygon_txCount = await polygon_provider.getTransactionCount(address);
  const totalPages = Math.ceil(polygon_txCount / 100);
  console.log("totalPages:",totalPages);

  for(page;page<totalPages;page++){
    const transactions = await getPaginatedTransactions(address,covalent_chain,page);
    // console.log("allTransactions:",transactions.data);
    allTransactions = allTransactions.concat(transactions.data.items);
  }
  // 提取交易日期并去重
  const transactionDates = new Set();
  allTransactions.forEach(tx => {
    const date = new Date(tx.block_signed_at).toISOString().split('T')[0];
    transactionDates.add(date);
  });
  
  console.log("Active days:",transactionDates.size);
  return transactionDates.size;
}

// async function judge(){
//   let initialListGroup=[];
//   let results = [];
//   let sybilGroup=[];
//   let processedAddresses = new Set();

//   const csvWriter = createCsvWriter({
//     path: `./sybilAddress/foundSybil.csv`,
//     header: [
//         { id: 'address', title: 'Address' },
//         { id: 'total_gas', title: 'Total_Gas'},
//         { id: 'total_tx', title: 'Total_Tx'},
//         { id: 'use_chains', title: 'Use_Chains'},
//         { id: 'wallet_age', title: 'Wallet_Age'},
//         { id: 'pass_threeMoney', title: 'Pass_ThreeMoney'},
//         { id: 'active_days', title: 'Active_Days'}
//     ]
// });

//   fs.createReadStream('./sybilAddress/initialList.csv')
//   .pipe(csv())
//   .on('data', (data) => initialListGroup.push(data))
//   .on('end', () => {})
//   .on('error', (error) => {
//     console.error('read initialList error:', error);
//   });

//   fs.createReadStream('./sybilAddress/totalWaitAddress.csv')
//     .pipe(csv())
//     .on('data', (data) => results.push(data))
//     .on('end', async() => {
//       console.log('CSV content:', results.length);
//       for (const result of results) {
//           let isSybil = false;
//           let thisAddress = result.Address;
//           if (processedAddresses.has(thisAddress)) {
//             continue;
//           }
//           processedAddresses.add(thisAddress);
//           try {
//           let ifPassThreeMonth=await getTransactionService(thisAddress,"matic-mainnet");
//           let userActiveDays=await getUserActiveDays(thisAddress,"matic-mainnet");
//           //sybil <3 months or <=21 active days 
//           if(ifPassThreeMonth===false || userActiveDays<=21){
//             isSybil=true;
//           }else{
//             console.log("Non sybil:",thisAddress);
//           }
//           if (isSybil) {
//             sybilGroup.push({
//                 address: thisAddress,
//                 total_gas: result.Total_Gas,
//                 total_tx: result.Total_Tx,
//                 use_chains: result.Use_Chains,
//                 wallet_age: result.Wallet_Age,
//                 pass_threeMoney: ifPassThreeMonth,
//                 active_days:userActiveDays
//             });
//           console.log("sybil:", thisAddress);
//         }       
            
//           } catch (error) {
//             console.error(`Error fetching walletTxnStats for ${thisAddress}:`, error);
//           }
//       }
//       const records = sybilGroup.map(item => ({
//         address: item.address,
//         total_gas:item.total_gas,
//         total_tx:item.total_tx,
//         use_chains:item.use_chains,
//         wallet_age:item.wallet_age,
//         pass_threeMoney: item.pass_threeMoney,
//         active_days:item.active_days
//       }));
//       await csvWriter.writeRecords(records);
//       console.log('CSV file written successfully');

//     })
//     .on('error', (error) => {
//       console.error('read error:', error);
//   });

// }

async function judge() {
  let initialListGroup = new Set();
  let results = [];
  let sybilGroup = [];
  let processedAddresses = new Set();

  const csvWriter = createCsvWriter({
    path: './foundSybil/sybilData.csv',
    header: [
      { id: 'address', title: 'Address' },
      { id: 'total_gas', title: 'Total_Gas' },
      { id: 'total_tx', title: 'Total_Tx' },
      { id: 'use_chains', title: 'Use_Chains' },
      { id: 'wallet_age', title: 'Wallet_Age' },
      { id: 'pass_threeMoney', title: 'Pass_ThreeMoney' },
      { id: 'active_days', title: 'Active_Days' }
    ]
  });

  //  initialList.csv 
  const initialListPromise = new Promise((resolve, reject) => {
    fs.createReadStream('./foundSybil/initialList.csv')
      .pipe(csv())
      .on('data', (data) => initialListGroup.add(data.Address))
      .on('end', resolve)
      .on('error', reject);
  });

  //  totalWaitAddress.csv 
  const resultsPromise = new Promise((resolve, reject) => {
    fs.createReadStream('./foundSybil/AggregatedWaitSybilGroup.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  // 
  await Promise.all([initialListPromise, resultsPromise]);
  console.log('CSV content:', results.length);

  for (const result of results) {
    let isSybil = false;
    let thisAddress = result.Address;

    if (processedAddresses.has(thisAddress)) {
      continue;
    }
    processedAddresses.add(thisAddress);

    if (initialListGroup.has(thisAddress)) {
      continue;
    }

    try {
      let ifPassThreeMonth = await getTransactionService(thisAddress, "matic-mainnet");
      let userActiveDays = await getUserActiveDays(thisAddress, "matic-mainnet");

      // sybil <3 months or <=21 active days 
      if (ifPassThreeMonth === false || userActiveDays <= 21) {
        isSybil = true;
      } else {
        console.log("Non sybil:", thisAddress);
      }

      if (isSybil) {
        sybilGroup.push({
          address: thisAddress,
          total_gas: result.Total_Gas,
          total_tx: result.Total_Tx,
          use_chains: result.Use_Chains,
          wallet_age: result.Wallet_Age,
          pass_threeMoney: ifPassThreeMonth,
          active_days: userActiveDays
        });
        console.log("sybil:", thisAddress);
      }

    } catch (error) {
      console.error(`Error fetching walletTxnStats for ${thisAddress}:`, error);
    }
  }

  const records = sybilGroup.map(item => ({
    address: item.address,
    total_gas: item.total_gas,
    total_tx: item.total_tx,
    use_chains: item.use_chains,
    wallet_age: item.wallet_age,
    pass_threeMoney: item.pass_threeMoney,
    active_days: item.active_days
  }));

  await csvWriter.writeRecords(records);
  console.log('CSV file written successfully');
}


async function foundSybil(){
  await aggregatedCsv();
  await judge();
}

foundSybil();




