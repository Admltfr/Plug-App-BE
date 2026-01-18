import BaseService from "../../common/base_classes/base-service.js";
import { getMeta, getPagination } from "../../utils/pagination.util.js";

class SubscriptionService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async createSubscription(data) {
    const {
      product_id,
      customer_id,
      store_id,
      warehouse_id,
      quantity,
      frequency_days,
    } = data;
    if (
      !product_id ||
      !customer_id ||
      !store_id ||
      !warehouse_id ||
      !quantity ||
      !frequency_days
    ) {
      throw this.error.badRequest("Missing required fields");
    }

    const product = await this.db.product.findUnique({
      where: { id: product_id },
      include: { seller: true },
    });
    if (!product) throw this.error.notFound("Product not found");

    const price_per_cycle = (product.price || 0) * quantity;
    const start_date = new Date();
    const next_delivery_date = new Date(
      start_date.getTime() + frequency_days * 24 * 3600 * 1000,
    );

    const created = await this.db.subscription.create({
      data: {
        product_id,
        customer_id,
        seller_id: product.seller_id,
        warehouse_id,
        store_id,
        quantity,
        frequency_days,
        status: "PENDING",
        price_per_cycle,
        start_date,
        next_delivery_date,
      },
    });
    return created;
  }

  async approveSubscription(subscriptionId, sellerId) {
    const subscription = await this.db.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) throw this.error.notFound("Subscription not found");

    if (subscription.seller_id !== sellerId)
      throw this.error.forbidden("Cannot approve others' subscription");

    const updated = await this.db.subscription.update({
      where: { id: subscriptionId },
      data: { status: "APPROVED" },
    });
    return updated;
  }

  async getSubscriptionByCustomerId(customerId) {
    const { page, limit, offset } = getPagination(customerId);

    const totalRow = await this.db.$queryRaw`
      SELECT COUNT(*)::int AS total FROM "subscriptions" WHERE customer_id = ${customerId}
    `;
    const total = totalRow?.[0]?.total || 0;

    const rows = await this.db.$queryRaw`
      SELECT s.*,
        p.name AS product_name,
        w.name AS warehouse_name,
        st.name AS store_name,
        ST_DistanceSphere(st.pinpoint::geometry, w.pinpoint::geometry) AS distance_meters
      FROM "subscriptions" s
      JOIN "products" p ON p.id = s.product_id
      JOIN "warehouses" w ON w.id = s.warehouse_id
      JOIN "stores" st ON st.id = s.store_id
      WHERE s.customer_id = ${customerId}
      ORDER BY s.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const data = rows.map((r) => ({
      id: r.id,
      product_id: r.product_id,
      product_name: r.product_name,
      seller_id: r.seller_id,
      warehouse_id: r.warehouse_id,
      warehouse_name: r.warehouse_name,
      store_id: r.store_id,
      store_name: r.store_name,
      quantity: r.quantity,
      frequency_days: r.frequency_days,
      status: r.status,
      price_per_cycle: Number(r.price_per_cycle),
      start_date: r.start_date,
      next_delivery_date: r.next_delivery_date,
      distance_km:
        r.distance_meters != null ? Number(r.distance_meters) / 1000 : null,
    }));
    const pagination = getMeta(total, page, limit);
    return { data, pagination };
  }

  async getSubscriptionBySellerId(sellerId) {
    const { page, limit, offset } = getPagination(sellerId);

    const totalRow = await this.db.$queryRaw`
      SELECT COUNT(*)::int AS total FROM "subscriptions" WHERE seller_id = ${sellerId}
    `;

    const total = totalRow?.[0]?.total || 0;

    const rows = await this.db.$queryRaw`
      SELECT s.*,
        p.name AS product_name,
        w.name AS warehouse_name,
        st.name AS store_name,
        ST_DistanceSphere(st.pinpoint::geometry, w.pinpoint::geometry) AS distance_meters
      FROM "subscriptions" s
      JOIN "products" p ON p.id = s.product_id
      JOIN "warehouses" w ON w.id = s.warehouse_id
      JOIN "stores" st ON st.id = s.store_id
      WHERE s.seller_id = ${sellerId}
      ORDER BY s.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const data = rows.map((r) => ({
      id: r.id,
      product_id: r.product_id,
      product_name: r.product_name,
      customer_id: r.customer_id,
      warehouse_name: r.warehouse_name,
      store_name: r.store_name,
      quantity: r.quantity,
      frequency_days: r.frequency_days,
      status: r.status,
      price_per_cycle: Number(r.price_per_cycle),
      start_date: r.start_date,
      next_delivery_date: r.next_delivery_date,
      distance_km:
        r.distance_meters != null ? Number(r.distance_meters) / 1000 : null,
    }));

    const pagination = getMeta(total, page, limit);

    return { data, pagination };
  }
}

export default new SubscriptionService();
