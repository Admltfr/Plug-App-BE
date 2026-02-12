import BaseSeeder from "../../common/base_classes/base-seeder.js";
import { hashPassword } from "../auth.util.js";

class UserSeeder extends BaseSeeder {
  constructor() {
    super();
  }
  async seed() {
    const lenders = [
      {
        name: "Lender One",
        email: "lender1@example.com",
        password: "Lender123!",
      },
      {
        name: "Lender Two",
        email: "lender2@example.com",
        password: "Lender123!",
      },
    ];
    const borrowers = [
      {
        name: "Borrower One",
        email: "borrower1@example.com",
        password: "Borrower123!",
      },
      {
        name: "borrower Two",
        email: "borrower2@example.com",
        password: "Borrower123!",
      },
    ];

    for (const l of lenders) {
      const exists = await this.db.lender.findUnique({
        where: { email: l.email },
      });

      if (exists) {
        this.log.warn(`Seller exists: ${l.email}`);
        continue;
      }
      await this.db.lender.create({
        data: { ...l, password: await hashPassword(l.password) },
      });
      this.log.info(`Lender seeded: ${l.email}`);
    }

    for (const b of borrowers) {
      const exists = await this.db.borrower.findUnique({
        where: { email: b.email },
      });
      if (exists) {
        this.log.warn(`Borrower exists: ${b.email}`);
        continue;
      }
      await this.db.borrower.create({
        data: { ...b, password: await hashPassword(b.password) },
      });
      this.log.info(`Borrower seeded: ${b.email}`);
    }
  }
}
BaseSeeder.run(async function UserSeed() {
  await new UserSeeder().seed();
});
