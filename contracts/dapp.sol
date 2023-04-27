pragma solidity ^0.5.0;

contract DApp {

    uint public numVideo = 0;
    string public dappName = "xFlicks";
    mapping(uint => VideoMetadata) public videos;

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

    constructor() public{
        // initialize ?
    }

    function uploadVideo(string memory _videoHash, string memory _title, 
                            string memory _description, bool memory _isPrivate, 
                            uint memory _fees, bool memory _isSubscription) public {
        
        require(bytes(_videoHash).length > 0);  // validate if video hash is not empty
        require(bytes(_title).length > 0);      // validate if video title exists
        require(msg.sender != address(0));      // validate if creator address exists

        numVideo ++;        // Increment the video count (should this be included in reintrancy locks)?

        videos[numVideo] = VideoMetadata(numVideo, _videoHash, _title, _description, _isPrivate, _fees, _isSubscription, msg.sender);   // Adding video to contract
        emit VideoUploadEvent(numVideo, _videoHash, _title, _description, _isPrivate, _fees, _isSubscription, msg.sender);  // Trigger upload video event

    }



}