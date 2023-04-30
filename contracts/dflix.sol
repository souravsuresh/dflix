pragma solidity ^0.8.0;

contract DFlix {

    uint constant private SUBSCRIPTION_AMOUNT = 1;   // JUST FOR TESTING KEEPING AMOUNT LOW
    address public poolAddress;
    uint public poolFunds = 0;
    uint public numVideo = 0; 
    uint public numSubscribers = 0;
    uint public numPrivateVideo = 0;
    string public dappName = "dflix";
    mapping(uint => VideoMetadata) public videos;
    mapping(string => SubscriptionMetadata) public subscription;
    mapping(uint => PrivateVideoMetadata) public privateVideosMapping;

    struct VideoMetadata {
        uint id;                // index of video
        string _hash;            // IPFS hash of video to be stored
        string title;           // Title of the video
        string description;     // Description of the video
        bool isPrivate;         // Private video (allowing only set of users to view this)
        uint fees;              // If private how much is required to view the video (movies?)
        bool isSubscription;    // included in subscription (FUTURE?)
        address author;         // Creator's address
    }

    struct SubscriptionMetadata {
        string id;                // subscription id
        string endDate;          // end date
        string startDate;         // starting date
        address author;         // person buying subscription
        bool subscribed;        // to check if user has subscribed
    }

    struct PrivateVideoMetadata {
        uint id;                      // index
        uint videoId;                // private video id
        address author;              // address of the author
    }

    event VideoUploadEvent(
        uint id,
        string _hash,
        string title,
        string description,
        bool isPrivate,
        uint fees,
        bool isSubscription,
        address author
    );

    event SubscriptionEvent (
        string id,              
        string endDate,        
        string startDate,        
        address author,      
        bool subscribed       
    );

    event PrivateVideoEvent (
        uint id,                
        uint videoId,              
        address author
    );

    constructor(address _poolAddress) public {
        poolAddress = _poolAddress;
    }

    function uploadVideo(string memory _videoHash, string memory _title, 
                            string memory _description, bool _isPrivate, 
                            uint _fees, bool _isSubscription) public {
        
        require(bytes(_videoHash).length > 0);  // validate if video hash is not empty
        require(bytes(_title).length > 0);      // validate if video title exists
        require(msg.sender != address(0));      // validate if creator address exists

        numVideo ++;        // Increment the video count (should this be included in reintrancy locks)?

        videos[numVideo] = VideoMetadata(numVideo, _videoHash, _title, _description, _isPrivate, _fees, _isSubscription, msg.sender);   // Adding video to contract
        emit VideoUploadEvent(numVideo, _videoHash, _title, _description, _isPrivate, _fees, _isSubscription, msg.sender);  // Trigger upload video event

    }

    function buySubscription(string memory subscriptionId, string memory from, string memory to) public payable {
        require(subscription[subscriptionId].subscribed, "Oops system error!! Duplicate subscription id found");
        require(msg.sender != address(0));      // validate if creator address exists
        require((msg.sender.balance) > (uint(SUBSCRIPTION_AMOUNT)/1000));  // validate is user has sufficient balance
        
        (bool sent, bytes memory data) = poolAddress.call{value: uint(SUBSCRIPTION_AMOUNT)}("");
        require(sent, "Failed to send Ether");
        subscription[subscriptionId] = SubscriptionMetadata(subscriptionId, to, from, msg.sender, true);
        poolFunds += uint(SUBSCRIPTION_AMOUNT);
        emit SubscriptionEvent(subscriptionId, to, from, msg.sender, true);
    }

    function buyPrivateVideo(uint videoId) public payable {
        require(msg.sender != address(0));      // validate if creator address exists
        require(msg.sender.balance > videos[videoId].fees);  // validate is user has sufficient balance
        
        (bool sent, bytes memory data) = videos[videoId].author.call{value: videos[videoId].fees}("");
        require(sent, "Failed to send Ether");
        numPrivateVideo ++;
        privateVideosMapping[numPrivateVideo] = PrivateVideoMetadata(numPrivateVideo, videoId, msg.sender);
        emit PrivateVideoEvent(numPrivateVideo, videoId, msg.sender);
    }
}