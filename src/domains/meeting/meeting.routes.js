import MeetingController from "./meeting.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import {
  proposeLocationSchema,
  locationDecisionSchema,
  qrGenerateSchema,
  qrScanSchema,
} from "./meeting.schema.js";

class MeetingRoutes extends BaseRoutes {
  constructor() {
    super(MeetingController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.post(
      "/:loanId/location",
      this.auth.authenticate,
      this.auth.role([this.roles.Seller]),
      this.validate(proposeLocationSchema),
      this.errCatch(this.controller.proposeLocation.bind(this.controller)),
    );

    this.router.patch(
      "/:loanId/decision",
      this.auth.authenticate,
      this.auth.role([this.roles.Customer]),
      this.validate(locationDecisionSchema),
      this.errCatch(this.controller.locationDecision.bind(this.controller)),
    );

    this.router.get(
      "/:loanId",
      this.auth.authenticate,
      this.errCatch(this.controller.getMeeting.bind(this.controller)),
    );

    this.router.post(
      "/:loanId/qr",
      this.auth.authenticate,
      this.auth.role([this.roles.Customer]),
      this.validate(qrGenerateSchema),
      this.errCatch(this.controller.generateQr.bind(this.controller)),
    );

    this.router.post(
      "/:loanId/scan",
      this.auth.authenticate,
      this.auth.role([this.roles.Seller]),
      this.validate(qrScanSchema),
      this.errCatch(this.controller.scanFinalize.bind(this.controller)),
    );
  }
}

export default new MeetingRoutes().router;
