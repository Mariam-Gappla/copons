const getMessages = (lang) => {
    if(lang=== 'en')
    {
      return require("../locals/general/en.js")
    }
    else if(lang === 'ar')
    {
       return require("../locals/general/ar.js");
    }

}
module.exports = getMessages;