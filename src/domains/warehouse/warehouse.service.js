import BaseService from "../../common/base_classes/base-service.js";
import { getPagination, getMeta } from "../../utils/pagination.util.js";

class WarehouseService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getAllWarehouseBySellerId(sellerId) {
    const { page, limit, offset } = getPagination(sellerId);

    const totalRow = await this.db.$queryRaw`
      SELECT COUNT(*)::int AS total
      FROM "warehouses"
      WHERE seller_id = ${sellerId}
    `;
    const total = totalRow?.[0]?.total || 0;

    const rows = await this.db.$queryRaw`
      SELECT
        id,
        seller_id,
        name,
        contact_name,
        contact_phone_number,
        address,
        ST_Y(pinpoint::geometry) AS lat,
        ST_X(pinpoint::geometry) AS lng,
        created_at,
        updated_at
      FROM "warehouses"
      WHERE seller_id = ${sellerId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const data = rows.map((r) => ({
      ...r,
      lat: r.lat != null ? Number(r.lat) : null,
      lng: r.lng != null ? Number(r.lng) : null,
    }));

    const pagination = getMeta(total, page, limit);
    return { data, pagination };
  }

  async getWarehouseById(id) {
    const rows = await this.db.$queryRaw`
      SELECT
        id,
        seller_id,
        name,
        contact_name,
        contact_phone_number,
        address,
        ST_Y(pinpoint::geometry) AS lat,
        ST_X(pinpoint::geometry) AS lng,
        created_at,
        updated_at
      FROM "warehouses"
      WHERE id = ${id}
      LIMIT 1
    `;

    const data = rows?.[0];
    if (!data) {
      throw this.error.notFound("Warehouse not found");
    }

    return {
      ...data,
      lat: data.lat != null ? Number(data.lat) : null,
      lng: data.lng != null ? Number(data.lng) : null,
    };
  }
}

export default new WarehouseService();
