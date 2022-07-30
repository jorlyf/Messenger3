import { AttachmentTypes } from "../db/AttachmentModel";

export default interface AttachmentDTO {
  type: AttachmentTypes;
  file: File;
}