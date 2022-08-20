import { AttachmentTypes } from "../../local/Attachment";

export default interface AttachmentDTO {
  id: number;
  type: AttachmentTypes;
  url: string;
}