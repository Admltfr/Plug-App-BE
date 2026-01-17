import BaseService from "../../common/base_classes/base-service.js";
import { getPagination, getMeta } from "../../utils/pagination.util.js";
import { ORMfilterable } from "../../utils/filter.util.js";

class ProductService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getProductById(id) {
    const data = await this.db.product.findUnique({
      where: { id },
      include: {
        seller: true,
      },
    });

    if (!data) {
      throw this.error.notFound("Product not found");
    }

    return data;
  }

  async getAllProduct(query) {
    const { page, limit, offset } = getPagination(query);
    const filter = ORMfilterable(query, ["seller_id", "name"]) || {};

    const q = (query.search || "").trim();
    if (q) {
      filter.name = { contains: q, mode: "insensitive" };
    }

    const total = await this.db.product.count({ where: filter });

    const data = await this.db.product.findMany({
      where: filter,
      include: {
        seller: { select: { id: true, name: true, email: true } },
      },
      skip: offset,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const pagination = getMeta(total, page, limit);
    return { data, pagination };
  }
}

export default new ProductService();
