import * as React from 'react';
import Layout from '@/components/layout';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/fileUploader';
import { useUserAuth } from '@/context/userAuthContext';
import { collection, addDoc, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; 
import { useNavigate } from 'react-router-dom';
import { doc } from 'firebase/firestore';

interface IPostProps {}

const Post: React.FunctionComponent<IPostProps> = (props) => {
  const { user } = useUserAuth();
  const [uploadedFiles, setUploadedFiles] = React.useState<string[]>([]);

  const [post, setPost] = React.useState({
    caption: '',
    photos: [],
    likes: 0,
    userLikes: [],
    userId: '',
    date: Timestamp.now(),
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user is logged in
    if (!user) {
      alert('Please log in to create a post.');
      return;
    }

    // Create the post object
    const newPost = {
      ...post,
      photos: uploadedFiles, // URLs of uploaded photos
      userId: user.uid, // Assuming user.uid is the user identifier
      date: Timestamp.now(),
    };

    try {
      // Save the post to Firestore
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      console.log('Post added successfully:', newPost);

      // Update the user's document to include this post ID
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        posts: arrayUnion(docRef.id), // Add the post ID to the user's posts array
      });

      // Reset form after successful submission
      setPost({
        caption: '',
        photos: [],
        likes: 0,
        userLikes: [],
        userId: '',
        date: Timestamp.now(),
      });
      setUploadedFiles([]);

      // Redirect to home after posting
      navigate('/');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to create the post. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="border max-w-3xl w-full">
          <h3 className="bg-slate-800 text-white text-center text-lg p-2">Create Post</h3>
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <Label className="mb-4" htmlFor="caption">
                  Photo Caption
                </Label>
                <Textarea
                  className="mb-8"
                  id="caption"
                  placeholder="What's in your photo?"
                  value={post.caption}
                  onChange={(e) => setPost({ ...post, caption: e.target.value })}
                />

                <div className="flex flex-col">
                  <Label className="mb-4" htmlFor="photo">
                    Photos
                  </Label>
                  <FileUploader onUploadComplete={(urls) => setUploadedFiles(urls)} />
                </div>

                <Button className="mt-8 w-32" type="submit">
                  Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Post;
