export type PaginationFilterParams = {
	page: number;
	pageSize: number;
	search?: string; // search by fts
	searchFields?: string; // name:abc, name:def
	orderBy?: string; // created_at:desc, created_at:asc
	filterBy?: string; // status:1, status:0
}