import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  const { data, isLoading } = useQuery({
    queryKey: ["detail", post.id],
    queryFn: () => fetchComments(post.id),
  });

  if (deleteMutation.isSuccess) {
    // variables:  mutateFn애 넘겨진 데이터, submittedAt, isPending ,isSuccess, data
    console.log("[deleteMutation]:", deleteMutation);
  }

  const {
    data: mutateData,
    mutate,
    isPending,
    isSuccess,
    submittedAt,
  } = updateMutation;

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
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isPending && (
        <p style={{ color: "red" }}>Delete Pending</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>Delete Success</p>
      )}
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
      {isPending && <p style={{ color: "yellow" }}>Update Pending</p>}
      {isSuccess && <p style={{ color: "navy" }}>Update Success</p>}
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
