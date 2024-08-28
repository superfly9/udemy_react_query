import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { deletePost, fetchPosts, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;
const minPostPage = 1;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", currentPage],
    queryFn: () => fetchPosts(currentPage),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePost,
  });

  if (deleteMutation.isSuccess) {
    // variables:  mutateFn애 넘겨진 데이터, submittedAt, isPending ,isSuccess, data
    console.log("[deleteMutation]:", deleteMutation);
  }

  const updateMutation = useMutation({
    mutationFn: updatePost,
  });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["post", currentPage],
      queryFn: () => fetchPosts(currentPage),
    });
  }, [currentPage, queryClient]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              updateMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage < minPostPage}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={currentPage > maxPostPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />
      )}
    </>
  );
}
