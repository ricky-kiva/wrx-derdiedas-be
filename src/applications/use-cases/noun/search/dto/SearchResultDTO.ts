export default interface SearchResultDTO<T> {
  item: T;
  score?: number;
}
