import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post }) {
  const { data, isLoading } = useQuery({
    queryKey: ["detail", post.id],
    queryFn: () => fetchComments(post.id),
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!data) {
    return <>Detail...</>;
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
