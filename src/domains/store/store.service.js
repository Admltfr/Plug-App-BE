import BaseService from "../../common/base_classes/base-service.js";
import { getPagination, getMeta } from "../../utils/pagination.util.js";
import crypto from "crypto";

class StoreService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async createStore(data) {
    const {
      customer_id,
      name,
      contact_name,
      contact_phone_number,
      address,
      lat,
      lng,
    } = data;
    if (
      !customer_id ||
      !name ||
      !contact_name ||
      !contact_phone_number ||
      !address ||
      lat == null ||
      lng == null
    ) {
      throw this.error.badRequest("Missing required fields");
    }
    const id = crypto.randomUUID();

    const created = await this.db.$executeRaw`
      INSERT INTO "stores" ("id","customer_id","name","contact_name","contact_phone_number","address","pinpoint","created_at","updated_at")
      VALUES (
        ${id},
        ${customer_id},
        ${name},
        ${contact_name},
        ${contact_phone_number},
        ${address},
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        NOW(),
        NOW()
      )
    `;
    return created;
  }

  async getStoresByCustomerId(customerId) {
    const { page, limit, offset } = getPagination(customerId);

    const totalRow = await this.db.$queryRaw`
      SELECT COUNT(*)::int AS total FROM "stores" WHERE customer_id = ${customerId}
    `;
    const total = totalRow?.[0]?.total || 0;

    const rows = await this.db.$queryRaw`
      SELECT
        id,
        customer_id,
        name, contact_name, contact_phone_number, address,
        ST_Y(pinpoint::geometry) AS lat,
        ST_X(pinpoint::geometry) AS lng,
        created_at, updated_at
      FROM "stores"
      WHERE customer_id = ${customerId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const data = rows.map((r) => ({
      ...r,
      lat: Number(r.lat),
      lng: Number(r.lng),
    }));
    const pagination = getMeta(total, page, limit);
    return { data, pagination };
  }

  async getStoreById(id) {
    const rows = await this.db.$queryRaw`
      SELECT
        id, customer_id, name, contact_name, contact_phone_number, address,
        ST_Y(pinpoint::geometry) AS lat,
        ST_X(pinpoint::geometry) AS lng,
        created_at, updated_at
      FROM "stores" WHERE id = ${id} LIMIT 1
    `;
    const data = rows?.[0];
    if (!data) throw this.error.notFound("Store not found");
    return { ...data, lat: Number(data.lat), lng: Number(data.lng) };
  }
}

export default new StoreService();
