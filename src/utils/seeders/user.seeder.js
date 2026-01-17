import BaseSeeder from "../../common/base_classes/base-seeder.js";
import { hashPassword } from "../auth.util.js";

class UserSeeder extends BaseSeeder {
  constructor() {
    super();
  }
  async seed() {
    const sellers = [
      {
        name: "Seller One",
        email: "seller1@example.com",
        password: "Seller123!",
      },
      {
        name: "Seller Two",
        email: "seller2@example.com",
        password: "Seller123!",
      },
    ];
    const customers = [
      {
        name: "Customer One",
        email: "customer1@example.com",
        password: "Customer123!",
      },
      {
        name: "Customer Two",
        email: "customer2@example.com",
        password: "Customer123!",
      },
    ];

    for (const s of sellers) {
      const exists = await this.db.seller.findUnique({
        where: { email: s.email },
      });
      if (exists) {
        this.log.warn(`Seller exists: ${s.email}`);
        continue;
      }
      await this.db.seller.create({
        data: { ...s, password: await hashPassword(s.password) },
      });
      this.log.info(`Seller seeded: ${s.email}`);
    }

    for (const c of customers) {
      const exists = await this.db.customer.findUnique({
        where: { email: c.email },
      });
      if (exists) {
        this.log.warn(`Customer exists: ${c.email}`);
        continue;
      }
      await this.db.customer.create({
        data: { ...c, password: await hashPassword(c.password) },
      });
      this.log.info(`Customer seeded: ${c.email}`);
    }
  }
}
BaseSeeder.run(async function UserSeed() {
  await new UserSeeder().seed();
});
