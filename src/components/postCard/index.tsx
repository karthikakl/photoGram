import * as React from 'react';
import { DocumentResponse } from '@/types';
import { useUserAuth } from '@/context/userAuthContext';
import profile1 from '@/assets/images/profile1.jpg';
import { updateLikesOnPost } from '@/repository/postService';
import HeartIcon from '@/components/ui/heart';

interface IPostCardProps {
  data: DocumentResponse;
}

const PostCard: React.FunctionComponent<IPostCardProps> = ({ data }) => {
  const { user } = useUserAuth();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [likesInfo, setLikesInfo] = React.useState({
    likes: data.likes ?? 0,
    isLike: data.userlikes?.includes(user?.uid ?? '') || false,
  });

  // Handle like/unlike toggle
  const updateLike = async (isVal: boolean) => {
    setLikesInfo({
      likes: isVal ? likesInfo.likes + 1 : likesInfo.likes - 1,
      isLike: !likesInfo.isLike,
    });

    if (isVal) {
      data.userlikes?.push(user!.uid); // Add user ID to the likes list
    } else {
      data.userlikes?.splice(data.userlikes.indexOf(user!.uid), 1); // Remove user ID from the likes list
    }

    try {
      if (data.id) {
        // Call the updateLikesOnPost API to update the likes and userlikes in the database
        await updateLikesOnPost(data.id!, data.userlikes!, isVal ? likesInfo.likes + 1 : likesInfo.likes - 1);
      } else {
        console.error('Post ID is undefined');
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  // Render photos (same as your current implementation)
  const renderPhotos = () => {
    if (data.photos) {
      return (
        <img
          src={data.photos}
          className="w-full h-auto object-contain rounded-lg mb-4"
          alt="Post image"
        />
      );
    }

    if (data.photos && data.photos.length > 1) {
      const currentPhoto = data.photos[currentIndex];
      return (
        <div className="relative">
          <img
            src={currentPhoto}
            className="w-full h-auto object-contain rounded-lg mb-4"
            alt={`Post image ${currentIndex + 1}`}
          />
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer text-white text-2xl">
            <span
              onClick={() =>
                setCurrentIndex((prev) => (prev === data.photos.length - 1 ? 0 : prev + 1))
              }
            >
              &gt;
            </span>
          </div>
        </div>
      );
    }

    if (data.photos && data.photos.length === 1) {
      return (
        <img
          src={data.photos[0]}
          className="w-full h-auto object-contain rounded-lg mb-4"
          alt="Post image"
        />
      );
    }

    return <div>No photos available</div>;
  };

  return (
    <div className="mb-6 flex flex-col p-4 border border-gray-300 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img
          src={profile1}
          className="w-12 h-12 rounded-full border-2 border-gray-800 object-cover"
          alt="User profile"
        />
        <span className="ml-3 text-sm font-semibold">Guest_user</span>
      </div>

      <div className="flex justify-center mb-4">
        {renderPhotos()}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <HeartIcon
            isLiked={likesInfo.isLike} // Use the isLike state to toggle the heart icon
            onClick={() => updateLike(!likesInfo.isLike)} // Toggle like/unlike when clicked
          />
          <span>{likesInfo.likes} Likes</span> {/* Render updated likes count */}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg text-gray-500">💬</span>
          <span> Comments</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm font-semibold">{data.username || 'Guest User___'}</span>
        <div className="text-sm text-gray-700">{data.caption}</div>
      </div>
      <span>Add a comment....</span>
    </div>
  );
};

export default PostCard;
