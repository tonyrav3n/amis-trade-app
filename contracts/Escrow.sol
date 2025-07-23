// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract P2PEscrow {
    enum EscrowStatus { Created, Accepted, Completed, Refunded }

    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        string item;
        string description;
        EscrowStatus status;
        uint256 createdAt;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCounter;

    event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount);
    event EscrowAccepted(uint256 indexed escrowId, address indexed seller);
    event EscrowCompleted(uint256 indexed escrowId, address indexed buyer);
    event EscrowRefunded(uint256 indexed escrowId, address indexed buyer);

    modifier onlyBuyer(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].buyer, "Only buyer can call this");
        _;
    }

    modifier onlySeller(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].seller, "Only seller can call this");
        _;
    }

    modifier validEscrow(uint256 _escrowId) {
        require(_escrowId < escrowCounter, "Escrow does not exist");
        _;
    }

    function createEscrow(
        address _seller,
        string memory _item,
        string memory _description
    ) external payable returns (uint256) {
        require(msg.value > 0, "Must send ETH");
        require(_seller != msg.sender, "Seller cannot be buyer");
        require(_seller != address(0), "Invalid seller address");

        uint256 escrowId = escrowCounter++;

        escrows[escrowId] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            item: _item,
            description: _description,
            status: EscrowStatus.Created,
            createdAt: block.timestamp
        });

        emit EscrowCreated(escrowId, msg.sender, _seller, msg.value);
        return escrowId;
    }

    function acceptEscrow(uint256 _escrowId)
        external
        onlySeller(_escrowId)
        validEscrow(_escrowId)
    {
        require(escrows[_escrowId].status == EscrowStatus.Created, "Escrow already processed");

        escrows[_escrowId].status = EscrowStatus.Accepted;
        emit EscrowAccepted(_escrowId, msg.sender);
    }

    function releaseFunds(uint256 _escrowId)
        external
        onlyBuyer(_escrowId)
        validEscrow(_escrowId)
    {
        require(escrows[_escrowId].status == EscrowStatus.Accepted, "Escrow not accepted yet");

        escrows[_escrowId].status = EscrowStatus.Completed;

        address payable seller = payable(escrows[_escrowId].seller);
        uint256 amount = escrows[_escrowId].amount;

        seller.transfer(amount);
        emit EscrowCompleted(_escrowId, msg.sender);
    }

    function refund(uint256 _escrowId)
        external
        onlyBuyer(_escrowId)
        validEscrow(_escrowId)
    {
        require(escrows[_escrowId].status == EscrowStatus.Created, "Cannot refund accepted escrow");

        escrows[_escrowId].status = EscrowStatus.Refunded;

        address payable buyer = payable(escrows[_escrowId].buyer);
        uint256 amount = escrows[_escrowId].amount;

        buyer.transfer(amount);
        emit EscrowRefunded(_escrowId, msg.sender);
    }

    function getEscrow(uint256 _escrowId)
        external
        view
        validEscrow(_escrowId)
        returns (
            address buyer,
            address seller,
            uint256 amount,
            string memory item,
            string memory description,
            EscrowStatus status,
            uint256 createdAt
        )
    {
        Escrow memory escrow = escrows[_escrowId];
        return (
            escrow.buyer,
            escrow.seller,
            escrow.amount,
            escrow.item,
            escrow.description,
            escrow.status,
            escrow.createdAt
        );
    }
}
