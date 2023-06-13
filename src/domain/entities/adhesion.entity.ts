import { Schema as SchemaMongo } from "mongoose"
import { Prop, Schema } from "@nestjs/mongoose";
import { IPayloadPurchase } from "../interfaces/payload.purchase.interface";

@Schema()
export class Adhesion {

    @Prop({ _id: true, auto: true })
    _id: SchemaMongo.Types.ObjectId;

    @Prop()
    productId: string;

    @Prop({ type: SchemaMongo.Types.Date })
    adhesionDate: Date;

    @Prop({ type: SchemaMongo.Types.ObjectId })
    userId: SchemaMongo.Types.ObjectId;;

    @Prop()
    status: string;

    static of(payload: IPayloadPurchase, status: string, userId: SchemaMongo.Types.ObjectId) {
        const adhesion = new Adhesion();
        adhesion.adhesionDate = new Date();
        adhesion.productId = payload.productId;
        adhesion.status = status;
        adhesion.userId = userId;
        return adhesion;
    }
}