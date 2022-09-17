export default async (count, limit, page) => {
    const excess = count % limit;
    const maxPage = (count - excess) / limit + (excess > 0 ? 1 : 0);
    const offset = limit * (page - 1);

    return {
        maxPage,
        offset
    }
}