import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}

const logSchema = new Schema<ILog>({
  method: { type: String, required: true },
  url: { type: String, required: true },
  statusCode: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

// Index for efficient queries
logSchema.index({ timestamp: -1 });
logSchema.index({ statusCode: 1 });

export const Log = mongoose.model<ILog>("Log", logSchema);
