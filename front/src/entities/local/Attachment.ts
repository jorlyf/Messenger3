export enum AttachmentTypes {
  photo = 0,
  video = 1,
  file = 2
}

export default interface Attachment {
  id: string;
  apiId: number | null;
  type: AttachmentTypes;
  url: string;
}