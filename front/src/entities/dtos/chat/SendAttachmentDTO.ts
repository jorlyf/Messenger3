import { AttachmentTypes } from "../../local/Attachment";

export default interface SendAttachmentDTO {
  type: AttachmentTypes;
  formFile: File;
}