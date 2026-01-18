import BaseSeeder from "../../common/base_classes/base-seeder.js";

class ProductSeeder extends BaseSeeder {
  constructor() {
    super();
  }
  async seed() {
    const sellers = await this.db.seller.findMany({ take: 2 });
    if (sellers.length < 2) {
      this.log.error("Need at least 2 sellers to seed products.");
      process.exit(1);
    }
    const warehouses = await this.db.warehouse.findMany({ take: 2 });
    if (warehouses.length < 2) {
      this.log.error("Need at least 2 warehouses to seed products.");
      process.exit(1);
    }
    const [s1, s2] = sellers;
    const [w1, w2] = warehouses;
    const products = [
      {
        name: "Widget Pro",
        description: "High quality widget.",
        price: 199000,
        stock: 10,
        image_url: "widget-pro.png",
        seller_id: s1.id,
        warehouse_id: w1.id,
      },
      {
        name: "Gadget Max",
        description: "Top-notch gadget.",
        price: 299000,
        stock: 10,
        image_url: "gadget-max.png",
        seller_id: s1.id,
        warehouse_id: w1.id,
      },
      {
        name: "Tool Lite",
        description: "Handy daily tool.",
        price: 99000,
        stock: 10,
        image_url: "tool-lite.png",
        seller_id: s2.id,
        warehouse_id: w2.id,
      },
      {
        name: "Device Air",
        description: "Lightweight device.",
        price: 149000,
        stock: 10,
        image_url: "device-air.png",
        seller_id: s2.id,
        warehouse_id: w2.id,
      },
    ];
    for (const p of products) {
      const exists = await this.db.product.findFirst({
        where: {
          name: p.name,
          seller_id: p.seller_id,
          warehouse_id: p.warehouse_id,
        },
      });
      if (exists) {
        this.log.warn(`Product exists: ${p.name}`);
        continue;
      }
      await this.db.product.create({ data: p });
      this.log.info(`Product seeded: ${p.name}`);
    }
  }
}
BaseSeeder.run(async function ProductSeed() {
  await new ProductSeeder().seed();
});
