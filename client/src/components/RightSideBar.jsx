import {React, useState, useEffect} from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSideBar = () => {

  const {selectedUser, messages} = useContext(ChatContext);
  const {logout, onlineUsers} = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // Get all the images from the messages and set them to state
  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])

  return selectedUser && (
    <div className={`bg-[#8185B]/10 text-white w-full relative overflow-y-scroll
            ${selectedUser ? 'max-md:hidden' : ""}`}>

      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img src={selectedUser?.profilePic || assets.avatar_icon}
          className="w-20 aspect-[1/1] rounded-full"/>
        <div className="flex items-center gap-2 px-10 text-xl font-medium mx-auto">
          <span>{selectedUser.fullName}</span>
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              onlineUsers.map(String).includes(String(selectedUser._id))
                ? "bg-green-500"
                : "bg-gray-500"
            }`}
          ></span>
        </div>
        <p className="px-10 mx-auto text-base text-center">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4"/>

      <div>
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2
          gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div key={index} onClick={() => window.open(url)}
              className='cursor-pointer rounded'>
              <img src={url} alt="" className="h-full rounded-md"/>
            </div>
          ))}
        </div>
      </div>
      {/* logout bar */}
      <button 
      onClick={() => logout()}
      className='absolute bottom-5 left-1/2 transform -translate-x-1/2
        bg-gradient-to-r from-purple-500 to-violet-500 text-white border-none
        text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
        Logout
      </button>

    </div>
  )
}

export default RightSideBar
