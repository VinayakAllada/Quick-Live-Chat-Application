import React from 'react';
import { PiUserCircle } from 'react-icons/pi';
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, imageUrl, width, height }) => {
    const onlineUser = useSelector(state => state?.user?.onlineUser);
    let avatarName = "";
    
    if (name) {
        const splitName = name.split(" ");
        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0];
        }
    }

    const bgColor = [
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200',
        'bg-blue-200',
        'bg-violet-200',
        'bg-pink-200',
        'bg-gray-200',
        'bg-cyan-200',
        'bg-sky-200',
    ];

    const randomNumber = Math.floor(Math.random() * bgColor.length);
    const isOnline = onlineUser.includes(userId);

    return (
        <div
            className={`relative rounded-full overflow-hidden ${isOnline ? 'border-2 border-green-500' : ''}`}
            style={{ width: width + 'px', height: height + 'px' }}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-full"
                />
            ) : (
                name ? (
                    <div
                        className={`w-full h-full flex items-center justify-center text-lg font-bold ${bgColor[randomNumber]}`}
                    >
                        {avatarName}
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <PiUserCircle size={width} />
                    </div>
                )
            )}
            {isOnline && (
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            )}
        </div>
    );
};

export default Avatar;
