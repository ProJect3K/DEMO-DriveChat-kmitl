import { useState, useEffect } from 'react';

const ChatRoom = ({
  room,
  setRoom,
  activeUsers = [],
  roomCapacity,
  username,
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  nextStation = "ped pong",
  currentStatus = "Driving",
}) => {
  const [pedPongTimer, setPedPongTimer] = useState(30); // 3 minutes for Ped Pong stay
  const [routeTimer, setRouteTimer] = useState(30); // 3 minutes for regular route
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [localNextStation, setLocalNextStation] = useState(nextStation);
  const [previousRoom, setPreviousRoom] = useState("");
  const [isInPedPong, setIsInPedPong] = useState(false);

  const getAlignmentClass = (isSystemMessage, username, sender) => {
    if (isSystemMessage) {
      return 'items-center';
    } else if (username === sender) {
      return 'items-end';
    } else {
      return 'items-start';
    }
  };

  // Handle initial room setup and timers
  useEffect(() => {
    if (room === 'ped_pong' && !isInPedPong) {
      setIsInPedPong(true);
      setPreviousRoom(prevRoom => prevRoom || room);
      setPedPongTimer(30); // Reset Ped Pong timer
    } else if (room !== 'ped_pong' && !isInPedPong) {
      setRouteTimer(30); // Reset route timer when entering a new regular room
    }
  }, [room]);

  // Handle route timer (countdown before moving to Ped Pong)
  useEffect(() => {
    let timer;
    if (!isInPedPong && room !== 'duck_pond' && routeTimer > 0) {
      timer = setInterval(() => {
        setRouteTimer(prev => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            // Store current room and move to Ped Pong
            setPreviousRoom(room);
            setRoom('ped_pong');
            setIsInPedPong(true);
            setPedPongTimer(30); // Reset Ped Pong timer
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isInPedPong, routeTimer, room, setRoom]);

  // Handle Ped Pong timer (countdown before returning)
  useEffect(() => {
    let timer;
    if (isInPedPong && pedPongTimer > 0) {
      timer = setInterval(() => {
        setPedPongTimer(prev => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            // Return to previous room
            if (previousRoom) {
              setIsInPedPong(false);
              setLocalStatus("Returning to route");
              setLocalNextStation(previousRoom);
              setRoom(previousRoom);
              setRouteTimer(30); // Reset route timer
              if (sendMessage) {
                sendMessage("/return");
              }
            }
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isInPedPong, pedPongTimer, previousRoom, setRoom]);

  // Handle status updates
  useEffect(() => {
    if (room === 'ped_pong') {
      setLocalStatus("At Ped Pong");
      setLocalNextStation(previousRoom || "Return to route");
    } else if (previousRoom && room === previousRoom) {
      setLocalStatus("On route");
      setLocalNextStation("Ped Pong");
    }
  }, [room, previousRoom]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRoomDisplayName = () => {
    if (room === 'ped_pong') return 'Ped Pong';
    if (room === 'duck_pond') return 'Duck Pond';
    const parts = room.split('_');
    if (parts.length > 2) {
      const transportType = parts[0];
      const displayName = parts.slice(2).join('_');
      return `${transportType} - ${displayName}`;
    }
    return room;
  };

  const activeUserCount = Array.isArray(activeUsers) ? activeUsers.length : 0;

  return (
    <div className="relative min-h-screen bg-[#6D81A9] p-4">
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-4 bg-white rounded-lg p-4 shadow-sm">
        <div className="space-y-1">
          <div className="text-lg font-semibold">Next Station: {localNextStation}</div>
          <div className="text-lg">Current Status: {localStatus}</div>
        </div>
        <div className="text-right space-y-1">
          {!isInPedPong && room !== 'duck_pond' && (
            <div className="text-lg font-semibold text-blue-600">
              Time to Ped Pong: {formatTime(routeTimer)}
            </div>
          )}
          {isInPedPong && (
            <div className="text-lg font-semibold text-green-600">
              Return to route in: {formatTime(pedPongTimer)}
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Video */}
        <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 flex-grow-0 basis-2/3">
          <video src="/videos/duck.mp4" autoPlay loop className="h-full w-full"/>
        </div>
        
        {/* Chat */}
        <div className="w-1/2 bg-[#E4E9F3] rounded-lg shadow-lg p-4 flex flex-col flex-grow-0 basis-1/3">
          <div className="border-b pb-2 mb-4">
            <h2 className="text-xl font-bold">Room: {getRoomDisplayName()}</h2>
            <div className="text-sm text-gray-600">
              Users: {activeUserCount}/{roomCapacity}
            </div>
          </div>
        
          <div className="flex-1 overflow-y-auto mb-4 px-4 space-y-4">
            {messages.map((msg, index) => {
              const isSystemMessage = msg.startsWith("System:");
              const messageParts = isSystemMessage ? 
                ["System", msg.substring(7)] : 
                msg.split(":");
              const sender = messageParts[0];
              const content = messageParts.slice(1).join(":");

              if (content.trim().startsWith("ROOM_CHANGE:")) {
                return null;
              }

              return (
                <div 
                  key={index} 
                  className={`flex flex-col ${getAlignmentClass(isSystemMessage, username, sender)}`}
                >
                  {!isSystemMessage && (
                    <div className="text-xs text-gray-600 mb-1 px-2">
                      {sender}
                    </div>
                  )}
                  <div className={`rounded-lg p-3 max-w-[80%] break-words
                    ${isSystemMessage 
                      ? 'bg-gray-100 text-gray-600 text-center w-full text-xs' 
                      : 'bg-blue-300'}`}
                  >
                    {content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#D9D9D9]"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-500 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Leave Chat
      </button>
    </div>
  );
};

export default ChatRoom;