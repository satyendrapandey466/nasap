const DEFAULT_PAGE_VALUE = 1;
const DEFAULT_LIMIT_VALUE = 0;
function getPagination(query){
  const currlimit  = Math.abs(query.limit)||DEFAULT_LIMIT_VALUE;
  const currpage = Math.abs(query.page)||DEFAULT_PAGE_VALUE;
  const skip = (currpage-1)*currlimit;
  return {skip,limit:currlimit};
}
export {
  getPagination
}