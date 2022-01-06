// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Juturna {
    string public name = "Juturna";
    string public symbol = "JUT";
    string public standard = "Juturna v1.0";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;

        balanceOf[msg.sender] = totalSupply;
    }

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

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        // check if the sender has enough balance
        require(balanceOf[msg.sender] >= _value);

        // add the amount to the allowance
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // check if the sender has enough balance
        require(balanceOf[_from] >= _value);

        // check if the allowance is big enough
        require(allowance[_from][msg.sender] >= _value);

        // subtract the amount from the sender
        balanceOf[_from] -= _value;

        // subtract the amoount from the allowance
        allowance[_from][msg.sender] -= _value;

        // add the amount to the recipient
        balanceOf[_to] += _value;

        // emit the transfer event
        emit Transfer(_from, _to, _value);

        return true;
    }
}
