import { useParams } from 'react-router';

export const Post = () => {
  const { postId } = useParams();

  return (
    <div>
      <h1>Post</h1>
      <p>This is the Post page.</p>
      <p>Post ID: {postId}</p>
    </div>
  );
};
