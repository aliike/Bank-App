import mongoose from 'mongoose';

const historySchema = mongoose.Schema(
  { 
    senderCustomerNumber: {
      type: String,
      required: true,
    },
    receiverCustomerNumber: {
      type: String,
      required: true,
      },
    amount: {
      type: Number,
      required: true,
    },
    transferType: {
      type: String,
      required: true,
    },
    currencyType: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const History = mongoose.model('History', historySchema);