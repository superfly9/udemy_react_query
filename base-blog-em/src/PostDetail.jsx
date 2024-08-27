import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchComments, updatePost } from "./api";
import "./PostDetail.css";

export function PostDetail({ post }) {
  const { data, isLoading } = useQuery({
    queryKey: ["detail", post.id],
    queryFn: () => fetchComments(post.id),
  });

  const {
    data: mutateData,
    mutate,
    isSuccess,
    submittedAt,
  } = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  if (isSuccess) {
    console.log("[submittedAt]:", submittedAt);
    console.log("mutation success", mutateData);
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!data) {
    return <>Detail...</>;
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button>{" "}
      <button
        onClick={() =>
          mutate(post.id, {
            onSuccess: (result) => {
              console.log("[onSuccess]", result);
            },
          })
        }
      >
        Update title
      </button>
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
