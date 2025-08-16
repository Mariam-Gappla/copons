const messages = {
  en: {
    codeRequired: "Coupon code is required.",
    codeUnique: "This coupon code already exists.",
    discountValueRequired: "Discount value is required.",
    discountTypeRequired: "Discount type is required.",
    startDateRequired: "Start date is required.",
    endDateRequired: "End date is required.",
    invalidDiscountType: "Discount type must be either 'percentage' or 'amount'.",
    invalidDateRange: "End date must be after start date.",
    invalidDate: "Invalid date format."

  },
  ar: {
    codeRequired: "كود الكوبون مطلوب.",
    codeUnique: "هذا الكود مستخدم من قبل.",
    discountValueRequired: "قيمة الخصم مطلوبة.",
    discountTypeRequired: "نوع الخصم مطلوب.",
    startDateRequired: "تاريخ بداية الصلاحية مطلوب.",
    endDateRequired: "تاريخ نهاية الصلاحية مطلوب.",
    invalidDiscountType: "نوع الخصم يجب أن يكون نسبة مئوية أو مبلغ ثابت.",
    invalidDateRange: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية.",
    invalidDate: "صيغة التاريخ غير صالحة."
  }
};
const getMessages = (lang = 'en') => {
    return messages[lang] || messages.ar;
};
module.exports=getMessages;
