import { Posts } from "./Posts";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { lazy, useEffect } from "react";
import { Suspense } from "react";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => console.error(error),
    onSuccess: (data) => {
      console.log("queryCache", data);
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

function App() {
  const [showDevtools, setShowDevtools] = React.useState(false);

  useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);
  return (
    // provide React Query client to App
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Blog &apos;em Ipsum</h1>
        <Posts />
      </div>
      <ReactQueryDevtools />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
