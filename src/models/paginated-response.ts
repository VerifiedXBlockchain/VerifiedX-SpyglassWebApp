export class PaginatedResponse<T> {
  count: number;
  page: number;
  numPages: number;
  results: T[];

  constructor(count: number, page: number, numPages: number, results: T[]) {
    this.count = count;
    this.page = page;
    this.numPages = numPages;
    this.results = results;
  }
}
