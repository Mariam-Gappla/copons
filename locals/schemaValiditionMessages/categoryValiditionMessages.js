const messages = {
    en: {
      nameRequired: "Category name is required.",
      imageRequired: "Category image is required."
    },
    ar: {
      nameRequired: "اسم التصنيف مطلوب.",
      imageRequired: "صورة التصنيف مطلوبة."
    }
}
const getMessages = (lang = 'ar') => {
    return messages[lang] || messages.ar;
};
module.exports=getMessages;
