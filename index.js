const fs = require('fs');
const { ethers } = require("ethers");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const axios = require('axios');

const { 
    ETHRPC,
    BSCRPC,
    ARBRPC,
    OPRPC,
    POLYGONRPC,
    BASERPC,
    FANTOMRPC,
    AVAXRPC,
    MetisRPC,
    BlastRPC,
    ModeRPC,
    ZksyncRPC,
    LineaRPC,
    ScrollRPC,
    OpBnbRPC,
    MoonBeamRPC,
    MoonriverRPC 
} = require("./component/network");

const {
    polygonMerkly1,
    polygonMerkly2,
    polygonMerkly3,
    polygonMerkly4,
    polygonMerkly5,
    polygonMerkly6,
    polygonMerkly7,
} = require("./component/merklyCommAddress");

const oklink_apiKey="68f6865b-bade-42fb-9669-b437bd2f6d5c";

const eth_provider = new ethers.providers.JsonRpcProvider(ETHRPC);
const bsc_provider = new ethers.providers.JsonRpcProvider(BSCRPC);
const arb_provider = new ethers.providers.JsonRpcProvider(ARBRPC);
const op_provider = new ethers.providers.JsonRpcProvider(OPRPC);
const polygon_provider = new ethers.providers.JsonRpcProvider(POLYGONRPC);
const base_provider = new ethers.providers.JsonRpcProvider(BASERPC);
const ftm_provider = new ethers.providers.JsonRpcProvider(FANTOMRPC);
const avax_provider = new ethers.providers.JsonRpcProvider(AVAXRPC);
const metis_provider = new ethers.providers.JsonRpcProvider(MetisRPC);
const blast_provider = new ethers.providers.JsonRpcProvider(BlastRPC);
const mode_provider = new ethers.providers.JsonRpcProvider(ModeRPC);
const zksync_provider = new ethers.providers.JsonRpcProvider(ZksyncRPC);
const linea_provider = new ethers.providers.JsonRpcProvider(LineaRPC);
const scroll_provider = new ethers.providers.JsonRpcProvider(ScrollRPC);
const opbnb_provider = new ethers.providers.JsonRpcProvider(OpBnbRPC);
const moonbeam_provider = new ethers.providers.JsonRpcProvider(MoonBeamRPC);
const moonriver_provider = new ethers.providers.JsonRpcProvider(MoonriverRPC);

//2024/5/1 approximate price
const eth_price="310000";  //3100
const matic_price="77";   //0.77
const ftm_price="74";     //0.74
const avax_price="3900";  //39
const bnb_price="60000";  //600
const metis_price="6100"; //61
const glmr_price="31";  //0.31
const movr_price="1300";  //13

