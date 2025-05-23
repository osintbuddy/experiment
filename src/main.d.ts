export type ErrorKind = {
  kind: 'io' | 'utf8';
  message: string;
};