import { Person } from "./Person";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useEffect } from "react";

const initialUrl = "https://swapi.dev/api/people/?page=1";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const INFINITE_QUERY_KEY = {
  PEOPLE: "PEOPLE",
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [INFINITE_QUERY_KEY.PEOPLE],
    queryFn: ({ pageParam }) => {
      console.log("[pageParam]:", pageParam);
      return fetchUrl(pageParam);
    },
    staleTime: 60 * 1000 * 500,
    initialPageParam: initialUrl,
    getNextPageParam: (lastPage) => {
      console.log("[lastPage]:", lastPage);
      return lastPage.next ?? undefined;
    },
  });

  const target = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log("[Intersecting]");
        fetchNextPage();
      }
    });

    observer.observe(target.current);

    return () => observer.disconnect();
  }, [fetchNextPage]);

  console.log("[data]:", data, status);

  return (
    <>
      {status === "success" &&
        data.pages.map((pageData) => {
          return pageData.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hairColor}
              eyeColor={person.eyeColor}
            />
          ));
        })}
      <button ref={target} onClick={fetchNextPage}>
        Load More
      </button>
    </>
  );
}
