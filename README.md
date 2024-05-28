# layerzero_merkly_sybil  
The repository is used to verify malicious use of merkly, launch layerzero's witch attack, and partially verify witch addresses  
  
## 1.The analysis covers most of the major EVM chains:   
A total of 15 chains, mainly Polygon analysis,Ethereum, Arbitrum, Optimism, Base, Polygon, Zksync, Linea, Scorll, blast, Mode, Avax, Bnb, Moonbeam, Opbnb, Moonriver;  
  
## 2.The analysis determines address witches by:  
    1.Used merkly;  
    2.The total tx number of wallet addresses in these chains;  
    3.The total gas balance of the wallet address in these chains;  
    4.The creation age of the wallet address;  
    5.How many chains are used in the wallet address;  
    6.Whether the last transaction and the first transaction of the wallet address are more than 3 months ago or whether they have been used more than 21 days.  
      
## 3.Specific decision Decision address witch rules:  
    1. First of all, due to conditions, we can only scan polygon blocks in merkly to obtain potential addresses;  
    2. Then use getAddressAge to obtain whether the initial creation date of the user address is >1 year;  
    3, if the user's date <=1 year, the total tx of the user in these chains <200 and the chain used <=2, and then determine the user's total balance gas<10 is a potential witch;   
    If the user's date is >1 year, then the user's total tx in these chains is <300 and the chain used is <=3, and then the user's total balance gas<10 is a potential witch;  
    4. Due to the limited data returned, sybilAddress, a suspect address group, was generated by using the for loop to push the potential witch address to the waitAddress${page}.csv   
    file of each data page;  
    5. Then call aggregatedCsv through judge.js to integrate the potential witch address group into the AggregatedWaitSybilGroup.csv;  
    6, through getTransactionService to find out whether the user's latest transaction > the first transaction three months;  
    7. Run getUserActiveDays to obtain the active days of polygon's address.  
    8. When the last transaction of the potential witch address read is <=3 months away from the first transaction or the active days in polygon are <=21 days, then it is screened  
    whether it is one of the more than 80 w addresses published by layerzero, and determines whether the addresses are repeated, and finally generates the witch list sybilData.csv
    
## 4.  Code execution verification:  
  1.To download node.js locally, download the following dependencies:  
"@covalenthq/client-sdk": "^1.0.2",  
axios: "^1.6.8",  
csv-parser": "^3.0.0",  
csv-writer": "^1.6.0",  
ethers: ^5.7.2  
  2.Once everything is in place, make sure oklink apiKey is available as well as covalent apiKey  
  3、First execute index.js to get the csv file of the filtered list of potential witch addresses (this process can be slow, and so far I only have 23 pages of potential witch lists due to api and time constraints), then execute judge.js to get the total potential list address group, and finally filter the non-duplicate witch addresses. And with layzero find the exclusion in 80w.  
