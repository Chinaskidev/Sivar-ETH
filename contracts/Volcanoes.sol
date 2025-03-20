// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Volcanoes is ERC1155, Ownable {
    using Strings for uint256;

    string private baseURI;
    uint256 public constant MINT_PRICE = 0.005 ether;
    uint256 public constant MAX_SUPPLY_PER_TOKEN = 20; // Por ejemplo, 5 tokens * 20 = 100 en total

    mapping(uint256 => uint256) public tokenCurrentSupply;

    constructor(string memory _baseURI) ERC1155("") Ownable(msg.sender) {
        baseURI = _baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // Sobrescribe la función uri para concatenar el id en decimal con ".json"
    function uri(uint256 _id) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, _id.toString(), ".json"));
    }

    /// @notice Permite a cualquier usuario mintear un token pagando el precio establecido.
    /// Se exige que el token ID esté entre 1 y 5 y que no se exceda el supply máximo.
    function publicMint(uint256 id, uint256 amount, bytes memory data)
        public
        payable
    {
        require(id >= 1 && id <= 5, "El token id debe estar entre 1 y 5");
        require(msg.value == MINT_PRICE * amount, "ETH enviado incorrecto");
        require(tokenCurrentSupply[id] + amount <= MAX_SUPPLY_PER_TOKEN, "Supera el maximo supply para este token");

        tokenCurrentSupply[id] += amount;
        _mint(msg.sender, id, amount, data);
    }

    /// @notice Función para que el owner retire los fondos recaudados
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}