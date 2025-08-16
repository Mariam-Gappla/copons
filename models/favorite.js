const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType' 
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Post', 'Order'] 
    }
  },
  {
    timestamps: true
  }
);

favoriteSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
