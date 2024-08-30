import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, Suspense } from "react";

import { fetchComments, fetchPosts } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;
const minPostPage = 1;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", currentPage],
    queryFn: () => fetchPosts(currentPage + 1),
    staleTime: 2000,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["post", currentPage + 1],
      queryFn: () => fetchPosts(currentPage + 2),
      staleTime: 5000,
    });
  }, [currentPage, queryClient]);

  useEffect(() => {
    console.log("prefetching for Detail");
    if (data) {
      data.map((post) => {
        queryClient.prefetchQuery({
          queryKey: ["detail", post.id],
          queryFn: () => fetchComments(post.id),
          staleTime: 1000 * 60 * 60,
        });
      });
    }
  }, [data, queryClient]);

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
            onClick={() => setSelectedPost(post)}
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
        <Suspense
          fallback={
            <div style={{ backgroundColor: "#fff", width: "100dvh" }}>
              Use Suspense Query Loading...
            </div>
          }
        >
          <PostDetail post={selectedPost} />
        </Suspense>
      )}
    </>
  );
}
