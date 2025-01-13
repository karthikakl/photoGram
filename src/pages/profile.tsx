import Layout from "@/components/layout";
import { useUserAuth } from "@/context/userAuthContext";
import { DocumentResponse, ProfileResponse } from "@/types";
import defaultProfile from "@/assets/images/defaultProfile.png";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Edit2Icon, HeartIcon } from "lucide-react";
import { getPostByUserId } from "@/repository/postService";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@/repository/userServices";

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  // Initial state includes `posts` as part of ProfileResponse
  const initialUserInfo: ProfileResponse = {
    id: "",
    userId: user?.uid,
    userBio: "Please update your bio...",
    photoURL: user?.photoURL || "",
    displayName: user?.displayName || "Guest_user",
    posts: [], // Initialize posts as an empty array
  };

  const [userInfo, setUserInfo] = React.useState<ProfileResponse>(initialUserInfo);

  const getAllPost = async (id: string) => {
    try {
      const querySnapshot = await getPostByUserId(id);
      const tempArr: DocumentResponse[] = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Post Data:", data); // Log data to ensure the structure

          const responseObj: DocumentResponse = {
            id: doc.id,
            ...data,
          };
          tempArr.push(responseObj);
        });
        console.log("Fetched Posts: ", tempArr); // Debugging
        setUserInfo((prev) => ({
          ...prev,
          posts: tempArr,
        }));
      } else {
        console.log("No posts found");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getUserProfileInfo = async (userId: string) => {
    try {
      const data: ProfileResponse = (await getUserProfile(userId)) || {};
      console.log("User Profile Data: ", data); // Debugging
      if (data.displayName || data.posts) {
        setUserInfo((prev) => ({
          ...prev,
          ...data,
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  React.useEffect(() => {
    if (user?.uid) {
      getAllPost(user.uid);
      getUserProfileInfo(user.uid);
    }
  }, [user]);

  React.useEffect(() => {
    console.log("Updated userInfo.posts: ", userInfo.posts); // Debugging
  }, [userInfo.posts]);

  const editProfile = () => {
    navigate("/edit-profile", { state: userInfo });
  };

  const renderPosts = () => {
    return userInfo.posts?.map((item, index) => {
      console.log("Post item:", item); // Log to see if `photos` exists and is an array
      return (
        <div key={item.id || index} className="relative">
          <div className="absolute group transition-all duration-200 bg-transparent hover:bg-slate-950 hover:bg-opacity-75 top-0 bottom-0 left-0 right-0 w-full h-full">
            <div className="flex flex-col justify-center items-center w-full h-full">
              <HeartIcon className="hidden group-hover:block fill-white" />
              <div className="hidden group-hover:block text-white">
                {item.likes} likes
              </div>
            </div>
          </div>
          <div className="flex overflow-x-auto space-x-2">
            {item.photos?.map((photo, photoIndex) => (
              <img
                key={photoIndex}
                src={photo || defaultProfile} // Fallback to default image if photo is missing
                alt={`Post photo ${photoIndex + 1}`}
                className="w-full object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="border max-w-3xl w-full">
          <h3 className="bg-slate-800 text-white text-center text-lg p-2">
            Profile
          </h3>
          <div className="p-8 pb-4 border-b">
            <div className="flex flex-row items-center pb-2 mb-2">
              <div className="mr-2">
                <img
                  src={userInfo.photoURL || defaultProfile}
                  alt="avatar"
                  className="w-28 h-28 rounded-full border-2 border-slate-800 object-cover"
                />
              </div>
              <div>
                <div className="text-xl ml-3">
                  {userInfo.displayName || "Guest_user"}
                </div>
                <div className="text-xl ml-3">{user?.email || ""}</div>
              </div>
            </div>
            <div className="mb-4">{userInfo.userBio}</div>
            <div>
              <Button onClick={editProfile}>
                <Edit2Icon className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </div>

          <div className="p-8">
            <h2 className="mb-5">My Posts</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {userInfo.posts?.length ? renderPosts() : <div>No Posts Yet</div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
