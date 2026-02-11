import MeetingService from "./meeting.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class MeetingController extends BaseController {
  constructor() {
    super(MeetingService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = MeetingService
  }

  async proposeLocation(req, res) {
    const { lat, lon, address } = req.body;
    const data = await this.service.proposeLocation(
      req.user,
      req.params.loanId,
      { lat, lon, address },
    );
    return this.response.success(res, data, "Location proposed");
  }

  async locationDecision(req, res) {
    const { decision } = req.body;
    const data = await this.service.locationDecision(
      req.user,
      req.params.loanId,
      decision,
    );
    return this.response.success(res, data, "Location decision updated");
  }

  async getMeeting(req, res) {
    const data = await this.service.getMeeting(req.user, req.params.loanId);
    return this.response.success(res, data, "Meeting fetched");
  }

  async generateQr(req, res) {
    const data = await this.service.generateQr(req.user, req.params.loanId);
    return this.response.success(res, data, "QR generated");
  }

  async scanFinalize(req, res) {
    const { token } = req.body;
    const data = await this.service.scanFinalize(
      req.user,
      req.params.loanId,
      token,
    );
    return this.response.success(res, data, "Transfer finalized");
  }
}

export default new MeetingController();
