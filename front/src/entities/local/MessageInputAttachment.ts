import { AttachmentTypes } from "./Attachment";

export default interface MessageInputAttachment {
  id: string;
  type: AttachmentTypes;
  file: File;
}