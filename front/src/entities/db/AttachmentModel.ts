export enum AttachmentTypes {
  photo = 0,
  video = 1,
  file = 2
}

export default interface AttachmentModel {
  id: number;
  type: AttachmentTypes;
  url: string;
}