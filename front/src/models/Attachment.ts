import { AttachmentTypes } from "./AttachmentModel";

export default interface Attachment {
  id: string;
  type: AttachmentTypes;
  url: string;
}