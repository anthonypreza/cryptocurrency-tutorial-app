// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Juturna {
    string public name = "Juturna";
    string public symbol = "JUT";
    string public standard = "Juturna v1.0";
    uint256 public totalSupply;

    // Transfer event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;

        // allocate the initial supply
        balanceOf[msg.sender] = totalSupply;
    }

    // Transfer
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // check if the sender has enough balance
        require(balanceOf[msg.sender] >= _value);

        // subtract the amount from the sender
        balanceOf[msg.sender] -= _value;

        // add the amount to the recipient
        balanceOf[_to] += _value;

        // emit the transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
