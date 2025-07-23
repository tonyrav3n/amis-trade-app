// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract P2PEscrow {
    enum EscrowStatus { Created, Accepted, Funded, Delivered, Completed, Refunded }

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
    event EscrowFunded(uint256 indexed escrowId, address indexed buyer, uint256 amount);
    event EscrowDelivered(uint256 indexed escrowId, address indexed seller);
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
        uint256 _amount,
        string memory _item,
        string memory _description
    ) external returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_seller != msg.sender, "Seller cannot be buyer");
        require(_seller != address(0), "Invalid seller address");

        uint256 escrowId = escrowCounter++;

        escrows[escrowId] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            item: _item,
            description: _description,
            status: EscrowStatus.Created,
            createdAt: block.timestamp
        });

        emit EscrowCreated(escrowId, msg.sender, _seller, _amount);
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

    function fundEscrow(uint256 _escrowId)
        external
        payable
        onlyBuyer(_escrowId)
        validEscrow(_escrowId)
    {
        require(escrows[_escrowId].status == EscrowStatus.Accepted, "Escrow must be accepted first");
        require(msg.value == escrows[_escrowId].amount, "Must send exact escrow amount");

        escrows[_escrowId].status = EscrowStatus.Funded;
        emit EscrowFunded(_escrowId, msg.sender, msg.value);
    }

    function markAsDelivered(uint256 _escrowId)
        external
        onlySeller(_escrowId)
        validEscrow(_escrowId)
    {
        require(escrows[_escrowId].status == EscrowStatus.Funded, "Escrow must be funded first");

        escrows[_escrowId].status = EscrowStatus.Delivered;
        emit EscrowDelivered(_escrowId, msg.sender);
    }

    function releaseFunds(uint256 _escrowId)
        external
        onlyBuyer(_escrowId)
        validEscrow(_escrowId)
    {
        require(escrows[_escrowId].status == EscrowStatus.Delivered, "Item must be delivered first");

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
        require(
            escrows[_escrowId].status == EscrowStatus.Created ||
            escrows[_escrowId].status == EscrowStatus.Funded,
            "Cannot refund this escrow"
        );

        escrows[_escrowId].status = EscrowStatus.Refunded;

        // Only refund if escrow was funded
        if (escrows[_escrowId].status == EscrowStatus.Funded) {
            address payable buyer = payable(escrows[_escrowId].buyer);
            uint256 amount = escrows[_escrowId].amount;
            buyer.transfer(amount);
        }

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