//balance
async function getUserBalance(address) {
    try {
        const eth_Balance = await eth_provider.getBalance(address);
        const bsc_Balance = await bsc_provider.getBalance(address);
        const arb_Balance = await arb_provider.getBalance(address);
        const op_Balance = await op_provider.getBalance(address);
        const polygon_Balance = await polygon_provider.getBalance(address);
        const base_Balance = await base_provider.getBalance(address);
        const ftm_Balance = await ftm_provider.getBalance(address);
        const avax_Balance = await avax_provider.getBalance(address);
        const metis_Balance = await metis_provider.getBalance(address);
        const blast_Balance = await blast_provider.getBalance(address);
        const mode_Balance = await mode_provider.getBalance(address);
        const zksync_Balance = await zksync_provider.getBalance(address);
        const linea_Balance = await linea_provider.getBalance(address);
        const scroll_Balance = await scroll_provider.getBalance(address);
        const opbnb_Balance = await opbnb_provider.getBalance(address);
        const moonbeam_Balance = await moonbeam_provider.getBalance(address);
        const moonriver_Balance = await moonriver_provider.getBalance(address);
        //
        const stringETHBalance = ethers.BigNumber.from(eth_Balance);
        // const stringBSCBalance = ethers.BigNumber.from(bsc_Balance);
        // const stringARBBalance = ethers.BigNumber.from(arb_Balance);
        // const stringOPBalance = ethers.BigNumber.from(op_Balance);
        // const stringPOLYGONBalance = ethers.BigNumber.from(polygon_Balance);
        // const stringBASEBalance = ethers.BigNumber.from(base_Balance);
        // const stringFTMBalance = ethers.BigNumber.from(ftm_Balance);
        // const stringAVAXBalance = ethers.BigNumber.from(avax_Balance);
        // const stringMetisBalance = ethers.BigNumber.from(metis_Balance);
        // const stringBlastBalance = ethers.BigNumber.from(blast_Balance);
        // const stringModeBalance = ethers.BigNumber.from(mode_Balance);
        // const stringZksyncBalance = ethers.BigNumber.from(zksync_Balance);
        // const stringLineaBalance = ethers.BigNumber.from(linea_Balance);
        // const stringScorllBalance = ethers.BigNumber.from(scroll_Balance);
        // const stringOpbnbBalance = ethers.BigNumber.from(opbnb_Balance);
        // const stringMoonbeamBalance = ethers.BigNumber.from(moonbeam_Balance);
        // const stringMoonriverBalance = ethers.BigNumber.from(moonriver_Balance);
        // 
        const ETHBalance = ethers.utils.formatUnits(stringETHBalance.toString(), 'ether');
        // const BSCBalance = ethers.utils.formatUnits(stringBSCBalance.toString(), 'ether');
        // const ARBBalance = ethers.utils.formatUnits(stringARBBalance.toString(), 'ether');
        // const OPBalance = ethers.utils.formatUnits(stringOPBalance.toString(), 'ether');
        // const POLYGONBalance = ethers.utils.formatUnits(stringPOLYGONBalance.toString(), 'ether');
        // const BASEBalance = ethers.utils.formatUnits(stringBASEBalance.toString(), 'ether');
        // const FTMBalance = ethers.utils.formatUnits(stringFTMBalance.toString(), 'ether');
        // const AVAXBalance = ethers.utils.formatUnits(stringAVAXBalance.toString(), 'ether');
        // const MetisBalance = ethers.utils.formatUnits(stringMetisBalance.toString(), 'ether');
        // const BlastBalance = ethers.utils.formatUnits(stringBlastBalance.toString(), 'ether');
        // const ModeBalance = ethers.utils.formatUnits(stringModeBalance.toString(), 'ether');
        // const ZksyncBalance = ethers.utils.formatUnits(stringZksyncBalance.toString(), 'ether');
        // const LineaBalance = ethers.utils.formatUnits(stringLineaBalance.toString(), 'ether');
        // const ScorllBalance = ethers.utils.formatUnits(stringScorllBalance.toString(), 'ether');
        // const OpbnbBalance = ethers.utils.formatUnits(stringOpbnbBalance.toString(), 'ether');
        // const MoonbeamBalance = ethers.utils.formatUnits(stringMoonbeamBalance.toString(), 'ether');
        // const MoonriverBalance = ethers.utils.formatUnits(stringMoonriverBalance.toString(), 'ether');


        const ethPrice=ethers.BigNumber.from(eth_price.toString(16));
        const maticPrice=ethers.BigNumber.from(matic_price.toString(16));
        const ftmPrice=ethers.BigNumber.from(ftm_price.toString(16));
        const bnbPrice=ethers.BigNumber.from(bnb_price.toString(16));
        const avaxPrice=ethers.BigNumber.from(avax_price.toString(16));
        const metisPrice=ethers.BigNumber.from(metis_price.toString(16));
        const glmrPrice=ethers.BigNumber.from(glmr_price.toString(16));
        const movrPrice=ethers.BigNumber.from(movr_price.toString(16));

        let ethTotalBalance=eth_Balance.add(base_Balance).add(op_Balance).add(arb_Balance).add(blast_Balance).
        add(mode_Balance).add(zksync_Balance).add(linea_Balance).add(scroll_Balance);
        let bnbTotalBalance=bsc_Balance.add(opbnb_Balance);

        const a100=ethers.BigNumber.from("100");
        
        let totalUBalance= 
            ethers.BigNumber.from((
            (ethPrice.mul(ethTotalBalance).add
            (maticPrice.mul(polygon_Balance)).add
            (ftmPrice.mul(ftm_Balance)).add
            (bnbPrice.mul(bnbTotalBalance)).add
            (avaxPrice.mul(avax_Balance)).add
            (metisPrice.mul(metis_Balance)).add
            (glmrPrice.mul(moonbeam_Balance)).add
            (movrPrice.mul(moonriver_Balance))).div(a100)
        ));

        let TotalMoney = ethers.utils.formatUnits(totalUBalance.toString(), 'ether');

        let balanceObj = new Object();
        balanceObj.ethBalance=ETHBalance;
        balanceObj.totalMoney=TotalMoney;

        // console.log(
        //     "Balance:", address, "\n",
        //     "ETH Balance:", ETHBalance, "\n",
        //     "BSC Balance:", BSCBalance, "\n",
        //     "ARB Balance", ARBBalance, "\n",
        //     "OP Balance:", OPBalance, "\n",
        //     "Polygon Balance:", POLYGONBalance, "\n",
        //     "Base Balance:", BASEBalance,"\n",
        //     "FTM Balance:", FTMBalance,"\n",
        //     "Avax Balance:", AVAXBalance,"\n",
        //     "Total U Money:",TotalMoney
        // );
        // console.log(
        //     "user:", address, "\n",
        //     "ETH mainnet Balance:", ETHBalance, "\n",
        //     "Total U Money:",TotalMoney,"$"
        // );

        return balanceObj;
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

//tx 
async function getUserTransactions(address) {
    try {
        const eth_txCount = await eth_provider.getTransactionCount(address);
        const bsc_txCount = await bsc_provider.getTransactionCount(address);
        const arb_txCount = await arb_provider.getTransactionCount(address);
        const op_txCount = await op_provider.getTransactionCount(address);
        const polygon_txCount = await polygon_provider.getTransactionCount(address);
        const base_txCount = await base_provider.getTransactionCount(address);
        const ftm_txCount = await ftm_provider.getTransactionCount(address);
        const avax_txCount = await avax_provider.getTransactionCount(address);
        const metis_txCount = await metis_provider.getTransactionCount(address);
        const blast_txCount = await blast_provider.getTransactionCount(address);
        const mode_txCount = await mode_provider.getTransactionCount(address);
        const zksync_txCount = await zksync_provider.getTransactionCount(address);
        const linea_txCount = await linea_provider.getTransactionCount(address);
        const scroll_txCount = await scroll_provider.getTransactionCount(address);
        const opbnb_txCount = await opbnb_provider.getTransactionCount(address);
        const monnbeam_txCount = await moonbeam_provider.getTransactionCount(address);
        const moonriver_txCount = await moonriver_provider.getTransactionCount(address);
        
        let total_tx=eth_txCount+bsc_txCount+arb_txCount+op_txCount+polygon_txCount+
        base_txCount+ftm_txCount+avax_txCount+metis_txCount+blast_txCount+mode_txCount+zksync_txCount+
        linea_txCount+scroll_txCount+opbnb_txCount+monnbeam_txCount+moonriver_txCount;
        let total_chains=0;

        if (eth_txCount > 0) total_chains++;
        if (bsc_txCount > 0) total_chains++;
        if (arb_txCount > 0) total_chains++;
        if (op_txCount > 0) total_chains++;
        if (polygon_txCount > 0) total_chains++;
        if (base_txCount > 0) total_chains++;
        if (ftm_txCount > 0) total_chains++;
        if (avax_txCount > 0) total_chains++;
        if (metis_txCount > 0) total_chains++;
        if (blast_txCount > 0) total_chains++;
        if (mode_txCount > 0) total_chains++;
        if (zksync_txCount > 0) total_chains++;
        if (linea_txCount > 0) total_chains++;
        if (scroll_txCount > 0) total_chains++;
        if (opbnb_txCount > 0) total_chains++;
        if (monnbeam_txCount > 0) total_chains++;
        if (moonriver_txCount > 0) total_chains++;
        
        // console.log(
        //     "Total transactions for", address, "\n",
        //     "ETH Count:", eth_txCount, "\n",
        //     "BSC Count:", bsc_txCount, "\n", 
        //     "ARB Count", arb_txCount, "\n", 
        //     "OP Count:", op_txCount, "\n",
        //     "Polygon Count:", polygon_txCount, "\n", 
        //     "Base Count:", base_txCount, "\n", 
        //     "Ftm Count:", ftm_txCount, "\n", 
        //     "Avax Count:", avax_txCount, "\n", 
        //     "user_total_tx:",total_tx,"\n",
        //     "user_total_chains:",total_chains
        // );
        // console.log(
        //     "user:", address, "\n",
        //     "ETH Count:", eth_txCount, "\n",
        //     "user_total_tx:",total_tx,"\n",
        //     "user_total_chains:",total_chains
        // );

        let txObj = new Object();
        txObj.ethTxCount=eth_txCount;
        txObj.totalTx=total_tx;
        txObj.totalChains=total_chains;
        return txObj;
    } catch (error) {
        console.error("Error fetching total transactions:", error);
    }
}


//oklink
//chain status
async function fetchChainStatus(apiKey){
    const config = {
        url: "https://www.oklink.com/api/v5/explorer/blockchain/summary",
        method: "GET",
        // params: {
        //     chainShortName: ""
        // },
        headers: {
            "Accept": "*/*",
            "Ok-Access-Key": apiKey,
            "Content-Type": "application/json"
        }
    };

    try {
        
        const response = await axios(config);
        const chains = response.data;
        console.log("chains:",chains);
        // transactionList.forEach(transaction => {
        //     console.log(transaction);
        // });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

//TokenTransactionList
async function getTokenTransactionList(address,apiKey,oklink_chain){

    const config = {
        url: "https://www.oklink.com/api/v5/explorer/address/token-transaction-list",
        method: "GET",
        params: {
            chainShortName: oklink_chain,
            address: address,
            protocolType: "token_20",
            limit: "10"
        },
        headers: {
            "Accept": "*/*",
            "Ok-Access-Key": apiKey,
            "Content-Type": "application/json"
        }
    };

    try {
        
        const response = await axios(config);
        const transactionList = response.data.data[0].transactionList;
        console.log("Transaction List:");
        transactionList.forEach(transaction => {
            console.log(transaction);
        });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

//address age
async function getAddressAge(address,apiKey,oklink_chain){
    const config = {
        url: "https://www.oklink.com/api/v5/explorer/address/address-summary",
        method: "GET",
        params: {
            chainShortName: oklink_chain,
            address:address
        },
        headers: {
            "Accept": "*/*",
            "Ok-Access-Key": apiKey,
            "Content-Type": "application/json"
        }
    };

    try {
        const response = await axios(config);
        const firstTransactionTime = response.data.data[0].firstTransactionTime;
        const millisecondsInOneYear = 365 * 24 * 60 * 60;
        const latestBlock = await polygon_provider.getBlock('latest');
        const latestBlockTimestamp = latestBlock.timestamp;
        const interval=latestBlockTimestamp-firstTransactionTime/1000;
        //
        if(interval <= millisecondsInOneYear){
            return 1;
        }else{
            return 2;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

//normal-transaction-list
async function getNormalTransactionList(address,apiKey,oklink_chain,startBlock,endBlock,indexPage){
    const config = {
        url: "https://www.oklink.com/api/v5/explorer/address/normal-transaction-list",
        method: "GET",
        params: {
            chainShortName: oklink_chain,
            address: address,
            startBlockHeight:startBlock ,
            endBlockHeight: endBlock ,
            page: indexPage,
            limit: "100"
        },
        headers: {
            "Accept": "*/*",
            "Ok-Access-Key": apiKey,
            "Content-Type": "application/json"
        }
    };
    try {
        const response = await axios(config);
        const transactionListArray = response.data.data[0].transactionList;
        return transactionListArray;
        // console.log("Transaction List:",transactionList);


    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

//sybil Common protocol
// 1、Merkly 2、Stargate 3、Testnet Bridge 4、Aptos Bridge 5、L2Pass
//merkly sybil uses chains a lot：1、polygon 2、zksync 3、arbitrum 4、optimism
async function merklySybil(address,apiKey,oklink_chain,startBlock,endBlock,index){
    let stringIndex=String(index);
    let waitAddressGroup=[];
    const csvWriter = createCsvWriter({
        path: `./sybilAddress/waitAddress${index}.csv`,
        header: [
            { id: 'address', title: 'Address' },
            { id: 'total_gas', title: 'Total_Gas'},
            { id: 'total_tx', title: 'Total_Tx'},
            { id: 'use_chains', title: 'Use_Chains'},
            { id: 'wallet_age', title: 'Wallet_Age'}
        ]
    });
    const transactionList = await getNormalTransactionList(address,apiKey,oklink_chain,startBlock,endBlock,stringIndex);
    console.log("last height:",transactionList[transactionList.length-1].height);
    console.log("page length:",transactionList.length);
    for(const item of transactionList){
        let userTxData;
        let userAge;
        let userTotalMoney;
        let thisAddress=item.from;
        let isSybil = false;
        try{
            console.log("thisAddress:",thisAddress);
            userTxData=await getUserTransactions(thisAddress);
            userAge=await getAddressAge(thisAddress,apiKey,oklink_chain);
            userTotalMoney=await getUserBalance(thisAddress);
        }catch(error){
            console.log(error);
            continue;
        }
        if(userAge==1){
            if(userTxData.totalTx<200 && userTxData.totalChains<=2){
                // const walletTxnStats=await getWalletTxnStats(footprint_chain,thisAddress);
                // console.log("walletTxnStats:",walletTxnStats);
                console.log("userTotalMoney:",userTotalMoney.totalMoney);
                if(userTotalMoney.totalMoney<10){
                    isSybil=true;
                }else{
                    console.log("money pass");
                }
            }else{
                console.log("chains pass");
            }
        }else if(userAge==2){
            if(userTxData.totalTx<300 && userTxData.totalChains<=3){
                console.log("userTotalMoney:",userTotalMoney.totalMoney);
                if(userTotalMoney.totalMoney<10){
                    isSybil=true;
                }else{
                    console.log("money pass");
                }
            }
            else{
                console.log("chains pass");
            }
        }else{
            console.log("wallet age error");
            continue;
        }
        if (isSybil) {
            waitAddressGroup.push({
                address: thisAddress,
                total_gas: userTotalMoney.totalMoney,
                total_tx: userTxData.totalTx,
                use_chains: userTxData.totalChains,
                wallet_age: userAge
            });
            console.log("sybil:", thisAddress);
        }           
        
    }
    
    const records = waitAddressGroup.map(item => ({
        address: item.address,
        total_gas:item.total_gas,
        total_tx:item.total_tx,
        use_chains:item.use_chains,
        wallet_age:item.wallet_age
    }));
    await csvWriter.writeRecords(records);
    console.log('CSV file written successfully');
    return transactionList.length;
}

async function stargateSybil(){

}

async function testnetBridgeSybil(){

}

async function aptosSybil(){

}

async function l2PassSybil(){

}

//Gather suspect addresses
async function collect() {
    // await getUserTransactions(a);
    // await getTransactionService(a);
    // await getAddressAge(a,oklink_apiKey,"polygon");

    for(let i=25;i<100;i++){
        console.log("current page:",i);
        let currentLength=await merklySybil(polygonMerkly1,oklink_apiKey,"polygon",54970270,55000000,i);
        if(currentLength!=100){
            console.log("End of current block interval traversal");
            break;
        }
    }

    // await getWalletTxnStats("Polygon",a);

    // await getWalletContractTxnStats("Arbitrum",checkAddress,arb);

    // await fetchChainStatus(oklink_apiKey,fetchChains);

    // await getTokenTransactionList(a,oklink_apiKey,oklink_url);
    
    // const userTx=await getUserTransactions(a);
    // const userTotalTx = userTx.totalTx;
    // console.log("userTotalTx:",userTotalTx);
}

collect();
