import mongoose from 'mongoose';

const investmentSchema = mongoose.Schema(
  { 
    connectedAccount: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountCurrencyType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Investment = mongoose.model('Investment', investmentSchema);