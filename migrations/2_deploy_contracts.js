const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  
  
  await deployer.deploy(Token);
  const token = await Token.deployed();

  await  deployer.deploy(EthSwap,token.address);
  const ethswap = await EthSwap.deployed();

  

  await token.transfer(ethswap.address,'1000000000000000000000000');
};
