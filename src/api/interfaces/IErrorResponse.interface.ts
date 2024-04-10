import { IResponseInterface } from './IResponse.interface';

export interface IErrorResponseInterface extends IResponseInterface {
  error_title: string;
  error: string;
}
