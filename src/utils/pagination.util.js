const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const getMeta = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export { getPagination, getMeta };
