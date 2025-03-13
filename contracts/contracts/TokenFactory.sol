// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract TokenFactory is Ownable {
    event TokenCreated(address token);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createToken(
        string memory name,
        string memory symbol
    ) external onlyOwner {
        Token token = new Token(name, symbol, msg.sender);
        emit TokenCreated(address(token));
    }
}
