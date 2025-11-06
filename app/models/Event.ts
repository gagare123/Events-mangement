import mongoose, { Schema, Document, models } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  capacity: number;
  availableSeats: number;
  category: string;
  price: number;
  image?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    availableSeats: {
      type: Number,
      min: [0, "Available seats cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

// 🧠 Auto-set default availableSeats = capacity if missing
EventSchema.pre("save", function (next) {
  if (this.isNew) {
    if (this.availableSeats == null || isNaN(this.availableSeats)) {
      this.availableSeats = this.capacity;
    }
  }

  if (this.availableSeats > this.capacity) {
    this.availableSeats = this.capacity;
  }

  next();
});

const Event = models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;


