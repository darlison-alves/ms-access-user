import { RoleEnum } from "../enums/role.enum";

export interface IPayloadPurchase {
    pattern: string;
    productId: string;
    email: string;
    serviceKey: string;
    productRole: RoleEnum
}