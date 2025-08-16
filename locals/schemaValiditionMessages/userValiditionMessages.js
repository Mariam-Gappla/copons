const messages = {
    en: {
        register: {
            username: {
                required: "Username is required",
                string: "Username must be a string",
                min: "Username must be at least 3 characters",
                max: "Username must be at most 30 characters"
            },
            email: {
                invalid: "Invalid email format"
            },
            password: {
                required: "Password is required",
                min: "Password must be at least 6 characters"
            },
            confirmPassword: {
                required: "Confirm password is required",
                match: "Passwords must match"
            },
            phone: {
                required: "Phone number is required",
                min: "Phone number must be at least 3 characters"
            },

        },
        login: {
            phone: {
                required: "phone or email is required",
                invalid: "Invalid email or phone format"
            },
            password: {
                required: "Password is required"
            },
        }
    },

    ar: {
        register: {
            username: {
                required: "اسم المستخدم مطلوب",
                string: "يجب أن يكون اسم المستخدم نصًا",
                min: "يجب أن يكون اسم المستخدم على الأقل 3 أحرف",
                max: "يجب ألا يزيد اسم المستخدم عن 50 حرفًا"
            },
            email: {
                invalid: "صيغة البريد الإلكتروني غير صحيحة"
            },
            phone: {
                required: "رقم الهاتف مطلوب",
                min: "رقم الهاتف يجب أن يحتوي على 3 أحرف على الأقل"
            },
            password: {
                required: "كلمة المرور مطلوبة",
                min: "يجب أن تكون كلمة المرور على الأقل 6 أحرف"
            },
            confirmPassword: {
                required: "تأكيد كلمة المرور مطلوب",
                match: "كلمة المرور وتأكيدها غير متطابقين"
            },

        },
        login: {
            phone: {
                required: "رقم الهاتف او الايميل مطلوب",
                invalid: "صيغة رقم الهاتف او الايميل غير صحيحة"
            },
            password: {
                required: "كلمة المرور مطلوبة"
            },
        }
    }
};
const getMessages = (lang = 'en') => {
    return messages[lang] || messages.en;
};
module.exports = getMessages;