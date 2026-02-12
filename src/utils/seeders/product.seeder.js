import BaseSeeder from "../../common/base_classes/base-seeder.js";

class ProductSeeder extends BaseSeeder {
  constructor() {
    super();
  }
  async seed() {
    const lenders = await this.db.lender.findMany({ take: 2 });
    if (lenders.length < 2) {
      this.log.error("Need at least 2 lenders to seed products.");
      process.exit(1);
    }
    const [l1, l2] = lenders;
    const products = [
      {
        name: "Widget Pro",
        description: "High quality widget.",
        price: 199000,
        stock: 10,
        image_url: "widget-pro.png",
        lender_id: l1.id,
      },
      {
        name: "Gadget Max",
        description: "Top-notch gadget.",
        price: 299000,
        stock: 10,
        image_url: "gadget-max.png",
        lender_id: l1.id,
      },
      {
        name: "Tool Lite",
        description: "Handy daily tool.",
        price: 99000,
        stock: 10,
        image_url: "tool-lite.png",
        lender_id: l2.id,
      },
      {
        name: "Device Air",
        description: "Lightweight device.",
        price: 149000,
        stock: 10,
        image_url: "device-air.png",
        lender_id: l2.id,
      },
    ];
    for (const p of products) {
      const exists = await this.db.product.findFirst({
        where: {
          name: p.name,
          lender_id: p.lender_id,
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
