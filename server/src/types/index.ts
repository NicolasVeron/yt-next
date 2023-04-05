export interface IGetUserAuthInfoRequest extends Request {
    user?: {id: string, name: string}
}