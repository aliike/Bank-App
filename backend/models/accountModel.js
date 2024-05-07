import mongoose from 'mongoose';

const accountSchema = mongoose.Schema(
  { 
    customerNumber: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      },
    ibanNumber: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    registeredIbans: [{ type: String }]
  },
  {
    timestamps: true,
  }
);

export const Account = mongoose.model('Account', accountSchema);