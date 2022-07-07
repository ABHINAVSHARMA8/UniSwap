pragma solidity ^0.5.16;
import "./Token.sol";


contract EthSwap{

    string public name = "Etheruem Intstant Exchange";
    Token public token;
    uint public rate=100;

    event TokenPurchased(

        address investor,
        address token,
        uint tokenAmount,
        uint rate
    );

    event TokenSold(

        address investor,
        address token,
        uint tokenAmount,
        uint rate
    );

    constructor(Token _token) public{

        token = _token;
    }

    function  buyTokens() public payable{

        
        uint tokenAmount = msg.value*rate; //msg.value = amont of Ether sent
        require(token.balanceOf(address(this))>=tokenAmount,'Exchange does not have enough tokens');// to check if the exchange has sufficent tokens

        token.transfer(msg.sender,tokenAmount);

        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public{

        uint etherAmount = _amount/rate;

        require(address(this).balance>=etherAmount);

        token.transferFrom(msg.sender,address(this), _amount);
        
        msg.sender.transfer(etherAmount);

        emit TokenSold(msg.sender,address(token), _amount, rate);
    }
}