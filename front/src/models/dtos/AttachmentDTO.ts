import { AttachmentTypes } from "../AttachmentModel";

export default interface AttachmentDTO {
  type: AttachmentTypes;
  file: File;
}