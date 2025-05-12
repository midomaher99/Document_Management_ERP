const mongoose = require('mongoose')
const validator = require('validator')
const { parsePhoneNumberFromString } = require('libphonenumber-js')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User must have an email'],
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: 'Email is not valid',
        }
    },
    phone: {
        type: String,
        required: [true, 'User must have a phone number'],
        validate: {
            validator: function (value) {
                const phone = parsePhoneNumberFromString(value);
                return phone && phone.isValid();
            },
            message: 'Phone number is not valid',
        }
    },
    password: {
        type: String,
        required: [true, 'User must have a password']
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'manager', 'member'],
            message: "invalid role"
        },
        required: [true, 'User must have a role']
    },
    photo: {
        type: String
    }
})


function normalizeQueryConditions(next) {
    if (this._conditions.email) {
        this._conditions.email = this._conditions.email.toLowerCase();
    }

    if (this._conditions.phone) {
        const parsed = parsePhoneNumberFromString(this._conditions.phone, 'EG');
        if (parsed && parsed.isValid()) {
            this._conditions.phone = parsed.number;
        }
    }
    next();
}

userSchema.pre('findOne', normalizeQueryConditions);

const User = new mongoose.model('User', userSchema)

module.exports = User