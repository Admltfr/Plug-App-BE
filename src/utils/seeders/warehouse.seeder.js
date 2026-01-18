import BaseSeeder from "../../common/base_classes/base-seeder.js";
import crypto from "node:crypto";

class WarehouseSeeder extends BaseSeeder {
  constructor() {
    super();
  }

  async seed() {
    const sellers = await this.db.seller.findMany({ take: 2 });
    if (sellers.length < 2) {
      this.log.error("Need at least 2 sellers to seed warehouses.");
      process.exit(1);
    }
    const [s1, s2] = sellers;

    const warehouses = [
      {
        seller_id: s1.id,
        name: "Main Warehouse",
        contact_name: "Adam",
        contact_phone_number: "081234567890",
        address: "Telkom University, Jl. Telekomunikasi No.1, Bandung",
        lat: -6.973379,
        lng: 107.63041,
      },
      {
        seller_id: s2.id,
        name: "Secondary Warehouse",
        contact_name: "Lutfi",
        contact_phone_number: "081234567891",
        address: "Telkom University, Jl. Telekomunikasi No.1, Bandung",
        lat: -6.973379,
        lng: 107.63041,
      },
    ];

    for (const w of warehouses) {
      const exists = await this.db.warehouse.findFirst({
        where: { name: w.name, seller_id: w.seller_id },
      });
      if (exists) {
        this.log.warn(`Warehouse exists: ${w.name}`);
        continue;
      }

      const id = crypto.randomUUID();
      await this.db.$executeRaw`
        INSERT INTO "warehouses"
          ("id","seller_id","name","contact_name","contact_phone_number","address","pinpoint","created_at","updated_at")
        VALUES
          (
            ${id},
            ${w.seller_id},
            ${w.name},
            ${w.contact_name},
            ${w.contact_phone_number},
            ${w.address},
            ST_SetSRID(ST_MakePoint(${w.lng}, ${w.lat}), 4326)::geography,
            NOW(),
            NOW()
          )
      `;

      this.log.info(`Warehouse seeded: ${w.name}`);
    }
  }
}

BaseSeeder.run(async function WarehouseSeed() {
  await new WarehouseSeeder().seed();
});
