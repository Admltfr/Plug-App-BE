import BaseSeeder from "../../common/base_classes/base-seeder.js";
import crypto from "crypto";

class StoreSeeder extends BaseSeeder {
  constructor() {
    super();
  }

  async seed() {
    const customers = await this.db.customer.findMany({ take: 2 });
    if (customers.length < 2) {
      this.log.error("Need at least 2 customers to seed stores.");
      process.exit(1);
    }
    const [c1, c2] = customers;

    const stores = [
      {
        customer_id: c1.id,
        name: "Main Store",
        contact_name: "Budi",
        contact_phone_number: "081234567800",
        address: "Jl. Merdeka No.10, Bandung",
        lat: -6.914744,
        lng: 107.60981,
      },
      {
        customer_id: c2.id,
        name: "Secondary Store",
        contact_name: "Sari",
        contact_phone_number: "081234567801",
        address: "Jl. Asia Afrika No.1, Bandung",
        lat: -6.921851,
        lng: 107.607498,
      },
    ];

    for (const s of stores) {
      const exists = await this.db.store.findFirst({
        where: { name: s.name, customer_id: s.customer_id },
      });
      if (exists) {
        this.log.warn(`Store exists: ${s.name}`);
        continue;
      }

      const id = crypto.randomUUID();
      await this.db.$executeRaw`
        INSERT INTO "stores"
          ("id","customer_id","name","contact_name","contact_phone_number","address","pinpoint","created_at","updated_at")
        VALUES
          (
            ${id},
            ${s.customer_id},
            ${s.name},
            ${s.contact_name},
            ${s.contact_phone_number},
            ${s.address},
            ST_SetSRID(ST_MakePoint(${s.lng}, ${s.lat}), 4326)::geography,
            NOW(),
            NOW()
          )
      `;

      this.log.info(`Store seeded: ${s.name}`);
    }
  }
}

BaseSeeder.run(async function StoreSeed() {
  await new StoreSeeder().seed();
});
