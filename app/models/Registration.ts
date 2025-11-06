import mongoose, { Schema, Document, models } from "mongoose";

export interface IRegistration extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  eventId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  totalAmount: number;
  registeredAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    tickets: {
      type: Number,
      required: [true, "Number of tickets is required"],
      min: [1, "At least one ticket required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Invalid total amount"],
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Registration =
  models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;

