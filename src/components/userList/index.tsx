import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useUserAuth } from "@/context/userAuthContext"; // import your user auth context

interface IUser {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

const UserList: React.FunctionComponent = () => {
  const { user } = useUserAuth(); // Get the currently authenticated user from context
  const [users, setUsers] = useState<IUser[]>([]); // State to hold users
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        try {
          // Fetch all users from the Firestore "users" collection
          const userQuery = collection(db, "users");
          const querySnapshot = await getDocs(userQuery);
          const allUsers: IUser[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Check if necessary fields are present in the data
            const userData: IUser = {
              id: doc.id,
              name: data.name || "Unknown", // Default to "Unknown" if name is missing
              email: data.email || "No email provided", // Default if email is missing
              photoURL: data.photoURL || "default-photo-url.jpg", // Default if photoURL is missing
            };
            allUsers.push(userData);
          });

          // Filter out the currently authenticated user from the list
          const filteredUsers = allUsers.filter((userItem) => userItem.id !== user.uid);
          setUsers(filteredUsers); // Set users in state

          // Log the list of displayed users
          console.log("Fetched users:", filteredUsers); // Console log the filtered users
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [user]); // Re-fetch when the user state changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800 text-white p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <img
                src={user.photoURL}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p>{user.name}</p>
                <small>{user.email}</small>
              </div>
            </div>
            <button className="px-4 py-2 rounded bg-blue-500">Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
