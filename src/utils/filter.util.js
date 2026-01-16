const ORMfilterable = (query, fields) => {
  const filter = {};
  for (const field of fields) {
    if (query[field]) {
      filter[field] = { contains: query[field], mode: "insensitive" };
    }
  }
  return filter;
};

const SQLfilterable = (query, fields) => {
  const filters = [];
  for (const field of fields) {
    if (query[field]) {
      filters.push(`${field} ILIKE '%${query[field]}%'`);
    }
  }

  const filter = filters.length > 0 ? filters.join(" AND ") : "1=1";

  return filter;
};

export { ORMfilterable, SQLfilterable };
