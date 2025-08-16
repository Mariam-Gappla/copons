const cron = require("node-cron");
const Coupon = require("../models/copons");

cron.schedule("0 0 * * *", async () => {
  const today = new Date();

  // فعّل المنتهية
  await Coupon.updateMany(
    { endDate: { $lt: today } },
    { $set: { isActive: false } }
  );

  // فعّل الفعالة (اختياري لو بتعيد تفعيل)
  await Coupon.updateMany(
    { endDate: { $gte: today } },
    { $set: { isActive: true } }
  );

  console.log("✅ كوبونات تم تحديث حالتها بناءً على التاريخ");
});
