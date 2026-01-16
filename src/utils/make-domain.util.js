import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import capitalize from "capitalize";
import logger from "./logger.util.js";

const ROOT = process.cwd();

program
  .command("make:domain <name>")
  .description(
    "Generate a new domain folder with controller, service, routes, and schema"
  )
  .action((name) => {
    const domainParts = name.split("/");
    const domainPath = path.join(ROOT, "src", "domains", ...domainParts);

    if (fs.existsSync(domainPath)) {
      logger.error(`Domain ${name} already exists!`);
      process.exit(1);
    }

    fs.ensureDirSync(domainPath);
    name = domainParts.at(-1);

    const className = (name) => {
      return name
        .split(/[-_ ]+/)
        .map((s) => capitalize(s))
        .join("");
    };

    const schemaName = (name) => {
      return name.split(/[-_ ]+/).join("");
    };

    const controllerTemplate = `
import ${className(name)}Service from "./${name}.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class ${className(name)}Controller extends BaseController {
  constructor() {
    super(${className(name)}Service);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = ${className(name)}Service
  }

  async someMethod(req, res) {
    // implement method logic here
  }
}

export default new ${className(name)}Controller();
`;

    const serviceTemplate = `
import BaseService from "../../common/base_classes/base-service.js";

class ${className(name)}Service extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }
  
  async someMethod() {
    // implement method logic here
  }
}

export default new ${className(name)}Service();
`;

    const routesTemplate = `
import ${className(name)}Controller from "./${name}.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { ${schemaName(name)}Schema } from './${name}.schema.js';

class ${className(name)}Routes extends BaseRoutes {
  constructor() {
    super(${className(name)}Controller);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.get("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.errCatch(this.controller.someMethod.bind(this.controller))
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(${schemaName(name)}Schema),
      this.errCatch(this.controller.someMethod.bind(this.controller))
    ]);
  }
}

export default new ${className(name)}Routes().router;
`;

    const schemaTemplate = `
import Joi from "joi";

const ${schemaName(name)}Schema = Joi.object({
  // Define your validation schema here
});

export { ${schemaName(name)}Schema };
`;

    fs.writeFileSync(
      path.join(domainPath, `${name}.controller.js`),
      controllerTemplate
    );
    fs.writeFileSync(
      path.join(domainPath, `${name}.service.js`),
      serviceTemplate
    );
    fs.writeFileSync(
      path.join(domainPath, `${name}.routes.js`),
      routesTemplate
    );
    fs.writeFileSync(
      path.join(domainPath, `${name}.schema.js`),
      schemaTemplate
    );

    logger.info(`Domain '${name}' created successfully!`);
  });

program.parse(process.argv);
