//const { contracts_build_directory } = require("../starter_kit/truffle-config");

const { assert } = require('chai');
const { default: Web3 } = require('web3');

const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require('chai')
  .use(require('chai-as-promised'))
  .should()

console.log("Hello")

function tokens(n){

    return web3.utils.toWei(n,'ether')
}

contract('EthSwap',([deployer,investor])=>{

    let token,ethswap

    before(async()=>{

        token = await Token.new()
        ethswap = await EthSwap.new(token.address)
       await token.transfer(ethswap.address,tokens('1000000'))
   })

    describe('Token deployment',async()=>{

        it('contract has a name',async()=>{

            let token = await Token.new()
            const name = await token.name()
           // console.log(name)
            assert.equal(name,'DApp Token')
        })
    })

    describe('EthSwap deployment',async()=>{

        

        

        it('contract has a name',async()=>{

           
            const name = await ethswap.name()
           // console.log(name)
            assert.equal(name,'Etheruem Intstant Exchange')
        })

        it('contract has tokens',async()=>{

            
           
           // console.log(name)
            let balance  = await token.balanceOf(ethswap.address)

            assert.equal(balance.toString(),tokens('1000000'))
        })
    })

    describe('buyTokens()',async()=>{

        let result

        before(async () => {
        // Purchase tokens before each example
        result = await ethswap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
        })

        it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
        // Check investor token balance after purchase
        let investorBalance = await token.balanceOf(investor)
        assert.equal(investorBalance.toString(), tokens('100')) //1 ether = 100 tokens

        // Check ethSwap balance after purchase
        let ethSwapBalance
        ethSwapBalance = await token.balanceOf(ethswap.address)
        assert.equal(ethSwapBalance.toString(), tokens('999900'))
        ethSwapBalance = await web3.eth.getBalance(ethswap.address)
        assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))

      const event = result.logs[0].args
      assert.equal(event.investor, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.tokenAmount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')


        })

    })

    describe('sellTokens()', async () => {
        let result
    
        before(async () => {
          // Investor must approve tokens before the purchase
          await token.approve(ethswap.address, tokens('100'), { from: investor })
          // Investor sells tokens
          result = await ethswap.sellTokens(tokens('100'), { from: investor })
        })
    
        it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
          // Check investor token balance after purchase
          let investorBalance = await token.balanceOf(investor)
          assert.equal(investorBalance.toString(), tokens('0'))
    
          // Check ethSwap balance after purchase
          let ethSwapBalance
          ethSwapBalance = await token.balanceOf(ethswap.address)
          assert.equal(ethSwapBalance.toString(), tokens('1000000'))
          ethSwapBalance = await web3.eth.getBalance(ethswap.address)
          assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

          const event = result.logs[0].args
          assert.equal(event.investor, investor)
          assert.equal(event.token, token.address)
          assert.equal(event.tokenAmount.toString(), tokens('100').toString())
          assert.equal(event.rate.toString(), '100')


          //test for failure
          await ethswap.sellTokens(tokens('200'),{from:investor}).should.be.rejected;
        })
    
    })
})