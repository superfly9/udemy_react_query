# udemy-REACT-QUERY

- isLoading: no cached 데이터 api 호출시 완료 여부를 나타냄
- isFetching: api call이 완료되지 않았을때 true
- isLoading은 isFetching의 부분지합

- staleTime: ms가 기본단위 / 트리거 발생시 데이터가 refetch 가능해질때까지의 최소 시간
- 이 안에 데이터 요청시 리액트 쿼리 캐시에서 가져옴, 네트워크 탭도 깨끗
- gcTime: cache에서 데이터 날라가는 시간

new QueryClient()

- queryCache : 하나의 중앙화된 에러 / 성공시 핸들러 처리 가능
- defaultOptions : queris : { refetchOnWindowFocus, staleTime }
