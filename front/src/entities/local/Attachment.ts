import { AttachmentTypes } from "../db/AttachmentModel";

export default interface Attachment {
  id: string;
  type: AttachmentTypes;
  url: string;
}